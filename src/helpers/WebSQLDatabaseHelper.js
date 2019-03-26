WebSQLDatabaseHelper = {
  db: null,
  init: function (callback) {
    if (this.db === null) {
      let databaseName = 'bloggerEditor'
      let version = '1.0'
      let databaseDescription = 'Database for posts stroages'
      let size = 5*1024*1024
      this.db = window.openDatabase( databaseName, 
        version, 
        databaseDescription, 
        size);
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
        if (typeof(callback) === 'function') {
          tx.executeSql(sql, dataArray, (tx, result) => {
            //console.log('AAAAAAA')
            //console.log(result)
            FunctionHelper.triggerCallback(callback, result.rows)
          })
        }
        else {
          tx.executeSql(sql)
        }
      })
    })
  },
  //createTable: function (callback) {
  //  this.db.transaction(function(tx){
  //    tx.executeSql("Create Table posts(id INTEGER PRIMARY KEY, createUnix INTEGER, updateUnix INTEGER, title TEXT, abstract TEXT)");
  //    
  //    FunctionHelper.triggerCallback(callback)
  //  });
  //},
  
}

WebSQLDatabaseHelper.init()