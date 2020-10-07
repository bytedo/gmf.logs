import fs from 'fs'
import path from 'path'

import Queue from './queue.js'

var list = new Queue()
var file
var currSize = 0
var ws
var ready = false

list.on('data', _ => {
  while (list.size) {
    ws.write(list.shift())
  }
})

process.on('message', _ => {
  //
  switch (_.type) {
    case 'init':
      file = path.resolve(_.dir, 'app_debug.log')
      ws = fs.createWriteStream(file, { flags: 'a' })
      ws.once('ready', _ => {
        ready = true
        list.emit('data')
        currSize = fs.statSync(file).size
      })
      break
    default:
      var now = new Date().toISOString()
      var data = `[${_.type}] ${now} ${_.msg}\n`
      var len = Buffer.byteLength(data)
      var id = 1

      list.append(data)

      if (ready) {
        // 日志文件大于512MB, 自动分割文件
        if (currSize + len > 1024 * 1024 * 512) {
          ready = false
          ws.close()

          try {
            // fs.constants.F_OK
            while (fs.accessSync(`${file}.${id}`, 0) === undefined) {
              id++
            }
          } catch (e) {}

          fs.renameSync(file, `${file}.${id}`)
          ws = fs.createWriteStream(file, { flags: 'a' })

          currSize = len
          ws.once('ready', _ => {
            ready = true
            list.emit('data')
          })
        } else {
          currSize += len
          list.emit('data')
        }
      }
      break
  }
})

// 发送一个空消息, 通知主进程已经就绪
process.send(null)
