// 引入 sql.js 庫，用於在 WebAssembly 中操作 SQLite 資料庫
// import initSqlJs from 'sql.js';

// 引入 FunctionHelper 和 WindowHelper，這些是原始程式碼中使用的輔助函數
// FunctionHelper 用於觸發回調函數
// WindowHelper 用於處理錯誤
import FunctionHelper from './FunctionHelper';
import WindowHelper from './WindowHelper';

let SQLiteDatabaseHelper = {
  db: null, // SQLite 資料庫實例
  SQL: null, // sql.js 模組，包含資料庫類和錯誤處理
  
  // 初始化資料庫
  init: async function (callback) {
    // 如果資料庫尚未初始化
    if (this.db === null) {
      try {
        // 載入 sql.js WASM 模組
        // 這裡假設 sql.js 的 WASM 檔案位於 /static/sql-wasm.wasm
        // 根據實際部署路徑可能需要調整 locateFile 函數
        this.SQL = await initSqlJs({ locateFile: file => `/static/sql.js/sql-wasm.wasm` }); // 修改：載入 sql.js WASM 模組
        // 建立一個新的記憶體資料庫
        this.db = new this.SQL.Database(); // 修改：建立 SQLite 資料庫實例
        console.log('SQLite database initialized successfully.');
      } catch (e) {
        console.error('Failed to initialize SQLite database:', e);
        WindowHelper.errorHandler(e); // 使用 WindowHelper 處理錯誤
        return;
      }
    }
    // 觸發回調函數
    FunctionHelper.triggerCallback(callback);
  },

  // 執行 SQL 語句
  exec: async function (sql, dataArray, callback) {
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
      
      // 觸發回調函數，並傳遞結果
      FunctionHelper.triggerCallback(callback, output);
    } catch (e) {
      // 處理執行 SQL 語句時的錯誤
      this.errorHandler(e, sql); // 使用 errorHandler 處理錯誤
    }
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
