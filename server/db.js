// db.js
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./diary.db', (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message)
  } else {
    console.log('✅ 成功连接数据库')

    // 创建文档表
    db.run(`
      CREATE TABLE IF NOT EXISTS document (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        diaryId TEXT NOT NULL UNIQUE,
        diaryTitle TEXT NOT NULL,
        diaryClassify TEXT NOT NULL,
        diaryToken TEXT NOT NULL,
        date TEXT NOT NULL,
        airWetness TEXT NOT NULL,
        lightIntensity TEXT NOT NULL,
        envTemperature TEXT NOT NULL,
        dataExplain TEXT NOT NULL,
        staffSuggest TEXT NOT NULL,
        process TEXT NOT NULL,
        state TEXT NOT NULL,
        remind TEXT NOT NULL,
        isEnv INTEGER NOT NULL DEFAULT 0,
        batchChecked INTEGER NOT NULL DEFAULT 0,
        createEmployee TEXT NOT NULL,
        submitEmployee TEXT,
        submitDate TEXT,
        staffId TEXT NOT NULL,
        approvalManager TEXT,
        approvalDate TEXT,
        confirmEmployee TEXT,
        confirmDate TEXT
      )
    `, (err) => {
      if (err) {
        console.error('创建文档表失败:', err.message)
      } else {
        console.log('✅ 文档表已就绪')
      }
    })

    // 创建员工表
    db.run(`
      CREATE TABLE IF NOT EXISTS employee (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        avatar TEXT DEFAULT '',
        read INTEGER DEFAULT 0
      )
    `, (err) => {
      if (err) {
        console.error('创建员工表失败:', err.message)
      } else {
        console.log('✅ 员工表已就绪')
      }
    })
    // 创建邮件表（无外键，完全独立）
    db.run(`
  CREATE TABLE IF NOT EXISTS email (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    avatar TEXT DEFAULT '',
    date TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    sendPerson TEXT NOT NULL,
    text TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    username TEXT NOT NULL
  )  -- 这里补全右括号
`, (err) => {
      if (err) {
        console.error('创建邮件表失败:', err.message)
      } else {
        console.log('✅ 邮件表已就绪')
      }
    })
    db.run(`
  CREATE TABLE IF NOT EXISTS envData (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
      if (err) {
        console.error('创建环境数据表失败:', err.message)
      } else {
        console.log('✅ 环境数据表已就绪')
      }
    })
  }
})

module.exports = db
