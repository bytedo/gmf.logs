![module info](https://nodei.co/npm/@gm5/logs.png?downloads=true&downloadRank=true&stars=true)

# @gm5/logs

> 日志存储拓展。

## 安装

```bash
npm install @gm5/logs
```

## 使用

```js
import Logs from '@gm5/logs'

// 安装时传入日志目录
app.install(Logs, './data/logs')


app.$$logs.info('hello world')

```


## API

安装之后, 有3个对外的方法, 对应3个等级的日志, 即

+ .info(msg`<String>`)
+ .warn(msg`<String>`)
+ .error(msg`<String>`)


