// 引入 sql.js 庫，用於在 WebAssembly 中操作 SQLite 資料庫
// import initSqlJs from 'sql.js';

// 引入 FunctionHelper 和 WindowHelper，這些是原始程式碼中使用的輔助函數
// FunctionHelper 用於觸發回調函數
// WindowHelper 用於處理錯誤
// import FunctionHelper from './FunctionHelper';
// import WindowHelper from './WindowHelper';

let SQLiteDatabaseHelper = {
  db: null, // SQLite 資料庫實例
  SQL: null, // sql.js 模組，包含資料庫類和錯誤處理
  quota: 30 * 1024 * 1024 /*5MB*/,
  filePath: 'database.sqlite',
  debug: false, // 是否啟用除錯模式
  
  // 初始化資料庫
  init: async function (callback) {
    // 如果資料庫尚未初始化
    if (this.db === null) {
      try {
        await navigator.webkitPersistentStorage.requestQuota(this.quota)
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

        let savedDB
        try {
          savedDB = await this.readSavedDB();
        }
        catch (e) {
          if (this.debug) {
            console.error('❌ 無法讀取資料庫檔案:', e);
            console.log('📂 沒有找到資料庫檔案，將建立新資料庫');
          }
        }

        let SQL = await this.initSQL(); // 確保 SQL 模組已載入
        if (savedDB) {
          // 如果有，從 localStorage 載入
          // const uInt8Array = Uint8Array.from(atob(savedDB), c => c.charCodeAt(0));
          // db = new SQL.Database(uInt8Array);
          this.db = new SQL.Database(savedDB);
          if (this.debug) {
            console.log('📂 成功載入資料庫檔案');
          }
        } else {
          // 沒有就新建一個
          this.db = new SQL.Database();
          if (this.debug) {
            console.log('✨ 建立新資料庫');
          }
        }

        if (this.debug) {
          console.log('📦 資料庫已初始化:', this.db);
        }
      } catch (e) {
        console.error('Failed to initialize SQLite database:', e);
        WindowHelper.errorHandler(e); // 使用 WindowHelper 處理錯誤
        return;
      }
    }
    // 觸發回調函數
    FunctionHelper.triggerCallback(callback);
  },
  initSQL: async function () {
    return new Promise((resolve, reject) => {
      if (this.SQL) {
        resolve(this.SQL);
      } else {
        const config = {
          locateFile: filename => `https://unpkg.com/sql.js@latest/dist/${filename}`
        };
        // 如果 SQL 尚未載入，則載入 sql.js 模組
        initSqlJs(config).then((SQL) => {
          this.SQL = SQL;
          resolve(SQL);
        }).catch((error) => {
          console.error('Failed to load sql.js:', error);
          reject(error);
        });
      }
    });
  },
  readSavedDB: function () {
      return new Promise((resolve, reject) => {
        window.requestFileSystem(window.PERSISTENT, this.quota, (fs) => {
          fs.root.getFile(this.filePath, {}, (fileEntry) => {
            fileEntry.file((file) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                // 將讀取的 ArrayBuffer 轉換為 Uint8Array
                if (this.debug) {
                  console.log('📂 讀取檔案成功:', fileEntry.name);
                }
                resolve(new Uint8Array(reader.result));
              };
              reader.onerror = (error) => {
                reject(error);
              };
              reader.readAsArrayBuffer(file);
            }, (error) => {
              reject(error);
            });
          }, (error) => {
            reject(error);
          });
        }, (error) => {
          reject(error);
        });
      });
  },

  // 執行 SQL 語句
  exec: async function (sql, dataArray, callback) {
    if (this.debug) {
      console.log('[EXEC] ' + sql); // 輸出執行的 SQL 語句
    }
    // 處理參數重載：如果 dataArray 是函數，則它是回調函數
    if (typeof(dataArray) === 'function') {
      callback = dataArray;
      dataArray = [];
    }
    
    // 確保資料庫已初始化
    await this.init(); // 修改：等待資料庫初始化完成

    try {
      let output;
      // 檢查是否為 SELECT 語句
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        // 執行查詢並獲取結果
        const res = this.db.exec(sql, dataArray); // 修改：使用 db.exec 執行查詢
        if (res.length > 0) {
          // 將結果轉換為原始 WebSQL 期望的格式 (物件陣列)
          output = res[0].values.map(row => {
            let obj = {};
            res[0].columns.forEach((col, idx) => {
              obj[col] = row[idx];
            });
            return obj;
          });
        } else {
          output = [];
        }
      } else {
        // 對於非 SELECT 語句 (INSERT, UPDATE, DELETE)
        this.db.run(sql, dataArray); // 修改：使用 db.run 執行非查詢語句
        // 如果是 INSERT 語句，獲取最後插入的 ID
        if (sql.trim().toUpperCase().startsWith('INSERT')) {
          const res = this.db.exec('SELECT last_insert_rowid() AS last_id'); // 修改：獲取最後插入的 ID
          if (res.length > 0 && res[0].values.length > 0) {
            output = res[0].values[0][0]; // 獲取 last_insert_rowid 的值
          } else {
            output = null; // 如果沒有獲取到 ID，則為 null
          }
        } else {
          output = null; // 對於 UPDATE/DELETE，沒有特定的輸出
        }
      }
      await this.writeSavedDB(); // 儲存資料庫到檔案系統
      
      // 觸發回調函數，並傳遞結果
      FunctionHelper.triggerCallback(callback, output);
    } catch (e) {
      // 處理執行 SQL 語句時的錯誤
      this.errorHandler(e, sql); // 使用 errorHandler 處理錯誤
    }
  },
  writeSavedDB: function () {
      return new Promise((resolve, reject) => {
        window.requestFileSystem(window.PERSISTENT, this.quota, (fs) => {
          // localStorage.setItem('myDatabase', base64String);
          fs.root.getFile(this.filePath, {
            create: true, exclusive: false
          }, (fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              // console.log(binaryArray)
              const binaryArray = this.db.export();
              const blob = new Blob([binaryArray], { type: 'application/octet-stream' });
              fileWriter.write(blob);
              if (this.debug) {
                console.log('📦 資料庫已寫入檔案系統:', this.filePath);
              }
              
            }, (error) => {
              reject('❌ 無法寫入檔案:', error);
            });
          }, (error) => {
            reject('❌ 無法取得檔案:', error);
          });

          if (this.debug) {
            console.log('💾 資料庫已儲存到 FileSystem');
          }
          resolve(true); // 成功儲存後解析 Promisep
        }, (error) => {
          reject(error);
        });
      });
  },

  // 錯誤處理函數
  errorHandler: function (e, sql) {
    WindowHelper.errorHandler(e); // 使用 WindowHelper 處理錯誤
    console.trace(`SQLiteDatabaseHelper error: ${sql}`); // 追蹤錯誤來源
    console.log(e); // 輸出錯誤詳情
  }
}

// 將 SQLiteDatabaseHelper 暴露到 window 物件上，以便全局訪問
// window.SQLiteDatabaseHelper = SQLiteDatabaseHelper;

// Alias
window.WebSQLDatabaseHelper = SQLiteDatabaseHelper;
// 預設匯出 SQLiteDatabaseHelper
export default SQLiteDatabaseHelper;
