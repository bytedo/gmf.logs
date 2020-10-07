/**
 * 日志记录
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/10/06 20:20:30
 */

import { fork } from 'child_process'
import url from 'url'
import path from 'path'

var __dirname = path.dirname(url.fileURLToPath(import.meta.url))
var child = fork(path.join(__dirname, 'logs.js'))

export default {
  name: 'logs',
  install(dir) {
    // 在初始化之前写入的日志, 会失败, 所以要先扔进临时队列中
    // 初始化之后再写入
    var queue = []
    var ready = false

    child.on('message', _ => {
      child.send({ type: 'init', dir })
      ready = true
      post()
    })

    // 发送日志
    function post(item) {
      if (item) {
        queue.push(item)
      }

      if (ready) {
        while (queue.length) {
          child.send(queue.shift())
        }
      }
    }

    return {
      info(msg) {
        post({ type: 'info', msg })
      },
      warn(msg) {
        post({ type: 'warn', msg })
      },
      error(msg) {
        post({ type: 'error', msg })
      }
    }
  }
}
