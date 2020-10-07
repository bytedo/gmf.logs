/**
 * 简易版队列
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/10/07 00:22:26
 */

import { EventEmitter } from 'events'
import { inherits } from 'util'

export default class Queue {
  constructor() {
    this.__store__ = []
  }

  get size() {
    return this.__store__.length
  }

  append(item) {
    this.__store__.push(item)
  }

  shift() {
    return this.__store__.shift()
  }
}

inherits(Queue, EventEmitter)
