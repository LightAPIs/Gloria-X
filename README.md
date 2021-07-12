<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/LightAPIs/PicGoImg@master/img/20210414171507.png" />
</p>

<h1 align="center">Gloria-X</h1>

<p align="center">
  <a href="https://github.com/LightAPIs/Gloria-X/releases/latest">
    <img src="https://img.shields.io/github/v/release/LightAPIs/Gloria-X.svg?color=orange" alt="Release" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/npdafhgodaenfglcfkkbnmdbfkgfadbh">
    <img src="https://img.shields.io/chrome-web-store/v/npdafhgodaenfglcfkkbnmdbfkgfadbh?maxAge=86400" alt="Chrome Web Store" />
  </a>
  <a href="https://github.com/LightAPIs/Gloria-X/releases/latest">
    <img src="https://img.shields.io/badge/-mozilla_addons-lightgrey.svg" alt="Mozilla Addons" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License" />
  </a>
</p>

- [English](/README_EN.md)
- 中文版

> 可编程网站通知聚合器
>
> **原项目：**[BlackGlory](https://github.com/BlackGlory)/[Gloria](https://github.com/BlackGlory/Gloria) [![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://raw.githubusercontent.com/BlackGlory/Gloria/master/LICENSE)

通过定时执行自定义的 JavaScript 代码任务，实现网页监视或者论坛签到等自动化工作，并弹出通知提醒。

_本项目是由我个人采用 TypeScript 进行编写和维护的 Gloria 衍生版本，用于修改及扩充 Gloria 中的部分功能，并添加我个人所需要的一些特性，所以 Gloria-X 可以理解为是一个以 Gloria 为核心，并提供功能增强的版本。_

## 目录

- [安装方法](#安装方法)
  - [Chrome](#Chrome)
  - [Firefox](#Firefox)
- [使用方法](#使用方法)
  - [Gloria Notification 对象结构](#Gloria-Notification-对象结构)
    - [对象属性介绍](#对象属性介绍)
  - [commit 函数](#commit-函数)
    - [任务分类](#任务分类)
      - [观察任务](#观察任务)
      - [常规任务](#常规任务)
    - [两种任务的区别](#两种任务的区别)
  - [访问 URL](#访问-URL)
    - [访问 URL 示例](#访问-URL-示例)
  - [异步载入外部脚本](#异步载入外部脚本)
- [额外功能](#额外功能)
  - [选取网页元素进行监视](#选取网页元素进行监视)
- [高级选项](#高级选项)
  - [调试任务代码](#调试任务代码)
  - [观察内部状态](#观察内部状态)
  - [自定义请求头信息](#自定义请求头信息)
  - [通知 Reducer](#通知-Reducer)
    - [Reducer 介绍](#Reducer-介绍)
    - [工作方式](#工作方式)
    - [作用](#作用)
    - [具体用法](#具体用法)
    - [示例](#示例)
      - [过滤通知](#过滤通知)
      - [修改通知](#修改通知)
      - [发送给 Pushbullet](#发送给-Pushbullet)
    - [测试 Rudecer](#测试-Rudecer)
- [其他事项](#其他事项)
  - [准时模式](#准时模式)
  - [其他特性](#其他特性)
- [相关文档](#相关文档)
- [Firefox 版本的限制](#Firefox-版本的限制)
- [开发编译](#开发编译)
  - [环境需求](#环境需求)
  - [初始化指令](#初始化指令)
  - [构建指令](#构建指令)
  - [相关目录及文件](#相关目录及文件)
- [相关项目](#相关项目)
- [许可证](#许可证)

## 安装方法

### Chrome

1. 前往 [Chrome 网上应用店](https://chrome.google.com/webstore/detail/npdafhgodaenfglcfkkbnmdbfkgfadbh) 进行下载安装。
2. 启动浏览器在地址栏内输入 `chrome://extensions/` 进入扩展程序管理页面，点击网页右上角的开关以开启"开发者模式"：

- a. 前往 [Releases](https://github.com/LightAPIs/Gloria-X/releases/latest) 下载扩展程序 `crx` 文件，拖动至扩展程序管理页面进行安装。
- b. 前往 [Releases](https://github.com/LightAPIs/Gloria-X/releases/latest) 下载扩展程序压缩包 `zip` 文件并进行解压，然后点击"加载已解压的扩展程序"按钮，选择加载先前解压文件的根目录即可完成扩展程序的安装。

### Firefox

- 前往 [Releases](https://github.com/LightAPIs/Gloria-X/releases/latest) 下载附加组件 `xpi` 文件进行安装 _(由于声明了 `unsafe-eval` 权限，所以无法上架至 Mozilla Add-ons，仅可自行托管。)_

## 使用方法

由于是承袭自 Gloria，所以 Gloria-X 基本上实现了 Gloria 上所有的功能，使用方法和任务开发与其相同。正常情况下，为 Gloria 所编写的任务代码是同样可以在 Gloria-X 上工作的，反之亦可行。以下是一些简要的使用方法介绍：

JavaScript 同样是 Gloria-X 任务代码唯一支持的编程语言。任务创建通知的编写方法与 Gloria 相同，只需要将一个 `Gloria Notification` 对象或一个由该对象所组成的数组传递给特定的回调函数 `commit`。Gloria-X 会在内部处理 `commit` 函数的参数，并根据该参数决定推送通知的内容。

比如，下面这段简单的任务代码就是真实可运行的，它会在每次设定的时间间隔到达后执行并弹出一个关于时间戳的通知消息：

```javascript
commit({
  message: Date.now().toString(),
});
```

_当然这段任务代码本身是没有实际意义的，只是一个简单的使用示例。_

### Gloria Notification 对象结构

通知消息的显示内容取决于所传递的 `Gloria Notification` 对象属性值，所以首先你需要了解该对象的结构。

`Gloria Notification` 对象结构如下：

```javascript
{
  title: String,    // 默认为 ""，推送通知的标题
  message: String,  // 默认为 ""，推送通知的内容
  iconUrl: String,  // 默认为 undefined，推送通知的图标
  imageUrl: String, // 默认为 undefined，在推送通知上额外显示的图片 (Firefox 通知忽略该属性)
  url: String,      // 默认为 undefined，点击推送通知时打开的网址
  id: String,       // 默认为 undefined，用于额外判定通知是否相同。如非特定需求，一般不需要手动指定
}
```

_为了安全性和避免可能发生某些未知的错误，扩展程序在内部处理时会忽略掉 `Gloria Notification` 对象上的其他属性。_

#### 对象属性介绍

> 提示：设定上所有的对象属性类型均为**可选的** `String` 字符串。在编写任务代码时不要直接传递其他可能可以隐式转换为 `String` 的类型 (如：`Number`，`Boolean` 等)，如果这样做，扩展程序会认为传递的属性类型出错，所以请务必自行手动将值转换为 `String` 类型。

- `title`
  - 类型: `String`
  - 默认值: `""`
  - 含义: 推送通知的标题。
  - 该属性值会用于与 STAGES 缓存中的旧通知进行判定。
  - 如：在一个[观察任务](#观察任务)中，如果新对象中的 `title` 值与 STAGES 缓存里旧对象中的 `title` 值不相同时，则该新对象就会被判定为是一则新通知并需要进行推送。
- `message`
  - 类型: `String`
  - 默认值: `""`
  - 含义: 推送通知的主体内容或描述。
  - 该属性值会用于与 STAGES 缓存中的旧通知进行判定。
  - 小提示：如果不是用于测试之类的用途，建议不要直接在 `title` 或 `message` 属性中包含与通知内容本身无关的第三方可变量 (比如在标题上附加了一个时间戳 `Date.now().toString()`)。因为这可能会导致每一次任务执行完毕后所得到的对象都不同，从而会被判定成新通知而进行推送。如果出于某种需求需要将两个 `title` 和 `message` 属性值相同的对象当作两个不同的通知处理，可以为对象指定两个不相同的 `id` 属性值 (在 Gloria 中同样可以采用这种方式)，这样这两个对象在扩展程序内部就会被视作两个不相同的对象了。
- `iconUrl`
  - 类型: `String`
  - 默认值: `undefined`
  - 含义: 推送通知显示的图标信息。
  - 这是 Chrome 创建通知消息时必须提供的参数，所以若在对象中不指定 `iconUrl` 属性时，扩展程序会先查找 `url` 网站的网站图标 (_如果指定了 `url` 并在设置中启用自动检测网站图标功能_)，其次会提供一个默认图标值 `"icons/app/icon-128.png"` (即 Gloria-X 的图标)。
- `imageUrl`
  - 类型: `String`
  - 默认值: `undefined`
  - 含义: 推送通知上额外显示的一张图片。若指定 `imageUrl` 属性，通知会变为一个带图片的通知。
  - **Firefox 通知会忽略该属性，即在通知中不会显示额外的图片，但是会在通知记录中显示。**
- `url`
  - 类型: `String`
  - 默认值: `undefined`
  - 含义: 点击推送通知时打开的网站。
- `id`
  - 类型: `String`
  - 默认值: `undefined`
  - 含义: 对象的标识符，可以用于额外判定通知是否相同。
  - 该属性值会用于与 STAGES 缓存中的旧通知进行判定。

### commit 函数

`commit` 函数是由 Gloria-X 提供给任务代码的一个特殊函数。通过在任务代码中将需要观测的数据结果，即 `Gloria Notification` 对象或由该对象所组成的数组，以参数的形式传递给 `commit`，便完成了任务代码的编写。

而根据传递给 `commit` 参数的区别，任务分为"**观察任务**"和"**常规任务**"。

#### 任务分类

##### 观察任务

当传递一个单一的 `Gloria Notification` 对象给 `commit` 函数时，该任务会被识别为"观察任务"，会将每次得到的 `Gloria Notification` 对象与上一次所记录的 `Gloria Notification` 对象进行对比，不相同时则会推送新通知。

_注意：若在观察任务中返回 `null` 或 `undefined`，则此次执行结果会被直接忽略，不会被缓存和用于比较。_

##### 常规任务

当传递一个由 `Gloria Notification` 对象所组成的数组给 `commit` 函数时，该任务会被识别为"常规任务"，每次所收集到的内容都会被缓存于内部的 `Stages` 组件中，这样只有新对象时才会推送相应的通知。当然，每一个"常规任务"的 `Stages` 组件缓存数量是存在上限值的，但理论上你不会需要去关心其大小，只需要保证每个"常规任务"不会一次传入数量过多的 `Gloria Notification` 对象即可。

#### 两种任务的区别

观察任务会响应每次结果的变化，依据的是上一次是执行结果；而常规任务只会响应新出现的结果，不会处理过往出现过的重复执行结果。

以下通过两份可以实际运行的任务代码来具体解释一下两种任务的区别。

假设存在下面两个任务，一个为观察任务，另一个为常规任务。

```javascript
//* 观察任务，传入的是单个对象
(async () => {
  const { lodash: _ } = await importScripts('gloria-utils');
  return {
    title: _.random(1).toString(),
  };
})().then(commit);
```

```javascript
//* 常规任务，传入的是一个数组
(async () => {
  const { lodash: _ } = await importScripts('gloria-utils');
  return [
    {
      title: _.random(1).toString(),
    },
  ];
})().then(commit);
```

_当然这两个任务并没有任何实际意义，仅供用来测试参考两种任务间的区别。_

我们使用了 `lodash` 库中的 `random` 方法进行测试。先不要管 `importScripts ('gloria-utils')` 是什么东西，后面的内容中会提到，我们现在只需要关注两个任务传递给 `commit` 函数的结果。在两个任务中对象的 `title` 属性都采用 `_.random(1).toString()` 赋值，这个方法的结果值只有两种可能性，`"0"` 或者 `"1"` 。

当实际运行这两个任务时你就会发现：

观察任务在每一次任务执行时都会有可能推送新的通知，只要这一次的对象的 `title` 值与上一次对象的 `title` 值不相同即可。

而常规任务的行为则完全不相同，当执行次数足够多时，你会发现常规任务至多也只会推送一次新的通知。

这是因为在任务创建时，任务会首先执行一次，并将第一次执行的结果缓存进 STAGES 组件中。当后续执行中出现一个不相同的结果时，则会推送新的通知，并将新的结果缓存进 STAGES 组件中。值得注意的是，常规任务不同于观察任务，它并不会被移除旧的结果，而是与新结果一同缓存在 STAGES 组件当中。又因为这个示例任务的特殊性，即只存在两种可能性结果，所以此时无论后续执行会得出什么结果，它都会与 STAGES 组件中缓存的两个结果之一相同，那也就不可能再出现推送新通知的情况出现了。

以上就是两种任务间区别的示例，具体行为可以通过选项页面中内部状态观察面板观测。

### 访问 URL

在了解了如何在任务代码中创建通知后，接下来需要的就是访问 url 了。

在任务代码中访问 url 有两种方法：

1. 通过 `fetch` 函数

你可以在 [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) 里查看 `fetch` 的使用方法。需要注意的是在 Gloria-X 环境下的 `fetch` 在创建请求时会自动附加目标 url 的 Cookie，以便可以利用到在目标网站上的登录状态。当然这样推送的通知显示内容里也许会包含你的私人信息，具体显示内容取决于 `Gloria Notification` 对象是如何编写的。

2. 通过 `XMLHttpRequest(XHR)` 对象

你可以在 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 里查看 `XHR` 的使用方法。与 `fetch` 不同的时，Gloria-X 环境下的 `XHR` 不会自动附加目标 url 的 Cookie，也就无法获取到目标网站上的登录状态了。

若你打算使用 `XHR`，你可能需要在任务代码中使用一个相类似的 `Promise` 封装方法：

```javascript
// Encapsulation method
function ajax(url, method = 'GET', headers = []) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    headers.forEach(head => {
      xhr.setRequestHeader(head.name, head.value);
    });
    xhr.responseType = 'json';
    xhr.onload = res => {
      resolve(res.target.response);
    };
    xhr.onerror = res => {
      reject(res.target.response);
    };
    xhr.send();
  });
}

// Use ajax
ajax('...').then( ... ).catch( ... )
```

#### 访问 URL 示例

比如创建一个检测本项目的最新版本的简单观察任务：

```javascript
fetch('https://api.github.com/repos/LightAPIs/Gloria-X/releases/latest')
  .then(res => res.json())
  .then(json => {
    const message = json.tag_name;
    const url = json.html_url;
    commit({
      title: 'Gloria-X',
      message,
      url,
    });
  });
```

我还在 Gloria 的[任务代码分享网站](https://gloria.pub/)里找了一个可实际运行的任务。

[方块游戏 新闻资讯](https://gloria.pub/task/5f4e832dab474400108be608)：

```javascript
fetch('https://infodev.cubejoy.com/Store/GetNews?area=2&pageindex=1&pagesize=15')
  .then(res => res.text())
  .then(res => JSON.parse(res.substring(1, res.length - 1)))
  .then(json => {
    let notifications = json.result.list.map(feed => {
      return {
        message: feed.Title,
        url: 'https://news.cubejoy.com/html/en/news/newsdetail/detail' + feed.Id + '.html',
        iconUrl: feed.ImgUrlM,
      };
    });
    commit(notifications);
  });
```

如果你了解 `fetch` 或 `XHR` 的话，通过这些任务应该也就能明白具体如何在任务代码中访问 URL 了。

### 异步载入外部脚本

虽然已经可以在任务代码中访问 URL，但是并不是所有网站都存在类似上面示例中的返回 JSON 格式数据的 API 接口。这时候就需要直接访问 URL 并读取 HTML 内容，再通过 `cheerio` 等模块处理 HTML。

在 Gloria-X 环境下可以像 Web Worker 通过 `importScripts` 方法载入外部脚本。

需要注意的一点，不同于 Web Worker 运行环境，Gloria-X 的环境下会制造一个虚拟的 `window` 对象，用于让一些外部脚本能正常工作，并且 `importScripts` 方法被改造成了异步方法，仅支持单个参数。你可以像下面这样调用它:

```javascript
importScripts('script.js')
  .then(script => {
    ...
  })
```

当调用这个异步的 `importScripts` 方法载入外部脚本时会返回一个 `Promise` 对象。`Promise.then` 的回调函数所接收到的第一个参数就是载入的外部脚本的返回值。

Gloria-X 和 Gloria 同样内置了一些常用的模块，并可以通过 `importScripts('gloria-utils')` 加载这些模块，所能使用的模块如下表所示：

|                                               集成模块                                               |  版本   |
| :--------------------------------------------------------------------------------------------------: | :-----: |
|               export `cheerio` from '[cheerio](https://github.com/cheeriojs/cheerio)'                | 0.22.0  |
|                          export `co` from '[co](https://github.com/tj/co)'                           |  4.6.0  |
|                  export `cookie` from '[cookie](https://github.com/jshttp/cookie)'                   |  0.3.1  |
|         export `immutable` from '[immutable](https://github.com/immutable-js/immutable-js)'          |  3.8.1  |
|                  export `is` from '[is_js](https://github.com/arasatasaygin/is.js)'                  |  0.9.0  |
|                  export `lodash` from '[lodash](https://github.com/lodash/lodash)'                   | 4.16.4  |
|                  export `moment` from '[moment](https://github.com/moment/moment)'                   | 2.18.1  |
|                        export `qs` from '[qs](https://github.com/ljharb/qs)'                         |  6.3.0  |
|                    export `ramda` from '[ramda](https://github.com/ramda/ramda)'                     | 0.24.1  |
|                 export `rx` from '[rx](https://github.com/Reactive-Extensions/RxJS)'                 |  4.1.0  |
|     export `sanitizeHtml` from '[sanitize-html](https://github.com/apostrophecms/sanitize-html)'     | 1.13.0  |
|              export `SystemJS` from '[systemjs](https://github.com/systemjs/systemjs)'               | 0.20.14 |
| export `underscoreString` from '[underscore.string](https://github.com/esamattis/underscore.string)' |  3.3.4  |
|          export `validator` from '[validator](https://github.com/validatorjs/validator.js)'          |  7.1.0  |
|          export `xml2js` from '[xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)'           | 0.4.17  |
|               export `XRegExp` from '[xregexp](https://github.com/slevithan/xregexp)'                |  3.2.0  |

例如，你可以使用 `cheerio` 来解析一个页面：

```javascript
(async () => {
  const { cheerio } = await importScripts('gloria-utils');
  const html = await fetch('https://github.com/LightAPIs/Gloria-X/releases').then(res => res.text());
  const $ = cheerio.load(html);
  return $('.release-main-section.commit')
    .map((_i, ele) => {
      const link = $(ele).find('.release-header .f1 a');
      const title = link.text().trim();
      const url = 'https://github.com/' + link.attr('href');
      return {
        title,
        url,
      };
    })
    .get();
})().then(commit);
```

## 额外功能

### 选取网页元素进行监视

> _v1.2.0 +_

可以在网页的右键菜单或者扩展程序图标的右键菜单里找到该功能。

触发该功能后，会进入选取网页元素模式，可以通过鼠标左键单击点选网页内元素，按住 Ctrl 键的同时可以进行多选。完成元素选取之后，再点击"生成任务代码"按钮即可生成相应的任务代码。接下来需要测试一遍生成的任务代码，只有测试任务代码执行成功才能进行下一步并创建任务。

需要注意的是，这个功能本质只是一个[观察任务](#观察任务)的快捷生成器。从原理上来说它是无法生成[常规任务](#常规任务)的，并且也不一定能监视所有类型的网页，比如基于 Ajax 技术动态加载的网页等。

## 高级选项

### 调试任务代码

可以在扩展程序选项页面的"任务调试"分页中找到调试任务的面板。

在代码输入框中输入需要调试的任务代码后，点击页面上方的"测试"按钮，即可查看测试输出结果 (当然，异步执行的任务代码可能需要等上一会儿)，并且所得到的测试结果既不会经过内部的 STAGES 组件 (一个用于缓存通知的组件)，也不会经过 Reducer 函数 (见后面介绍)，而是直接生成相应的通知。

若任务代码中存在语法等错误，也会显示在面板中 (_注：仅支持捕获同步执行代码的错误，采用异步执行的代码的错误或者是在代码中使用 `console` 语句的输出需要打开扩展程序的背景页<"background.html">进行查看_)。

### 观察内部状态

可以在扩展程序选项页面的"内部状态"分页中找到观察内部状态的面板。

在这里，你可以观察到"通知记录"、"Gloria-X 任务" 和 "STAGES" 组件在内部储存的实时状态。

同时在页面底部还提供了一些清理功能的按钮。

### 自定义请求头信息

> _v2.6.0+_

可以在扩展程序选项页面的"请求头信息"分页中找到自定义请求头信息的面板。

在这里，你可以手动为一些被[禁止修改的消息首部](https://developer.mozilla.org/zh-CN/docs/Glossary/Forbidden_header_name)提供值。

_注：此处的设定会覆盖扩展程序内部自动附加的一些同名值，如 `Cookie` 等。_

### 通知 Reducer

可以在扩展程序选项页面的"通知 Reducer"分页中找到 Reducer 设置面板。

**在介绍和使用 Reducer 函数之前，希望你能清楚该函数本身是一把"双刃剑"，在带来便利的同时有可能会因为使用不当而造成一些不必要的麻烦。**

#### Reducer 介绍

如果你需要对任务执行后所得到的新通知在被正式推送之前进行一些二次操作的话，那么你就需要使用到 Reducer 函数。Reducer 函数是 Gloria-X 提供的一个特殊函数 (当然，你同样可以在 Gloria 里找到它)。与之前任务代码中的 `commit` 函数不同，它不会出现在任务代码当中，而是单独地在选项页面里进行设置。如果你提供了 Reducer 函数，那么所有的任务都会使用同一个 Reducer 函数。

#### 工作方式

Reducer 是一个同步执行的函数，当一个任务执行完成后若存在需要进行推送的新 `Gloria Notification` 对象时，该对象会作为参数被传递进 Reducer 函数中执行一次操作。

注意：在 Reducer 函数执行之前，通知的对比和缓存都已经完成，Reducer 函数的操作只会影响到后面通知的显示和记录中的内容。

它的执行时机大概是像下面这样的：

```
Task(Execute) => commit => Gloria Notification(s) => STAGES(Compare and cache) => Reducer => Popup Notifications
```

#### 作用

在 Reducer 函数中，你可以完成修改、过滤以及通过 HTTP 请求发送给第三方服务(比如：[Pushbullet](https://www.pushbullet.com/)、[Pushover](https://pushover.net/)、[Alertover](https://www.alertover.com/)、[Server 酱](https://sc.ftqq.com/3.version))将通知同步至其他设备当中的操作。

#### 具体用法

Reducer 接收一个 `Gloria Notification` 对象作为参数，并可选的返回一个新的 `Gloria Notification` 对象，该返回值将被用于弹出新通知。若函数没有提供返回值或者返回的是一个 `null` 时，则被视为被抛弃，不会弹出新通知，更不会在通知记录中看到它。

#### 示例

##### 过滤通知

过滤掉 `message` 中包含 "sad" 字符串的通知：

```javascript
function reducer(notification) {
  if (notification.message.includes('sad')) {
    return null;
  }
  return notification;
}
```

> _注：由于 Reducer 函数工作于将通知消息缓存进 STAGES 组件的操作之后，所以即使通知被丢弃，STAGES 组件中仍然会保存关于该通知消息的缓存，但是不会出现在通知记录当中。_
>
> _（当然，你其实并不需要十分关心这些内容，因为它不会影响到任务代码的编写，我之所以要告诉你这些，只是希望你能更清楚 Reducer 函数是在何时工作的，产生了什么影响，多了解一些没什么坏处。）_
>
> _即假设当你通过 Reducer 丢弃一则通知消息，然后删除了 Reducer 函数，那么理论上在下一次任务执行后，这一则通知也不会被当作新消息弹出，因为它之前已经被缓存进 STAGES 组件中了。_

##### 修改通知

将 `message` 中的 "sad" 修改为 "happy"：

```javascript
function reducer(notification) {
  notification.message = notification.message.replace('sad', 'happy');
  return notification;
}
```

> _注：由于 Reducer 函数工作于将通知消息缓存进 STAGES 组件的操作之后，所以 STAGES 组件中仍然保存的是关于修改之前的通知消息的缓存，但是通知记录中会显示修改之后的通知内容。_
>
> _即假设当你通过 Reducer 修改了一则通知消息，然后删除了 Reducer 函数，那么理论上在下一次任务执行后，这一则通知也不会被当作新消息弹出，因为它其实和 STAGES 组件中缓存的消息相同。_

小提示：通常来说在 Reducer 函数中去修改 `notification.id` 属性是没有意义的，因为这个属性值并不会真实地反馈到通知消息当中去，它仅仅是用于在 STAGES 组件中进行判定(见：[对象属性介绍](#对象属性介绍))。

当然，也许你会通过在观察内部状态面板中发现每一条通知记录都拥用一个独立了 `id` 属性，但其实它与你在 `Gloria Notification` 对象中填写的 `id` 属性没有任何的关联。通知记录当中通知的 ID 值和任务的 ID 值作用是相同的，都是由扩展程序内部自动随机生成并且是唯一的。

##### 发送给 Pushbullet

你可以通过 Pushbullet 将通知消息同步到其它设备上。更多关于 Pushbullet 的使用方法，请参考[官方文档](https://docs.pushbullet.com/)。

```javascript
function reducer(notification) {
  const { title, message, url } = notification;
  const data = {
    type: 'note',
    title,
    body: message,
    device_iden: '...', //? 可选，设备标识，具体见 Pushbullet 文档
  };
  url &&
    Object.assign(data, {
      type: 'link',
      url,
    });
  fetch('https://api.pushbullet.com/v2/pushes', {
    method: 'POST',
    headers: new Headers({
      'Access-Token': 'o.xxx', //! 你的访问令牌
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(data),
  });
  return notification;
}
```

你还可以在这里([Reducer 函数 (Pushover 版)](https://gloria.pub/task/60157ce3ab474400108be625))找到使用 Pushover 的版本，更多其他工具的使用接口请参考其文档。

#### 测试 Rudecer

在 Reducer 设置面板中你还可以对所编写的 Reducer 函数进行一些简单的测试。

你可以在测试对象输入框中填入一个由 `Gloria Notification` 对象或其所组成的数组序列化后的 **JSON 字符串**，其实也就是直接模拟出一个任务执行后得出的结果，然后再点击测试按钮后就可以查看 Reducer 函数的返回值及弹出的通知效果了。

至于 Reducer 函数的代码错误或者是在 Reducer 函数中使用 `console` 语句的输出需要打开扩展程序的背景页<"background.html">进行查看。

最后再叮嘱一句，一定要小心使用 Reducer 函数。

## 其他事项

### 准时模式

任务中有一个可选的 `准时模式` 选项，即任务严格按照给定时间间隔执行检查 (_不影响任务代码本身，任务依旧兼容 Gloria_)。在任务已启用的前提下，

- 采用默认模式(Gloria 的设定)的任务在启动浏览器时总是会自动执行一次，再以此刻活动时间为基准设定计时器；

- 采用准时模式的任务在启动浏览器时会先判定该任务距上一次的执行时间是否超过所设定的执行间隔，若还在间隔时间内，则不会立即执行检查，而是依照预定的时间到达时才会执行检查。

### 其他特性

- 允许隐式推送通知 (记录通知但不会有消息提示)
- 支持稍后查阅通知的功能
- 允许筛选任务和通知记录
- 允许自定义通知是否发出提示音
- 可以在 Popup 页面中通过鼠标右键菜单操作任务和通知记录

## 相关文档

**更多相关的具体详情可以参考：**

1. Gloria 中文指南：https://docs.gloria.pub/
2. 任务代码分享网站：https://gloria.pub/

## Firefox 版本的限制

由于所提供的 API 支持程度不相同，在 Firefox 上的版本存在一些功能限制。

以下是 Firefox 版本相对 Chrome 版本所<u>不支持</u>的功能：

- 弹出的通知需要手动关闭的可选选项
- 在弹出的通知中显示图片
- 在弹出的通知中提供操作按钮

以下是 Firefox 版本相对 Chrome 版本一些处理逻辑上的区别：

- 如果启用了"在扩展程序图标上显示未读通知数量标记"功能，当点击通知的关闭按钮时，并不会使数量标记值减少。(若通知关联着网址，点击通知打开网址时才会标记值减少。)

## 开发编译

### 环境需求

- 安装 [Node.js](https://nodejs.org/) 8.9 及以上(_新版本已集成 npm,若您的网络环境不佳，推荐安装使用 [cnpm](https://github.com/cnpm/cnpm)_)

### 初始化指令

```bash
# 安装 Vue CLI
npm install @vue/cli -g

# 安装依赖
npm install
```

### 构建指令

- 构建 chrome 版本: `npm run build-chrome`
- 构建 firefox 版本: `npm run build-firefox`

### 相关目录及文件

- 与打包相关的配置位于 `vue.config.js` 文件中
- 扩展程序源代码位于 `src` 目录中
- 未改动配置的情况下，`src/assets` 目录下所有文件及文件夹在打包时会自动复制到项目根目录

## 相关项目

在此，向 Gloria 作者 [BlackGlory](https://github.com/BlackGlory) 以及所有相关项目人员表示由衷的感谢。:heart:

- [BlackGlory/Gloria](https://github.com/BlackGlory/Gloria)
- [akanshgulati/scrap-favicon](https://github.com/akanshgulati/scrap-favicon)
- [CarterLi/vue3-ace-editor](https://github.com/CarterLi/vue3-ace-editor)
- [element-plus/element-plus](https://github.com/element-plus/element-plus)
- [GitHub-Laziji/menujs](https://github.com/GitHub-Laziji/menujs)
- [ReactiveX/rxjs](https://github.com/ReactiveX/RxJS)
- [Simonwep/selection](https://github.com/Simonwep/selection)
- [vuejs/vue-next](https://github.com/vuejs/vue-next)
- [yyf1994gggg/vuex-chrome](https://github.com/yyf1994gggg/vuex-chrome)

## 许可证

[MIT](/LICENSE) License
