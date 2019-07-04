let config = {
  data: function () {
    return {
      name: 'SnippetInserter',
      ui: undefined,
      inited: false,
      snippets: [],
      filterCondition: '',
      editingId: null,
      editingSnippetName: '',
      editingSnippet: '',
      postId: -1,
      editingSnippetStarred: 0,
      scope: 'all',
      editingSnippetView: 'code'
    }
  },
  computed: {
    matchedSnippets: function () {
      if (Array.isArray(this.snippets) === false) {
        return []
      }
      
      let matchedStarred = []
      let matchedUnstarred = []
      
      /*
      return this.snippets.filter((snippet) => {
        return ((this.filterCondition.trim() === "") 
                || snippet.name.indexOf(this.filterCondition) > -1
                || snippet.snippet.indexOf(this.filterCondition) > -1)
      })
      */
      this.snippets.filter((snippet) => {
        if (((this.filterCondition.trim() === "") 
                || snippet.name.indexOf(this.filterCondition) > -1
                || snippet.snippet.indexOf(this.filterCondition) > -1)) {
          if (snippet.starred === 1) {
            matchedStarred.push(snippet)
          }
          else {
            matchedUnstarred.push(snippet)
          }
        }
      })
      
      // 排序
      matchedStarred.sort(function(a, b) {
          return b.lastUsedUnix - a.lastUsedUnix;
      });
      
      matchedUnstarred.sort(function(a, b) {
          return b.lastUsedUnix - a.lastUsedUnix;
      });
      
      // 回傳
      let matched = matchedStarred.concat(matchedUnstarred).map((snippet) => {
        snippet.plainText = $(`<span>${snippet.snippet}</span>`).text()
        if (snippet.plainText.length > 100) {
          snippet.plainText = snippet.plainText.slice(0, 100)
        }
        return snippet
      })
      
      return matched
    },
    isSaveDisabled: function () {
      if (this.editingId === null 
              || this.editingSnippet.trim() === "") {
        return true
      }
      else {
        return false
      }
    }
  },
  created: function () {
    $v[this.name] = this
  },
  methods: {
    // ---------------------
    // Methods of Modal
    // ---------------------
    
    getUI: function () {
      if (typeof(this.ui) === 'undefined') {
        //console.log('find ui')
        this.ui = $(this.$refs.modal)
      }
      return this.ui
    },
    open: function () {
      this.init(() => {
        this.openReset()
        if (this.snippets.length === 0) {
          this.createSnippet()
        }
        this.getUI().modal('show')
      })
    },
    openReset: function () {
      this.editingId = null
      this.editingSnippetView = 'code'
    },
    close: function () {
      this.getUI().modal('hide')
    },
    persist() {
      //VueHelper.persistLocalStorage(this, 'summerNoteConfigStyleTags')
    },
    
    // ---------------------
    // data
    // ---------------------
    
    init: function (callback) {
      if (this.inited === false) {
        this.inited = true
        
        let sqlCreateTable = `Create Table if not exists snippets
          (id INTEGER PRIMARY KEY, 
           lastUsedUnix INTEGER, 
           name TEXT, 
           snippet TEXT,
           postId INTEGER,
           starred INTEGER)`
        WebSQLDatabaseHelper.exec(sqlCreateTable, () => {
          this.loadSnippet((snippets) => {
            //console.log('init')
            //consoeditingSnippetle.log(rows)
            //console.log(snippets.length)
            
            EventManager.on($v.PostManager, 'changeEditingPostId', (PostManager) => {
              this.loadSnippet()
            })
            
            FunctionHelper.triggerCallback(callback)
          })
        })
      }
      else {
        FunctionHelper.triggerCallback(callback)
      }
    },
    createSnippet: function () {
      this.editingSnippetName = ''
      this.editingSnippetStarred = 0
      this.editingSnippetView = 'code'
      this.editingSnippet = ''
      this.editingId = '?'
    },
    editSnippet: function (id) {
      //console.log('editSnippet', id)
      let snippet = this.filterSnippet(id)
      if (snippet !== undefined) {
        this.editingId = id
        this.editingSnippetName = snippet.name
        this.editingSnippet = snippet.snippet
        this.editingSnippetStarred = snippet.starred
        this.getUI().find('input[name="snippetName"]').focus()
      }
    },
    insertSnippet: function (id, snippet) {
      //console.log('insertSnippet', id)
      if (snippet === undefined) {
        snippet = this.filterSnippet(id)
      }
      
      if (snippet !== undefined) {
        let code = snippet.snippet
        $v.EditorManager.FieldPostBody.insert(code)
        this.close()
        this.moveSnippetToTop(snippet)
        this.updateSnippetLastUsedUnix(snippet)
      }
      else {
        this.close()
      }
    },
    deleteSnippet: function (id) {
      //console.log(id)
      let message = this.$t('Are you sure to delete snippet')
      message = message + ` #${id}?`
      WindowHelper.confirm(message, () => {
        let sql = `DELETE FROM snippets WHERE id=${id}`
        WebSQLDatabaseHelper.exec(sql)
        this.snippets = this.snippets.filter(s => s.id !== id)
      })
    },
    saveAndInsertSnippet: function () {
      this.saveSnippet((id, snippet) => {
        this.insertSnippet(id, snippet)
      })
    },
    saveSnippet: function (snippet, callback) {
      if (typeof(snippet) === 'function') {
        callback = snippet
        snippet = undefined
      }
      if (snippet !== undefined && snippet.type === 'click' ) {
        snippet = undefined
      }
      if (typeof(snippet) === 'string') {
        snippet = this.buildNewSnippetFromText(snippet)
      }
      //console.log(snippet)
      
      let unix = DayjsHelper.unix()
      let sql
      let data
      
      if (snippet === undefined) {
        if (this.scope === 'all') {
          this.postId = -1
        }
        else {
          this.postId = $v.PostManager.editingPostId
        }
        
        data = [unix, this.editingSnippetName, this.editingSnippet, this.postId, this.editingSnippetStarred]
        
        if (typeof(this.editingId) === 'number') {
          // update
          sql = `UPDATE snippets SET 
            lastUsedUnix = ?,
            name = ?,
            snippet = ?,
            postId = ?,
            starred = ?
            WHERE id = ${this.editingId}`
        }
        else {
          // create
          sql = `insert into 
            snippets(lastUsedUnix, name, snippet, postId, starred) 
            values(?,?,?,?,?)`
        }
      }
      else {
        data = [unix, snippet.name, snippet.snippet, snippet.postId, snippet.starred]
        sql = `insert into 
            snippets(lastUsedUnix, name, snippet, postId, starred) 
            values(?,?,?,?,?)`
      }
      
      //console.log('before save')
      //console.log(sql)
      //console.log(data)
      
      let webSqlCallback = (rows) => {
        let snippet = rows[0]
        //console.log(snippet)
        
        if (typeof(callback) === 'function') {
          callback(this.editingId, snippet)
        }

        this.moveSnippetToTop(snippet)
        this.editingId = null
      }
      
      WebSQLDatabaseHelper.exec(sql, data, (rows) => {
        //console.log('saved snippet')
        if (typeof(rows) === 'number') {
          rows = [{
              id: rows,
              name: this.editingSnippetName, 
              snippet: this.editingSnippet,
              postId: this.postId,
              starred: this.editingSnippetStarred,
              lastUsedUnix: unix
          }]
        }
        else {
          rows = [{
              id: this.editingId,
              name: this.editingSnippetName, 
              snippet: this.editingSnippet,
              postId: this.postId,
              starred: this.editingSnippetStarred,
              lastUsedUnix: unix
          }]
        }
        webSqlCallback(rows)
      })
    },
    buildNewSnippetFromText: function (text) {
      let name = $(`<span>${text}</span>`).text()
      
      if (name.length > 30) {
        name = name.slice(0, 30)
      }
      
      let snippet = {
        lastUsedUnix: 0,
        name: name,
        snippet: text,
        postId: $v.PostManager.editingPostId,
        starred: 0
      }
      //console.log(snippet)
      return snippet
    },
    moveSnippetToTop: function (snippet) {
      let id = snippet.id
      let matchedSnippet = this.filterSnippet(id)
      if (matchedSnippet !== undefined) {
        for (let key in matchedSnippet) {
          matchedSnippet[key] = snippet[key]
        }
      }
      else {
        this.snippets = this.snippets.concat(snippet)
      }
      //this.snippets.concat(snippet)
      /*
      if (matchedSnippet === undefined) {
        this.snippets = [snippet].concat(this.snippets)
      }
      else {
        let otherSnippets = this.snippets.filter(s => s.id !== id)
        this.snippets = [snippet].concat(otherSnippets)
      }
      */
    },
    updateSnippetLastUsedUnix: function (snippet, callback) {
      let unix = DayjsHelper.unix()
      let sql = `UPDATE snippets SET 
          lastUsedUnix = ?
          WHERE id = ${snippet.id}`
      let data = [unix]
      WebSQLDatabaseHelper.exec(sql, data, callback)
    },
    cancelEdit: function () {
      //console.log('saveSnippet')
      this.editingId = null
    },
    filterSnippet: function (id) {
      if (typeof(id) === 'number') {
        let output = this.snippets.filter(s => s.id === id)
        if (output.length > 0) {
          return output[0]
        }
      }
    },
    
    // ----------------------------
    // config
    // ----------------------------
    
    loadSnippet: function (callback) {
      let editingPostId = $v.PostManager.editingPostId
      let sqlSelect = `select * from snippets where (postId = -1 or postId = ${editingPostId}) order by starred, lastUsedUnix desc`
      //console.log(sqlSelect)
      WebSQLDatabaseHelper.exec(sqlSelect, (snippets) => {
        this.snippets = []
        if (Array.isArray(snippets) 
                && snippets.length > 0) {
          this.snippets = this.snippets.concat(snippets)
        }
        
        FunctionHelper.triggerCallback(callback, snippets)
      })
    },
    setConfig: function (snippets, callback) {
      if (typeof(snippets) === 'string') {
        snippets = JSON.parse(snippets)
      }
      //console.log('SnippetInsert setConfig')
      //console.log(snippets)
      
      let sqlDropTable = `delete from snippets`
      WebSQLDatabaseHelper.exec(sqlDropTable, () => {
        let loop = (i) => {
          if (i < snippets.length) {
            let snippet = snippets[i]
            let sql = `insert into 
              snippets(lastUsedUnix, name, snippet, postId, starred) 
              values(?,?,?,?,?)`
            let data = [
              snippet.lastUsedUnix,
              snippet.name,
              snippet.snippet,
              snippet.postId,
              snippet.starred
            ]
            WebSQLDatabaseHelper.exec(sql, data, () => {
              i++
              loop(i)
            })
          }
          else {
            this.snippets = snippets
            this.filterCondition = ''
            FunctionHelper.triggerCallback(callback)
          }
        }
        loop(0)
      })
    },
    toggleEditingSnippetView: function () {
      if (this.editingSnippetView === 'code') {
        this.editingSnippetView = 'preview'
      }
      else {
        this.editingSnippetView = 'code'
      }
      return this
    },
    textareaSelectAll: function () {
      this.editingSnippetView = 'code'
      this.getUI().find('#editingSnippet').select()
    },
    textareaCopy: function () {
      CopyPasteHelper.copyRichFormat(this.editingSnippet)
    },
    textareaEmpty: function () {
      this.editingSnippet = ''
      this.editingSnippetView = 'code'
    },
    toggleStarred: function (snippetId) {
      //console.log(snippetId)
      if (typeof(snippetId) !== "number") {
        this.editingSnippetStarred = (this.editingSnippetStarred + 1) % 2
      }
      else {
        let snippet = this.filterSnippet(snippetId)
        snippet.starred = (snippet.starred + 1) % 2
        
        let sql = `UPDATE snippets SET 
            starred = ?
            WHERE id = ${snippet.id}`
        let data = [snippet.starred]
        WebSQLDatabaseHelper.exec(sql, data)
      }
    },
    toggleScope: function (snippetId) {
      //console.log(snippetId)
      if (typeof(snippetId) !== "number") {
        if (this.postId === -1) {
          this.postId = $v.PostManager.editingPostId
        }
        else {
          this.postId = -1
        }
      }
      else {
        let snippet = this.filterSnippet(snippetId)
        if (snippet.postId === -1) {
          snippet.postId = $v.PostManager.editingPostId
        }
        else {
          snippet.postId = -1
        }
        
        let sql = `UPDATE snippets SET 
            postId = ?
            WHERE id = ${snippet.id}`
        let data = [snippet.postId]
        WebSQLDatabaseHelper.exec(sql, data)
      }
    }
  }
}

export default config