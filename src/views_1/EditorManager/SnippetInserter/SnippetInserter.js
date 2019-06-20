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
    }
  },
  computed: {
    matchedSnippets: function () {
      if (Array.isArray(this.snippets) === false) {
        return []
      }
      return this.snippets.filter((snippet) => {
        return ((this.filterCondition.trim() === "") 
                || snippet.name.indexOf(this.filterCondition) > -1
                || snippet.snippet.indexOf(this.filterCondition) > -1)
      })
    },
    isSaveDisabled: function () {
      if (this.editingId === null 
              || this.editingSnippet.trim() === "") {
        return 'disabled'
      }
      else {
        return 'green'
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
        this.getUI().modal('show')
      })
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
           snippet TEXT)`
        WebSQLDatabaseHelper.exec(sqlCreateTable, () => {
          this.getConfig((snippets) => {
            //console.log('init')
            //console.log(rows)
            if (snippets !== undefined) {
              this.snippets = this.snippets.concat(snippets)
            }
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
    saveSnippet: function (callback) {
      //console.log('saveSnippet')
      let unix = DayjsHelper.unix()
      let sql
      let data = [unix, this.editingSnippetName, this.editingSnippet]
      if (typeof(this.editingId) === 'number') {
        // update
        sql = `UPDATE snippets SET 
          lastUsedUnix = ?,
          name = ?,
          snippet = ?
          WHERE id = ${this.editingId}`
      }
      else {
        // create
        sql = `insert into 
          snippets(lastUsedUnix, name, snippet) 
          values(?,?,?)`
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

        this.editingId = null
        this.moveSnippetToTop(snippet)
      }
      
      WebSQLDatabaseHelper.exec(sql, data, (rows) => {
        //console.log('saved snippet')
        if (typeof(rows) === 'number') {
          rows = [{
              id: rows,
              name: this.editingSnippetName, 
              snippet: this.editingSnippet,
              lastUsedUnix: unix
          }]
        }
        else {
          rows = [{
              id: this.editingId,
              name: this.editingSnippetName, 
              snippet: this.editingSnippet,
              lastUsedUnix: unix
          }]
        }
        webSqlCallback(rows)
      })
    },
    moveSnippetToTop: function (snippet) {
      let id = snippet.id
      let matchedSnippet = this.filterSnippet(id)
      if (matchedSnippet === undefined) {
        this.snippets = [snippet].concat(this.snippets)
      }
      else {
        let otherSnippets = this.snippets.filter(s => s.id !== id)
        this.snippets = [snippet].concat(otherSnippets)
      }
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
    
    getConfig: function (callback) {
      let sqlSelect = `select * from snippets order by lastUsedUnix desc`
      WebSQLDatabaseHelper.exec(sqlSelect, (snippets) => {
        FunctionHelper.triggerCallback(callback, snippets)
      })
    },
    setConfig: function (snippets, callback) {
      if (typeof(snippets) === 'string') {
        snippets = JSON.parse(snippets)
      }
      console.log('SnippetInsert setConfig')
      console.log(snippets)
      
      let sqlDropTable = `delete from snippets`
      WebSQLDatabaseHelper.exec(sqlDropTable, () => {
        let loop = (i) => {
          if (i < snippets.length) {
            let snippet = snippets[i]
            let sql = `insert into 
              snippets(lastUsedUnix, name, snippet) 
              values(?,?,?)`
            let data = [
              snippet.lastUsedUnix,
              snippet.name,
              snippet.snippet
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
    }
  }
}

export default config