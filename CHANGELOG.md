# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.13.0](///compare/v2.12.0...v2.13.0) (2023-07-02)


### Features

* 支持打开独立的弹出窗口 7a00dbb, closes #8

## [2.12.0](https://github.com/LightAPIs/Gloria-X/compare/v2.11.2...v2.12.0) (2023-01-26)


### Features

* **settings:** 添加支持可选自定义弹出窗口缩放比例 ([b01f9a3](https://github.com/LightAPIs/Gloria-X/commit/b01f9a3b33cd276c36a1b5365277498634f3462c))
* **task:** 添加支持设置单个任务隐式推送 ([96d2089](https://github.com/LightAPIs/Gloria-X/commit/96d2089bbd470a2c9920bd92f3ed7aaebfa2eb7f)), closes [#6](https://github.com/LightAPIs/Gloria-X/issues/6)


### Bug Fixes

* **notifications:** 修复通知记录页面在某些情况下无法继续滚动加载的问题 ([039488b](https://github.com/LightAPIs/Gloria-X/commit/039488b432655cb3e116d25e6aca63f53399742c))
* **search:** 修正弹出窗口中任务筛选框的样式 ([163c181](https://github.com/LightAPIs/Gloria-X/commit/163c181b12251db5dba6282aa9dafbbf29a0c1a4))
* **settings:** 修正设置页面的图标样式 ([4d27b1d](https://github.com/LightAPIs/Gloria-X/commit/4d27b1d9d5b74928c5d41b3949e4e107f5a9c7f2))

### [2.11.2](https://github.com/LightAPIs/Gloria-X/compare/v2.11.1...v2.11.2) (2021-12-13)


### Bug Fixes

* **background:** 修复若任务执行成功但结果为空时不会记录执行时间的问题 ([ff92866](https://github.com/LightAPIs/Gloria-X/commit/ff92866b93de379432e5247cc2ecd9320801904f))

### [2.11.1](https://github.com/LightAPIs/Gloria-X/compare/v2.11.0...v2.11.1) (2021-11-30)


### Bug Fixes

* **config:** 修复在没有存储设置前弹出窗口不会应用自动缩放调整的问题 ([e081b8b](https://github.com/LightAPIs/Gloria-X/commit/e081b8b8ae69698627260f2f88f1e477b962ff8a))

## [2.11.0](https://github.com/LightAPIs/Gloria-X/compare/v2.10.0...v2.11.0) (2021-11-26)


### Features

* **config:** 添加支持调整弹出窗口缩放比例的设置项 ([4161431](https://github.com/LightAPIs/Gloria-X/commit/41614310950e6d5093b1a72c6828c239242fd655)), closes [#3](https://github.com/LightAPIs/Gloria-X/issues/3)

## [2.10.0](https://github.com/LightAPIs/Gloria-X/compare/v2.9.0...v2.10.0) (2021-11-21)


### Features

* **notifications:** 在通知记录中添加"访问过的"分类 ([fa64dbb](https://github.com/LightAPIs/Gloria-X/commit/fa64dbb47857be7252baae34f9e212aa0f5267c2))

## [2.9.0](https://github.com/LightAPIs/Gloria-X/compare/v2.8.1...v2.9.0) (2021-10-30)


### Features

* **generation:** 在自动生成任务代码时允许填写 imageUrl 属性 ([fe91dc9](https://github.com/LightAPIs/Gloria-X/commit/fe91dc938f98014801030c701503b5c608856bf9))
* **task:** 任务列表中的任务详情默认收起 ([6a1d397](https://github.com/LightAPIs/Gloria-X/commit/6a1d397707466846a5e3814b1181514571c0036e))


### Bug Fixes

* **popup:** 修复 Chromium 中全局网页缩放比例超过 100% 时弹出窗口内容溢出的问题 ([912d068](https://github.com/LightAPIs/Gloria-X/commit/912d0689ca8699240f0de1958eb595f069f45173))
* **text:** 修复文本内容可能显示不全的问题 ([0367c11](https://github.com/LightAPIs/Gloria-X/commit/0367c11fda0e8d7cb5c1878e9d1f83642f409b6b))

### [2.8.1](https://github.com/LightAPIs/Gloria-X/compare/v2.8.0...v2.8.1) (2021-09-08)


### Bug Fixes

* **link:** 修复通知记录中通知标题的样式问题 ([832b4ea](https://github.com/LightAPIs/Gloria-X/commit/832b4eaf8ddb2c57e1bdc990483a6ec69f91f446))
* **radio:** 修复单选按钮在黑暗模式下的显示问题 ([dbd711c](https://github.com/LightAPIs/Gloria-X/commit/dbd711c33712e932dd68fb1c3f0343bb8a3906a0))

## [2.8.0](https://github.com/LightAPIs/Gloria-X/compare/v2.7.0...v2.8.0) (2021-08-24)


### Features

* **notification:** 添加支持将出错通知保存至历史记录中 ([f1ff675](https://github.com/LightAPIs/Gloria-X/commit/f1ff6754ca3cf23c92d410118fd198fe00b50194))

## [2.7.0](https://github.com/LightAPIs/Gloria-X/compare/v2.6.0...v2.7.0) (2021-07-11)


### Features

* **later:** 支持设定批量打开网址的间隔时间 ([dc81922](https://github.com/LightAPIs/Gloria-X/commit/dc81922769f5a49777b92d81044988dec0b3fc62))


### Bug Fixes

* **execution-limit:** 修复后台任务执行上限设置为 0 时不会生效的问题 ([7357457](https://github.com/LightAPIs/Gloria-X/commit/73574570e05bb36d4c8bca155278315c32ad2ed9))
* **input:** 修复部分输入框在输入空白值时会出错的问题 ([e9f0d9d](https://github.com/LightAPIs/Gloria-X/commit/e9f0d9d725764664d41521f5e03ce65b04fa5598))

## [2.6.0](https://github.com/LightAPIs/Gloria-X/compare/v2.5.0...v2.6.0) (2021-06-27)


### Features

* **request-headers:** 添加支持手动指定请求头信息的功能 ([05e2bf5](https://github.com/LightAPIs/Gloria-X/commit/05e2bf5802fde59eba91bf903d76ce132c6e2660))


### Bug Fixes

* **background:** 修复从旧版本更新后可能会出现无法读取数据的错误 ([ea8ee7c](https://github.com/LightAPIs/Gloria-X/commit/ea8ee7c2f78ca8281c767129fa0a54be33cc9798))
* **test-result:** 修复在新版本 vue 下传递 undefined 导致出错的问题 ([1e5f0ad](https://github.com/LightAPIs/Gloria-X/commit/1e5f0ade206d871d291e572e4aca0a3bdad40c1f))

## [2.5.0](https://github.com/LightAPIs/Gloria-X/compare/v2.4.1...v2.5.0) (2021-06-20)


### Features

* **internal:** 添加支持内部设置的功能 ([b1b81fd](https://github.com/LightAPIs/Gloria-X/commit/b1b81fddca14df8bfd7d22b44f16e7ae80414e56))
* **task:** 支持在任务列表中通过右键菜单移除任务 Stage 缓存 ([38de4e2](https://github.com/LightAPIs/Gloria-X/commit/38de4e24c26dc682a7b3fe161133e01a93c55630))


### Bug Fixes

* **popup:** 移除弹出窗口中多余加载的图标字体文件 ([20b062c](https://github.com/LightAPIs/Gloria-X/commit/20b062cffd8f74c60a85f235f282be536abeaf6d))

### [2.4.1](https://github.com/LightAPIs/Gloria-X/compare/v2.4.0...v2.4.1) (2021-06-10)


### Bug Fixes

* **background:** 修复在 Chrome 启动时可能会出现重复执行同一任务的问题 ([9ce1720](https://github.com/LightAPIs/Gloria-X/commit/9ce172023f2ca9305323a0ae4b5e39870f1ccc9d))

## [2.4.0](https://github.com/LightAPIs/Gloria-X/compare/v2.3.0...v2.4.0) (2021-06-06)


### Features

* **notification:** 允许 Firefox 版本的推送通知支持声音提示 ([c367dc2](https://github.com/LightAPIs/Gloria-X/commit/c367dc2feaa71d6f330660e2fd27bdf2195c8e26))
* **task:** 添加支持每日任务的功能 ([2522bdb](https://github.com/LightAPIs/Gloria-X/commit/2522bdb5759facbece663ff6b2a2313f1117752c))


### Bug Fixes

* **daily:** 修复每日任务的执行时间会比预定的最早时间提前 1 分钟的问题 ([ee9c450](https://github.com/LightAPIs/Gloria-X/commit/ee9c45012eae47e91246cd43a43297f4d3c546e4))
* **export:** 修复加密导出任务的选择弹窗缺少标题的问题 ([46332f3](https://github.com/LightAPIs/Gloria-X/commit/46332f3eb8d4840f3c8510955121f2e46b28a04b))
* **file:** 修复导入/导出任务的弹窗在黑暗模式下样式出错的问题 ([556db5b](https://github.com/LightAPIs/Gloria-X/commit/556db5b82a575e48b8d59e4251e833625b059d7d))

## [2.3.0](https://github.com/LightAPIs/Gloria-X/compare/v2.2.0...v2.3.0) (2021-05-21)


### Features

* **file:** 添加支持在导入导出任务时可对任务进行选择的功能 ([ef7da06](https://github.com/LightAPIs/Gloria-X/commit/ef7da0643186879a28f948e3333b8f5f824c1bb1))


### Bug Fixes

* **contextmenu:** 修复在某些情况下右键菜单不会自动隐藏的问题 ([9e64f56](https://github.com/LightAPIs/Gloria-X/commit/9e64f56e8007ac140452b37e9bb4d04510dc43d5))
* **popconfirm:** 修复气泡弹出框的样式问题 ([05ac64b](https://github.com/LightAPIs/Gloria-X/commit/05ac64ba0441a127b00e0565208e434893af9107))

## [2.2.0](https://github.com/LightAPIs/Gloria-X/compare/v2.1.1...v2.2.0) (2021-05-01)


### Features

* **editor:** 添加支持在编辑器中按下 Ctrl+F 快捷键打开搜索框的功能 ([9c11f1c](https://github.com/LightAPIs/Gloria-X/commit/9c11f1c8d0a58ff9e0a8af2a75ea2e1bafded6cb))
* **filter-text:** 添加在搜索筛选任务或通知记录时高亮显示匹配的字符串 ([4221c27](https://github.com/LightAPIs/Gloria-X/commit/4221c279a6fafed04293a24b8d23f133815ccab8))


### Bug Fixes

* **notifications:** 补充在搜索通知记录时允许匹配来源的任务名称 ([7ad169f](https://github.com/LightAPIs/Gloria-X/commit/7ad169f10a54d0e029afe6ed926179f985895219))

### [2.1.1](https://github.com/LightAPIs/Gloria-X/compare/v2.1.0...v2.1.1) (2021-04-26)


### Bug Fixes

* **task-test:** 修复在任务列表中测试观察任务的结果为空时不会出现完成提示的问题 ([0d03c3f](https://github.com/LightAPIs/Gloria-X/commit/0d03c3fce7c5586bdadd12580c8bfaed9dd3e8e5))
* **test:** 补充在测试观察任务结果为空时显示 null ([a89b7e6](https://github.com/LightAPIs/Gloria-X/commit/a89b7e6b26f9dc7d405b097a15e69ccb4ef14296))

## [2.1.0](https://github.com/LightAPIs/Gloria-X/compare/v2.0.1...v2.1.0) (2021-04-22)


### Features

* **debug-code:** 添加支持在任务调试页面直接创建新任务的功能 ([a331ea2](https://github.com/LightAPIs/Gloria-X/commit/a331ea2d9a1b5a4e7f7422895269147ee0faed9d))


### Bug Fixes

* **generation:** 补充在自动生成代码并创建任务完成后的提示消息 ([85d8457](https://github.com/LightAPIs/Gloria-X/commit/85d84579faa0f569702ffe9dfe74a0ee7c36724d))
* **generation:** 修复自动生成页面在明亮模式下背景空白的问题 ([b66403f](https://github.com/LightAPIs/Gloria-X/commit/b66403ffe4fd81c49d07efee2d31ad8eefdd2432))
* **reducer:** 补充 reducer 是否可编辑的状态图标 ([1689983](https://github.com/LightAPIs/Gloria-X/commit/1689983278a824496530eaf2a174a3267d47e704))
* **state:** 移除内部状态页面中多余的开始观察按钮 ([f8c3db2](https://github.com/LightAPIs/Gloria-X/commit/f8c3db28a61ca140fae41d033c0a85241921a221))
* **unread:** 修复在点击通知打开网址时会使未读计数减 2 的问题 ([0eefa49](https://github.com/LightAPIs/Gloria-X/commit/0eefa49be3466feb497f0a25d7877a7da4e64c70))

### [2.0.1](https://github.com/LightAPIs/Gloria-X/compare/v2.0.0...v2.0.1) (2021-04-20)


### Bug Fixes

* **generation:** 修复在 Firefox 下自动生成任务页面中部分元素溢出的问题 ([437ec87](https://github.com/LightAPIs/Gloria-X/commit/437ec87b6ed18b882530283e551a395ddf66289c))
* **language:** 修复选项页面中在部分文本显示有误的问题 ([9d1ac71](https://github.com/LightAPIs/Gloria-X/commit/9d1ac71016661d21fb0ff94835e0ae267dcc9705))

## [2.0.0](https://github.com/LightAPIs/Gloria-X/compare/v1.6.0...v2.0.0) (2021-04-20)


### Features

* **appearance:** 添加支持夜间模式 ([0c9bc51](https://github.com/LightAPIs/Gloria-X/commit/0c9bc5153f209844c484371deb1a6bc680cc7acc))
* **contextmenus:** 在扩展程序图标上添加更多菜单项 ([e1caa86](https://github.com/LightAPIs/Gloria-X/commit/e1caa86698fc65cbf7ee57943b8efac5e00cc419))
* **editor:** 更换使用支持代码高亮的编辑器 ([d86ab13](https://github.com/LightAPIs/Gloria-X/commit/d86ab13a37d635bab08ff68da60083d3cbf9dc65))
* **generation:** 在选取元素生成任务的页面上添加步骤条 ([611738f](https://github.com/LightAPIs/Gloria-X/commit/611738ff1c814d03b595d49ae7c3d0c60e10571a))
* **notifications:** 将通知记录中稍后查阅的通知的时间节点更换为醒目的颜色 ([d1208b4](https://github.com/LightAPIs/Gloria-X/commit/d1208b4cef8751ce1824ee38edb0d73bb4d4b17b))
* **notifications:** 将通知历史记录修改为滚动加载 ([524c76f](https://github.com/LightAPIs/Gloria-X/commit/524c76f04e1554e28ca8cb4bc09cc65d482c4f49))
* **notifications:** 为通知记录中不同类型的通知使用不同颜色的时间节点 ([7749d2a](https://github.com/LightAPIs/Gloria-X/commit/7749d2ac695e8a1fa3e2928b18236007335a9748))
* **notifications:** 在通知记录的右键菜单中添加新建前台标签页打开链接的选项 ([2cc7263](https://github.com/LightAPIs/Gloria-X/commit/2cc7263912fa23866b73283baa4b154023a0993e))
* **scrollbar:** 更换新的滚动条 ([678c9d2](https://github.com/LightAPIs/Gloria-X/commit/678c9d23c081b4f91e81acade3ee318c1b35079c))
* **task:** 在任务的右键菜单中添加测试任务的选项 ([4fcc64f](https://github.com/LightAPIs/Gloria-X/commit/4fcc64fa7a6e343be178b7a9ba4d5b1c4ae50591))
* **task:** 在任务的右键菜单中添加检查任务更新的选项 ([4cd1f9a](https://github.com/LightAPIs/Gloria-X/commit/4cd1f9a29b90e2180e7068a2f2c6742093f485b9))


### Bug Fixes

* **background:** 修复在同时执行大量任务时可能会造成扩展程序崩溃的问题 ([aa15272](https://github.com/LightAPIs/Gloria-X/commit/aa152724818142fb686da33f332d95b6f7f90974))
* **notification-item:** 修复在新框架中点击打开通知链接时会出现重载弹出窗口的问题 ([3eb86f9](https://github.com/LightAPIs/Gloria-X/commit/3eb86f9232c0fc0924bf787f5aba882ce3df7063))
* **popup:** 修复 Firefox 在英文环境下部分文字溢出的问题 ([3bc0e7b](https://github.com/LightAPIs/Gloria-X/commit/3bc0e7b746f8e70ec6c5316630bdae4d52724e32))
* **popup:** 修复弹出窗口渲染有误的问题 ([96e0468](https://github.com/LightAPIs/Gloria-X/commit/96e0468f5bbc4b3364457d7fda010b024f76f534))
* **settings:** 修复当选项页视窗过小时选项开关被文字遮挡的问题 ([62208ef](https://github.com/LightAPIs/Gloria-X/commit/62208ef0ad241a1b46bc5184845c2959afd764b9))
* **tasks:** 修复在 Firefox 中任务的类别筛选里能看到"手动关闭"选项的问题 ([3cc1db5](https://github.com/LightAPIs/Gloria-X/commit/3cc1db52e94379ab980ea57c6292011781518449))
* **vuex:** 修复在新框架下 Firefox 中各页面数据存取出错的问题 ([06880ed](https://github.com/LightAPIs/Gloria-X/commit/06880ed11f9a1630a89ae14984a98d8252e2e92a))

## [1.6.0](https://github.com/LightAPIs/Gloria-X/compare/v1.5.1...v1.6.0) (2021-04-02)


### Features

* **task:** 添加允许立即执行任务的功能 ([319c467](https://github.com/LightAPIs/Gloria-X/commit/319c4670cebc011c579e015625a2ff4835be7115))
* **tasks:** 支持按分类对任务进行筛选的功能 ([25ff7c1](https://github.com/LightAPIs/Gloria-X/commit/25ff7c1a09ae407da84b57f0b1eb087f930695f3))

### [1.5.1](https://github.com/LightAPIs/Gloria-X/compare/v1.5.0...v1.5.1) (2021-03-31)


### Bug Fixes

* **clear:** 补充在清理操作完成后弹出提示消息 ([d483c18](https://github.com/LightAPIs/Gloria-X/commit/d483c186512c2b0b91d1d50c49719b0f3d7efa6d))
* **test:** 修复在测试观察任务中返回 null/undefined 时会认为任务出错的问题 ([9d4e670](https://github.com/LightAPIs/Gloria-X/commit/9d4e6701f80f19ddd84d6af41c3f6b81ae1923da))

## [1.5.0](https://github.com/LightAPIs/Gloria-X/compare/v1.4.4...v1.5.0) (2021-03-28)


### Features

* **task:** 支持标识任务连续执行出错的次数 ([bd3eb68](https://github.com/LightAPIs/Gloria-X/commit/bd3eb687ce5853dc6caf839f375960f7d5d8d5a0))

### [1.4.4](https://github.com/LightAPIs/Gloria-X/compare/v1.4.3...v1.4.4) (2021-03-25)


### Bug Fixes

* **webrequest:** 修复当任务中请求的网址存在重定向时导致扩展程序出错并使浏览器无法联网的问题 ([5dbaccc](https://github.com/LightAPIs/Gloria-X/commit/5dbaccc021d7c19bf7922ee2a5d48b158ed79ff8))

### [1.4.3](https://github.com/LightAPIs/Gloria-X/compare/v1.4.2...v1.4.3) (2021-03-23)


### Bug Fixes

* **help:** 修正部分文本内容 ([25385e3](https://github.com/LightAPIs/Gloria-X/commit/25385e33f46fde0a544c8a92abb7b10deb9888c7))
* **messages:** 修正 Firefox 上部分选项的文本内容 ([2c7ee82](https://github.com/LightAPIs/Gloria-X/commit/2c7ee82787dc8387517134f5ef42e693a1aae918))

### [1.4.2](https://github.com/LightAPIs/Gloria-X/compare/v1.4.1...v1.4.2) (2021-03-23)


### Bug Fixes

* **manifest:** 修复 Firefox 更新清单地址有误的问题 ([556925f](https://github.com/LightAPIs/Gloria-X/commit/556925f1895c7da0aa99d6763e2fe4651cf13c91))

### [1.4.1](https://github.com/LightAPIs/Gloria-X/compare/v1.4.0...v1.4.1) (2021-03-23)


### Bug Fixes

* **notification:** 修复在 Firefox 上通知自动关闭时未读通知数会减少的问题 ([0de47d0](https://github.com/LightAPIs/Gloria-X/commit/0de47d05e13f545eee2410fa96c59c5b6d25845b))
* **storage:** 修复 Firefox 下部分数据存储出现错误的问题 ([a280c36](https://github.com/LightAPIs/Gloria-X/commit/a280c3601707ac2959ee4c4d8d219e27c12cd229))
* **storage:** 修复在 Firefox 下部分类型的数据无法储存的问题 ([6e58c9a](https://github.com/LightAPIs/Gloria-X/commit/6e58c9ad803d53463c2cff931959ab91f79c541d))

## [1.4.0](https://github.com/LightAPIs/Gloria-X/compare/v1.3.1...v1.4.0) (2021-03-23)


### Features

* **build:** 打包 Firefox 版本 ([cd2a80e](https://github.com/LightAPIs/Gloria-X/commit/cd2a80eb4448ae15549041d4a414c6c96b58e430))
* **triggerinterval:** 时间间隔更换使用新的输入方式 ([6d80c4c](https://github.com/LightAPIs/Gloria-X/commit/6d80c4c2d4a4e4b83acf2badbfd391bb98b7e2ef))


### Bug Fixes

* **clear:** 修复清理 Caches 功能无效的问题 ([de15449](https://github.com/LightAPIs/Gloria-X/commit/de154493ac873b7f1fc4b1a8867e1b25a97cdc1d))
* **menus:** 为 firefox 版本插件图标右键菜单补充进入选项页面的菜单项 ([d0dec50](https://github.com/LightAPIs/Gloria-X/commit/d0dec508b7e629ee09cf5f65a0cef52bed83fde1))
* **webrequest:** 修复可能由于扩展程序出错导致浏览器无法联网的问题 ([91f3bfb](https://github.com/LightAPIs/Gloria-X/commit/91f3bfb6657b1366b3e9477b9418b4aba50f1b7f))

### [1.3.1](https://github.com/LightAPIs/Gloria-X/compare/v1.3.0...v1.3.1) (2021-03-20)


### Bug Fixes

* **webrequest:** 修复由于网络请求处理错误可能导致浏览器联网阻塞的问题 ([023f726](https://github.com/LightAPIs/Gloria-X/commit/023f726a9d14fde9eb5ba09aae9e04188ed8d5f9))

## [1.3.0](https://github.com/LightAPIs/Gloria-X/compare/v1.2.4...v1.3.0) (2021-03-15)


### Features

* **task:** 在任务上标识上一次任务执行出错的状态 ([622d8b1](https://github.com/LightAPIs/Gloria-X/commit/622d8b177e682c3e17bf4391e4df9400db304ce9))


### Bug Fixes

* **copy:** 菜单项中补充复制 ID 的功能 ([8844f61](https://github.com/LightAPIs/Gloria-X/commit/8844f61d0199ed5f4ff8a6656e1f1be4f9fbc805))

### [1.2.4](https://github.com/LightAPIs/Gloria-X/compare/v1.2.3...v1.2.4) (2021-03-10)


### Bug Fixes

* **web-request:** 修复在处理网络请求时的潜在错误 ([a9f9e3a](https://github.com/LightAPIs/Gloria-X/commit/a9f9e3a6c044446c96b68b13727e94970f0c53ec))

### [1.2.3](https://github.com/LightAPIs/Gloria-X/compare/v1.2.2...v1.2.3) (2021-03-01)


### Bug Fixes

* **test:** 补充在测试时允许不弹出通知消息的按钮 ([c38bb8b](https://github.com/LightAPIs/Gloria-X/commit/c38bb8b0410de7c6711146141d8e929f0c53efed))

### [1.2.2](https://github.com/LightAPIs/Gloria-X/compare/v1.2.1...v1.2.2) (2021-02-05)


### Bug Fixes

* **popup:** 修复当通知记录过多时造成窗口弹出卡顿的问题 ([2c04737](https://github.com/LightAPIs/Gloria-X/commit/2c0473743ee59e300bf1ea9e3345826327fbb234))
* **web-request:** 修复一处关于网络请求的潜在错误 ([373d1ab](https://github.com/LightAPIs/Gloria-X/commit/373d1abd986f0485e8dece7de57aad8ff6049654))

### [1.2.1](https://github.com/LightAPIs/Gloria-X/compare/v1.2.0...v1.2.1) (2021-02-02)


### Bug Fixes

* **generation:** 修复在选取网页元素后自动生成任务代码时所捕获文本内容可能有误的问题 ([05b401e](https://github.com/LightAPIs/Gloria-X/commit/05b401e96f3265b939f520070187321bc56d0428))

## [1.2.0](https://github.com/LightAPIs/Gloria-X/compare/v1.1.0...v1.2.0) (2021-01-31)


### Features

* **selection:** 实现选取网页元素进行监视的功能 ([ad436e6](https://github.com/LightAPIs/Gloria-X/commit/ad436e6eb2710ed1b4481f6d95a63caac0376296))


### Bug Fixes

* **commit:** 修复在创建常规任务的数组中包含 null 或 undefined 时会报错的问题 ([dd13088](https://github.com/LightAPIs/Gloria-X/commit/dd1308800e79a5ea5fe662f37717216e64aecc3e))

## [1.1.0](https://github.com/LightAPIs/Gloria-X/compare/v1.0.0...v1.1.0) (2021-01-27)


### Features

* **popup:** 允许在 popup 页面中通过鼠标右键菜单操作任务和通知记录；新增允许显示通知记录分类数量的设置项 ([ea37403](https://github.com/LightAPIs/Gloria-X/commit/ea374033a9c757817c54745b8a2a89a5a71ef565))
* **storage:** 不再储存 laterCount 值 ([fcbe9cb](https://github.com/LightAPIs/Gloria-X/commit/fcbe9cb29e3e3d9e0e610b86d3824599ed5c1109))


### Bug Fixes

* **actions:** 修复一个关于缓存 STAGES 数据的问题 ([f0b07b7](https://github.com/LightAPIs/Gloria-X/commit/f0b07b7348822d341fc8018b929332d91750053e))
* **reducer:** 修复一个关于 Reducer 可能潜在的错误 ([91b7a65](https://github.com/LightAPIs/Gloria-X/commit/91b7a6540e3275a65339783a1ced5f29f718b8f7))

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
