# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2021-01-26)


### Features

* **about:** 完成关于面板 ([3582ab5](https://github.com/LightAPIs/Gloria-X/commit/3582ab5ae18533c293e4dd15ce2915d74aca34f6))
* **all:** 完成基本使用功能 ([637125f](https://github.com/LightAPIs/Gloria-X/commit/637125ff3d0298e61b6a7aa170c6390fc368573f))
* **language:** 添加对英文和繁体中文的支持 ([5769969](https://github.com/LightAPIs/Gloria-X/commit/5769969668cb387ccf8021d1b67721986e04ef7d))
* **notification:** 实现稍后查阅功能 ([541b11e](https://github.com/LightAPIs/Gloria-X/commit/541b11e046132cf27d8a8172dd0a0285ea143f80))
* **notification:** 实现显示未读通知数 ([a21d1d3](https://github.com/LightAPIs/Gloria-X/commit/a21d1d3dcdbeb6772bf635027b2f077e7933e74d))
* **notification:** 实现隐式推送功能 ([31fce56](https://github.com/LightAPIs/Gloria-X/commit/31fce56b624d7208a013663a6469917cd4de430b))
* **notification:** 添加任务执行出错通知提示 ([ae4bbce](https://github.com/LightAPIs/Gloria-X/commit/ae4bbce31b681769cddc234fba8c88e5669f92df))
* **notification:** 添加稍后查阅数量统计 ([6056d3f](https://github.com/LightAPIs/Gloria-X/commit/6056d3f843052b7d0cc85fc9c56cdbca105c0b9f))
* **Popup,Background,Store:** 完成 Popup 的显示及储存数据功能 ([917274c](https://github.com/LightAPIs/Gloria-X/commit/917274cb82ac26b9c431d6e5cef592cadd2408c6))
* **task:** 完成任务的安装和检查更新功能 ([e76bd59](https://github.com/LightAPIs/Gloria-X/commit/e76bd59a22a9825bccd9b06be95ea744a73f2a44))


### Bug Fixes

* **calc:** 修复准时模式不生效的问题 ([0535249](https://github.com/LightAPIs/Gloria-X/commit/05352499aed13527c472f63c734a7a0a36b91aea))
* **inject-button:** 修复某些情况下无法在任务页面注入按钮的问题 ([f8a5805](https://github.com/LightAPIs/Gloria-X/commit/f8a58051c61cd2c845945ea6c011c916035f0a83))
* **inject-button:** 修复有可能在其他子域名上出错的问题 ([b1655fb](https://github.com/LightAPIs/Gloria-X/commit/b1655fb78b4c73b7a5ca61580fb413491d2f797c))
* **notification:** 修复点击通知消息打开相应网址无效问题 ([baee9c2](https://github.com/LightAPIs/Gloria-X/commit/baee9c29a5fa075efa9f6a9526fd3c742a055f99))
* **notification:** 修复未手动关闭消息时，通知绑定事件未移除的问题；同时修复测试通知会影响未读消息数的问题 ([c6cfd38](https://github.com/LightAPIs/Gloria-X/commit/c6cfd38080eee29d69841b4971e17b82d37202ea))
* **notification:** 修复在清除通知记录时未读通知数和稍后查阅数未清零的问题 ([6b4f87f](https://github.com/LightAPIs/Gloria-X/commit/6b4f87ff9fc85e990a2e9d8bf17830540dba331e))
* **popup:** 补充在存储中记录未读通知数目以及在启动时读取稍后查阅数目 ([5aa375e](https://github.com/LightAPIs/Gloria-X/commit/5aa375e87c52a9421a1cf0c5b9c4ea6bab09150c))
* **reducer:** 修复常规任务在使用 Reducer 时稍后查阅无法记录的问题 ([b2c9f40](https://github.com/LightAPIs/Gloria-X/commit/b2c9f40d7d0ce0a91626e5bca70ccddac298035c))
* **sandbox:** 修复关于内存泄漏的严重问题 ([68fc7c8](https://github.com/LightAPIs/Gloria-X/commit/68fc7c8a26a4983a09cc6e166a87109f4a712812))
* **sound:** 支持为 Windows7 系统的通知发出声音 ([9656fa4](https://github.com/LightAPIs/Gloria-X/commit/9656fa4df2c44207e1451311d042098d2f622bdf))
* **task:** 修复由于之前的改动导致启动时任务不生效的问题 ([d1081ea](https://github.com/LightAPIs/Gloria-X/commit/d1081eafa2800c252de83207f8992a7a2e4baf08))