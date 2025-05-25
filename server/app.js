const express = require('express')
const db = require('./db')
const app = express()
const port = 3000

// ================ 中间件配置 ================
app.use(express.urlencoded({ extended: true }))

// ================ 工具函数 ================
const safeParseJSON = (str) => {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

const boolConverter = (val) => {
  // 处理所有可能的类型
  if (typeof val === 'boolean') return val ? 1 : 0
  if (typeof val === 'number') return val !== 0 ? 1 : 0
  if (typeof val === 'string') {
    const lowerVal = val.toLowerCase()
    return lowerVal === 'true' || lowerVal === '1' ? 1 : 0
  }
  return 0 // 其他类型统一转为 false
}

// ================ 路由处理 ================

// 1. 获取所有数据
app.get('/', (req, res) => {
  db.all('SELECT * FROM document', (err, rows) => {
    if (err) {
      console.error('查询失败:', err)
      return res.status(500).json({
        code: 500,
        message: '数据库查询失败',
        error: err.message
      })
    }
    res.json({
      code: 200,
      data: rows.map(row => ({
        ...row,
        batchChecked: Boolean(row.batchChecked),
        isEnv: Boolean(row.isEnv)
      }))
    })
  })
})

// 2. 添加单条数据（GET 示例）
app.get('/add', (req, res) => {
  const {
    diaryId,
    diaryTitle,
    diaryClassify,
    diaryToken,
    date,
    airWetness,
    lightIntensity,
    envTemperature,
    dataExplain,
    staffSuggest,
    process,
    state,
    remind,
    isEnv,
    batchChecked,
    createEmployee,
    submitEmployee,
    submitDate,
    staffId,
    // 新增参数
    approvalManager,
    approvalDate,
    confirmEmployee,
    confirmDate
  } = req.query

  db.run(
    `INSERT INTO document (
      diaryId, diaryTitle, diaryClassify, diaryToken, date,
      airWetness, lightIntensity, envTemperature, dataExplain,
      staffSuggest, process, state, remind, isEnv, batchChecked,
      createEmployee, submitEmployee, submitDate, staffId,
      approvalManager, approvalDate, confirmEmployee, confirmDate
    ) VALUES (
      ?,?,?,?,?,?,?,?,?,?,
      ?,?,?,?,?,?,?,?,?,?,
      ?,?,?
    )`,
    [
      // 原有字段
      diaryId,
      diaryTitle,
      diaryClassify,
      diaryToken,
      date,
      airWetness,
      lightIntensity,
      envTemperature,
      dataExplain,
      staffSuggest,
      process,
      state,
      remind,
      boolConverter(isEnv),
      boolConverter(batchChecked),
      createEmployee,
      submitEmployee,
      submitDate,
      staffId,
      // 新增字段
      approvalManager || null,
      approvalDate || null,
      confirmEmployee || null,
      confirmDate || null
    ],
    function (err) {
      if (err) {
        console.error('添加失败:', err)
        return res.status(500).json({
          code: 500,
          message: '数据添加失败',
          error: err.message
        })
      }
      res.json({
        code: 200,
        data: { id: this.lastID }
      })
    }
  )
})
// 3. 批量更新接口（GET 方法）
app.get('/update', (req, res) => {
  const { newData } = req.query

  // 参数校验（完整校验流程）
  if (!newData) {
    return res.status(400).json({
      code: 400,
      message: '缺少必要参数: newData',
      example: '?newData=[{"diaryId":"123",...}]'
    })
  }

  // URL 解码（只解码一次）
  const decodedData = decodeURIComponent(newData)
  const parsedData = safeParseJSON(decodedData)

  if (!parsedData || !Array.isArray(parsedData)) {
    return res.status(400).json({
      code: 400,
      message: '数据格式错误',
      required: 'URL编码后的JSON数组',
      received: decodedData.slice(0, 100) + (decodedData.length > 100 ? '...' : '')
    })
  }

  // 事务处理
  db.serialize(() => {
    db.run('BEGIN TRANSACTION', (beginErr) => {
      if (beginErr) return handleTransactionError(res, beginErr)

      // 第一步：清空数据
      db.run('DELETE FROM document', (delErr) => {
        if (delErr) return rollbackAndRespond(res, delErr)
        // 第二步：准备插入
        const stmt = db.prepare(`
  INSERT INTO document (
    diaryId, diaryTitle, diaryClassify, diaryToken, date,
    airWetness, lightIntensity, envTemperature, dataExplain,
    staffSuggest, process, state, remind, isEnv, batchChecked,
    createEmployee, submitEmployee, submitDate, staffId,
    approvalManager, approvalDate, confirmEmployee, confirmDate
  ) VALUES (
    ?,?,?,?,?,?,?,?,?,?,
    ?,?,?,?,?,?,?,?,?,?,
    ?,?,?
  )
`)

        // 第三步：逐条插入
        try {
          parsedData.forEach((item, index) => {
            // 必填字段校验
            if (!item.diaryId) {
              throw new Error(`第 ${index + 1} 条数据缺少 diaryId`)
            }

            stmt.run(
              item.diaryId,
              item.diaryTitle || '', // 原第2个参数
              item.diaryClassify || '未分类', // 原第3个参数
              item.diaryToken || '',
              item.date || new Date().toISOString(),
              item.airWetness || '',
              item.lightIntensity || '',
              item.envTemperature || '',
              item.dataExplain || '',
              item.staffSuggest || '',
              item.process || '已新建',
              item.state || '未提交',
              item.remind || '未催办',
              boolConverter(item.isEnv), // 正确位置：第14个参数
              boolConverter(item.batchChecked), // 正确位置：第15个参数
              item.createEmployee || '未知',
              item.submitEmployee || '', // 确保必填字段有值
              item.submitDate || null,
              item.staffId || '',
              item.approvalManager || null,
              item.approvalDate || null,
              item.confirmEmployee || null,
              item.confirmDate || null
            )
          })
        } catch (insertErr) {
          return rollbackAndRespond(res, insertErr)
        }

        // 第四步：提交事务
        stmt.finalize((finalErr) => {
          if (finalErr) return rollbackAndRespond(res, finalErr)

          db.run('COMMIT', (commitErr) => {
            if (commitErr) return rollbackAndRespond(res, commitErr)
            res.json({
              code: 200,
              message: '数据更新成功'
            })
          })
        })
      })
    })
  })
})

// 4. 清空数据接口
app.get('/deleteAll', (req, res) => {
  db.run('DELETE FROM document', function (err) {
    if (err) {
      console.error('清空失败:', err)
      return res.status(500).json({
        code: 500,
        message: '数据清空失败',
        error: err.message
      })
    }
    res.json({
      code: 200,
      message: `已清空 ${this.changes} 条数据`
    })
  })
})
// 5. 获取环境数据
app.get('/getEnv', (req, res) => {
  db.all('SELECT * FROM envData ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      console.error('环境数据查询失败:', err)
      return res.status(500).json({
        code: 500,
        message: '环境数据查询失败',
        error: err.message
      })
    }
    res.json({
      code: 200,
      data: rows.map(row => ({
        id: row.id,
        text: row.text,
        time: row.createdAt // 使用数据库自动生成的时间戳
      }))
    })
  })
})
// ================ 事务辅助函数 ================
const handleTransactionError = (res, error) => {
  console.error('事务启动失败:', error)
  res.status(500).json({
    code: 500,
    message: '事务初始化失败',
    error: error.message
  })
}

const rollbackAndRespond = (res, error) => {
  db.run('ROLLBACK', (rollbackErr) => {
    if (rollbackErr) {
      console.error('回滚失败:', rollbackErr)
    }
    console.error('操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '数据库操作失败',
      error: error.message
    })
  })
}

// ================ 启动服务 ================
const server = app.listen(port, '0.0.0.0', () => { // [!code ++]
  console.log(`🚀 服务已启动：http://0.0.0.0:${port}`)
})

// ================ 添加 WebSocket 服务 ================
const WebSocket = require('ws')
const wss = new WebSocket.Server({ server })

// 当有客户端连接时
wss.on('connection', (ws) => {
  // 立即发送欢迎消息
  ws.send(JSON.stringify({
    type: 'welcome',
    message: '连接成功！',
    time: new Date().toLocaleString()
  }))
  // 接收客户端消息
  ws.on('message', (message) => {
    console.log('收到客户端消息:', message.toString())
    try {
      const msgString = message.toString()
      console.log('收到客户端消息:', msgString)
      // 存入数据库
      db.run(
        'INSERT INTO envData (text) VALUES (?)',
        [msgString],
        (err) => {
          if (err) {
            console.error('保存环境数据失败:', err.message)
          } else {
            console.log('💾 环境数据已存储')
          }
        }
      )
    } catch (err) {
      console.error('消息处理错误:', err.message)
    }
  })

  // 断开连接时
  ws.on('close', () => {
    console.log('客户端断开连接')
  })
})
