let WebSQLDatabaseHelper = {
  db: null,
  init: function (callback) {
    if (this.db === null) {
      let databaseName = 'bloggerEditor'
      let version = '1.0'
      let databaseDescription = 'Database for posts stroages'
      let size = 5*1024*1024
      try {
          this.db = window.openDatabase( databaseName, 
          version, 
          databaseDescription, 
          size);
      }
      catch (e) {
        window.alert('WebSQLDatabaseHelper init error:', e);
        if (window.confirm('WebSQLDatabaseHelper init error: ' + e + '\n\n是否要離開頁面？')) {
          window.close();
        }
        return;
      }
    }
    FunctionHelper.triggerCallback(callback)
  },
  exec: function (sql, dataArray, callback) {
    if (typeof(dataArray) === 'function') {
      callback = dataArray
      dataArray = []
    }
    
    this.init(() => {
      //console.log('[EXEC] ' + sql)
      this.db.transaction((tx) => {
        //console.log('[EXEC] ' + sql)
        //console.log(dataArray)
        if (typeof(callback) === 'function') {
          tx.executeSql(sql, dataArray, (tx, result) => {
            //console.log('AAAAAAA')
            //console.log(result)
            let output = result.rows
            try {
              if (typeof(result.insertId) === 'number') {
                output = result.insertId
              }
            } catch (e) {}
            
            if (typeof(output.length) === 'number') {
              let tempOutput = []
              for (let i = 0; i < output.length; i++) {
                tempOutput.push(output.item(i))
              }
              output = tempOutput
            }
            
            FunctionHelper.triggerCallback(callback, output)
          }, (tx, e) => {
            this.errorHandler(e)
          })
        }
        else {
          tx.executeSql(sql, dataArray, () => {}, (tx, e) => {
            this.errorHandler(e)
          })
        }
      })
    })
  },
  errorHandler: function (e, sql) {
    WindowHelper.errorHandler(e)
    console.trace(`WebSQLDatabaseHelper error: ${sql}`)
    console.log(e)
  }
  //createTable: function (callback) {
  //  this.db.transaction(function(tx){
  //    tx.executeSql("Create Table posts(id INTEGER PRIMARY KEY, createUnix INTEGER, updateUnix INTEGER, title TEXT, abstract TEXT)");
  //    
  //    FunctionHelper.triggerCallback(callback)
  //  });
  //},
  
}

window.WebSQLDatabaseHelper = WebSQLDatabaseHelper
export default WebSQLDatabaseHelper