# Gloria-X

[![License](https://img.shields.io/badge/License-MIT-green.svg)](/LICENSE)

> Chrome 上的可编程网站通知聚合器
>
> **原项目：**[BlackGlory](https://github.com/BlackGlory)/[Gloria](https://github.com/BlackGlory/Gloria) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/Gloria/master/LICENSE)

![Gloria-X](/src/assets/icons/app/icon-128.png)

通过自定义的 JavaScript 代码任务实现抓取网站上的新内容并弹出通知提醒。

本项目是由我个人采用 TypeScript 进行编写和维护的 Gloria 分支版本，用于修改及扩充 Gloria 中的部分功能，并添加我个人所需要的一些特性，所以 Gloria-X 可以理解为是一个以 Gloria 为核心，并~~提供功能增强~~*胡乱瞎改*的版本。

**声明 ：** 我决定编写这个项目的初衷并不是因为原本的 Gloria 存在任何影响使用的缺陷或问题，相反地，作为 Gloria 的忠实用户，我用它完成了各式各样的网页监视和消息通知等任务，是我浏览器上必备的扩展程序之一。我之所以选择编写这个工具的原因旨在学习 TypeScript，提高编程水平，顺便根据自己的使用习惯改写部分工具特性。

## 安装方法

*还在测试中，懒得打包。*

## 使用方法

由于是承袭自 Gloria，所以 Gloria-X 基本上实现了 Gloria 上所有的功能，使用方法和任务开发与其相同。正常情况下，为 Gloria 所编写的任务代码是同样可以在 Glorai-X 上工作的，反之亦可。以下是一些简要的使用方法介绍：

JavaScript 同样是 Gloria-X 任务代码唯一支持的编程语言。任务创建通知的编写方法与 Gloria 相同，只需要将 `Gloria Notification` 对象或其组成的数组传递给一个特定的回调函数 `commit`。

比如，下面这段任务代码就会在每次设定的时间间隔到达后执行并弹出一个关于时间戳的通知消息：

```javascript
commit({
    title: Date.now().toString(),
});
```

*当然这段任务代码本身是没有实际意义的。*

### `Gloria Notification` 对象结构

`Gloria Notification` 对象结构如下：

```javascript
{
  title: String,    // 默认为 ''，推送消息的标题
  message: String,  // 默认为 ''，推送消息的内容
  iconUrl: String,  // 默认为 undefined，推送消息的图标
  imageUrl: String, // 默认为 undefined，在推送消息上额外显示的图片
  url: String,      // 默认为 undefined，点击推送消息时打开的网址
  id: String,       // 默认为 undefined，用于额外判定通知是否相同。如非特定需求，一般不需要手动指定
}
```

*为了安全性和避免可能发生某些未知的错误，扩展程序在内部处理时会忽略掉 `Gloria Notification` 对象上的其他属性。*

#### 对象属性介绍

>  提示：设定上所有对象的属性类型均为**可选的** `String` 字符串，即使在扩展程序的内部处理时可能会存在相应的隐式类型转换，但还是建议在编写时不要直接传递其他可以隐式转换为 `String` 的类型 (如：`Number`，`Boolean` 等)，应当自行手动将其转换为 `String`。

- `title`
   - 类型: `String`
   - 默认值: `""`
   - 含义: 推送消息的标题。
   - 会用于与旧消息的判定中。
   - 如：在一个[观察任务](#观察任务)中，如果新对象中的 `title` 与储存里旧对象中的 `title` 不相同时，则新对象会被判定为一则新消息。
- `message`
  - 类型: `String`
  - 默认值: `""`
  - 含义: 推送消息的主体内容或描述。
  - 会用于与旧消息的判定中。
  - 小提示：如果不是用于测试之类的用途，建议不要直接在 `title` 或 `message` 属性中包含与消息本身无关的第三方可变量内容 (比如一个时间戳 `Date.now().toString()`)，因为其会导致每一次得到的对象都会被判定是新消息而进行推送。如果出于某种需求需要将两个 `title` 和 `message` 相同的对象当作两个不同的消息处理，可以为对象指定两个不相同的 `id` 属性值 (在 Gloria 中同样可以采用这种方式)。
- `iconUrl`
  - 类型: `String`
  - 默认值: `undefined`
  - 含义: 推送消息显示的图标信息。
  - 这是 Chrome 创建通知消息时必须提供的参数，所以若不手动指定，扩展程序会先查找 `url`(*若指定了 `url` 并在设置中启用相应的功能*) 网站的网站图标，其次会提供一个默认图标 `"icons/app/icon-128.png"` (即 Gloria-X 的图标)。
- `imageUrl`
  - 类型: `String`
  - 默认值: `undefined`
  - 含义: 推送消息上额外显示的一张图片。若指定 `imageUrl` 属性，通知会变为一个带图片的通知。
- `url`
  - 类型: `String`
  - 默认值: `undefined`
  - 含义: 点击推送消息时打开的网站。
- `id`
  - 类型: `String`
  - 默认值: `undefined`
  - 含义: 对象的标识符，可以用于额外判定通知是否相同。
  - 会用于与旧消息的判定中。

### `commit` 函数

根据传递给 `commit` 参数的区别，任务分为"**观察任务**"和"**常规任务**"。

#### 观察任务

当传递一个单一的 `Gloria Notification` 对象给 `commit` 函数时，该任务会被识别为"观察任务"，会将每次得到的 `Gloria Notification` 对象与上一次所记录 `Gloria Notification` 的对象进行对比，不相同时则会推送新通知。

#### 常规任务

当传递一个由 `Gloria Notification` 对象所组成的数组时，该任务会被识别为"常规任务"，每次所收集到的内容都会被缓存于内部的 `Stages` 组件中，这样只有新对象时才会推送相应的通知。当然，每一个"常规任务"的 `Stages` 组件缓存数量是存在上限值的，但理论上你不会需要去关心其大小，只需要保证每个"常规任务"不会一次传入数量过多的 `Gloria Notification` 对象即可。

### 访问 URL

访问 url 有两种方法：

1. 通过 `fetch` 函数

你可以在 [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) 里查看 `fetch` 的使用方法，需要注意的是在 Gloria-X 环境下的 `fetch` 在创建请求时会自动附加目标 url 的 Cookie，以便可以利用到在目标网站上的登录状态，当然这样推送的通知显示内容里也许会包含你的私人信息 (具体显示内容取决于 `Gloria Notification` 对象是如何编写的)。

2. 通过 `XMLHttpRequest(XHR)` 对象

你可以在 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 里查看 `XHR` 的使用方法，与 `fetch` 不同的时，Gloria-X 环境下的 `XHR` 不会自动附加目标 url 的 Cookie，也就无法获取到目标网站上的登录状态了。

### 异步载入外部脚本

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

|                        集成模块/版本                         | Gloria(0.13.10) & Gloria-X |
| :----------------------------------------------------------: | :------------------------: |
| export `cheerio` from '[cheerio](https://github.com/cheeriojs/cheerio)' |           0.22.0           |
|      export `co` from '[co](https://github.com/tj/co)'       |           4.6.0            |
| export `cookie` from '[cookie](https://github.com/jshttp/cookie)' |           0.3.1            |
| export `immutable` from '[immutable](https://github.com/immutable-js/immutable-js)' |           3.8.1            |
| export `is` from '[is_js](https://github.com/arasatasaygin/is.js)' |           0.9.0            |
| export `lodash` from '[lodash](https://github.com/lodash/lodash)' |           4.16.4           |
| export `moment` from '[moment](https://github.com/moment/moment)' |           2.18.1           |
|    export `qs` from '[qs](https://github.com/ljharb/qs)'     |           6.3.0            |
| export `ramda` from '[ramda](https://github.com/ramda/ramda)' |           0.24.1           |
| export `rx` from '[rx](https://github.com/Reactive-Extensions/RxJS)' |           4.1.0            |
| export `sanitizeHtml` from '[sanitize-html](https://github.com/apostrophecms/sanitize-html)' |           1.13.0           |
| export `SystemJS` from '[systemjs](https://github.com/systemjs/systemjs)' |          0.20.14           |
| export `underscoreString` from '[underscore.string](https://github.com/esamattis/underscore.string)' |           3.3.4            |
| export `validator` from '[validator](https://github.com/validatorjs/validator.js)' |           7.1.0            |
| export `xml2js` from '[xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)' |           0.4.17           |
| export `XRegExp` from '[xregexp](https://github.com/slevithan/xregexp)' |           3.2.0            |

## 高级选项

### 调试任务代码

可以在扩展程序选项页面的"任务调试"分页中找到调试任务的面板。

在代码输入框中输入需要调试的任务代码后，点击页面上方的"测试"按钮，即可查看测试输出结果 (当然，异步执行的任务代码可能需要等上一会儿)，并且所得到的测试结果既不会经过内部的 STAGES 组件 (一个用于缓存消息的组件)，也不会经过 Reducer 函数 (见后面介绍)，而是直接生成相应的通知消息。

若任务代码中存在语法等错误，也会显示在面板中 (*注：仅支持捕获同步执行代码的错误，采用异步执行的代码的错误或者是在代码中使用 `console` 语句的输出需要打开扩展程序的背景页<"background.html">进行查看*)。

### 观察内部状态

可以在扩展程序选项页面的"内部状态"分页中找到观察内部状态的面板。

在这里，你可以观察到"通知记录"、"Gloria-X 任务" 和 "STAGES" 组件在内部储存的实时状态。

同时在页面底部还提供了一些清理功能的按钮。

### 通知 Reducer

可以在扩展程序选项页面的"通知 Reducer"分页中找到 Reducer 设置面板。

**在介绍和使用 Reducer 函数之前，希望你能清楚该函数本身是一把"双刃剑"，在带来便利的同时有可能会因为使用不当而造成一些不必要的麻烦。**

#### 介绍

如果你需要对任务执行后所得到的新通知在正式推送之前进行一些二次操作的话，那么你就需要使用到 Reducer 函数。 Reducer 函数是 Gloria-X 提供的一个特殊函数 (当然，你同样可以在 Gloria 里找到它)。与之前任务代码中的 `commit` 函数不同，它不会出现在任务代码当中，而是单独地在选项页面里进行设置。如果你提供了 Reducer 函数，那么所有的任务都会使用同一个 Reducer 函数。

#### 工作方式

Reducer 是一个同步执行的函数，当一个任务执行完成后若存在需要进行推送的新 `Gloria Notification` 对象时，该对象会作为参数被传递进 Reducer 函数中执行一次操作。

注意：在 Reducer 函数执行之前，消息的对比和缓存都已经完成，Reducer 函数的操作只会影响到后面通知的显示和记录中的内容。它的执行时机大概是像下面这样的：

```
Task(Execute) ==> commit ==> Gloria Notification(s) ==> STAGES(Compare and cache) ==> Reducer ==> Popup Notifications
```

#### 作用

在 Reducer 函数中，你可以完成修改、过滤以及通过 http 请求发送给第三方服务(比如：[Pushbullet](https://www.pushbullet.com/)、[Alertover](https://www.alertover.com/)、[Server酱](https://sc.ftqq.com/3.version)等)将消息同步至其他设备当中的操作。

#### 具体用法

Reducer 接收一个 `Gloria Notification` 对象作为参数，并可选的返回一个新的 `Gloria Notification` 对象，该返回值将被用于弹出新通知。若函数没有提供返回值或者返回的是一个 `null` 时，则被视为被抛弃，不会弹出新通知，更不会在通知记录中看到它。

#### 示例

##### 过滤通知

过滤掉 `message` 中包含 "sad" 的字符串:

```javascript
function reducer(notification) {
    if (notification.message.includes('sad')) {
        return null;
    }
    return notification;
}
```

>  *注：由于 Reducer 函数工作于将通知消息缓存进 STAGES 组件的操作之后，所以即使通知被丢弃，STAGES 组件中仍然会保存关于该通知消息的缓存，但是不会出现通知记录当中。*
>
>  *（当然，你其实并不需要十分关心这些内容，因为它不会影响到任务代码的编写，我之所以要告诉你这些，只是希望你能更清楚 Reducer 函数是在何时工作的，产生了什么影响，多了解一些没什么坏处。）*
>
>  *即假设当你通过 Reducer 丢弃一则通知消息，然后删除了 Reducer 函数，那么理论上在下一次任务执行后，这一则通知也不会被当作新消息弹出，因为它之前已经被缓存进 STAGES 组件中了。*

##### 修改通知

将 `message` 中的 "sad" 修改为 "happy":

```javascript
function reducer(notification) {
    notification.message = notification.message.replace('sad', 'happy');
    return notification;
}
```

> *注：由于 Reducer 函数工作于将通知消息缓存进 STAGES 组件的操作之后，所以 STAGES 组件中仍然保存的是关于修改之前的通知消息的缓存，但是通知记录中会显示修改之后的通知内容。*
>
> *即假设当你通过 Reducer 修改了一则通知消息，然后删除了 Reducer 函数，那么理论上在下一次任务执行后，这一则通知也不会被当作新消息弹出，因为它其实和 STAGES 组件中缓存的消息相同。*

小提示：通常来说在 Reducer 函数中去修改 `notification.id` 属性是没有意义的，因为这个属性值并不会真实地反馈到通知消息当中去，它仅仅是用于在 STAGES 组件中进行判定(见：[对象属性介绍](#对象属性介绍))。

当然，也许你会通过在观察内部状态面板中发现每一条通知记录都拥用一个独立了 `id` 属性，但其实它和你在 `Gloria Notification` 对象中填写的 `id` 属性没有任何的关联。通知记录当中通知的 ID 值和任务的 ID 值作用是相同的，都是由扩展程序内部自动随机生成并且是只读的。

##### 发送给 Pushbullet

你可以通过 Pushbullet 将通知消息同步到其它设备上。更多关于 Pushbullet 的使用方法，请参考[官方文档](https://docs.pushbullet.com/)。

```javascript
function reducer(notification) {
	const { title, message, url } = notification;
    const data = {
        type: 'note',
        title,
        body: message,
        device_iden: '...',	//? 可选，设备标识，具体见 Pushbullet 文档
    }
    url &&
        Object.assign(data, {
        	type: 'link',
        	url,
    	});
    fetch('https://api.pushbullet.com/v2/pushes', {
        method: 'POST',
        headers: new Headers({
            'Access-Token': 'o.xxx',	//! 你的访问令牌
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
    });
    return notification;
}
```

#### 测试 Rudecer

在 Reducer 设置面板中你还可以对所编写的 Reducer 函数进行一些简单的测试。

你可以在测试对象输入框中填入一个由 `Gloria Notification` 对象或其所组成的数组序列化后的 **JSON 字符串**，其实也就是直接模拟出一个任务执行后得出的结果，然后再点击测试按钮后就可以查看 Reducer 函数的返回值及弹出的窗口效果了。

至于 Reducer 函数的代码错误或者是在 Reducer 函数中使用 `console` 语句的输出需要打开扩展程序的背景页<"background.html">进行查看。

最后再叮嘱一句，一定要小心使用 Reducer 函数。

---

**更多相关的具体详情可以参考：**

1. Gloria 中文指南：https://docs.gloria.pub/
2. 任务代码分享网站：https://gloria.pub/

---

## 与 Gloria 的区别

虽然 Gloria-X 是基于 Gloria 修改而成，大体功能上保持不变，但是仍存在着部分差异：

1. 显示界面有所区别：Gloria-X 中新增加了一个选项页面，并将原来 Gloria 中的"高级"选项卡从 Popup(弹出窗口) 中分离出来，放置于选项页面中。
2. 在任务中新增加一个`准时模式`可选选项，即任务严格按照给定时间间隔执行检查 (*不影响任务代码本身，任务依旧兼容 Gloria*)。在任务已启用的前提下，
   - 采用默认模式(Gloria 的设定)的任务在启动浏览器时总是会自动执行一次，再以此刻活动时间为基准设定计时器；
   - 采用准时模式的任务在启动浏览器时会先判定该任务距上一次的执行时间是否超过所设定的执行间隔，若还在间隔时间内，则不会立即执行检查，而是依照预定的时间到达时才会执行检查。
3. 默认不再自动检测网站图标，但依旧可以在常规设置当中开启该功能。

同时也加入了一些方便使用的新特性：

- ~~实现快速选取网页内元素并创建监视文本的观察任务~~ *（待实现 ＞︿＜）*
- 允许隐式推送通知 (记录通知但不会有消息提示)
- 允许扩展程序图标显示读通知数量
- 支持稍后查阅通知的功能
- 允许筛选任务和通知记录
- 通知记录中可以按相关推送任务的名称进行分类
- 允许通知记录里的图片懒加载
- 允许自定义通知是否发出提示音
- 允许在任务执行出错时弹出通知提示

## 计划

本项目是我采用空闲时间进行的编写和维护，由于时间和能力有限，部分构思中的功能暂时未能完成，其中包括：

- 实现快速选取网页内元素并创建监视文本的观察任务

## 相关项目

在此，向 Gloria 作者 [BlackGlory](https://github.com/BlackGlory) 以及所有相关项目人员表示由衷的感谢。:heart:

- [BlackGlory/Gloria](https://github.com/BlackGlory/Gloria)
- [a62527776a/vue-floating-action-button](https://github.com/a62527776a/vue-floating-action-button)
- [akanshgulati/scrap-favicon](https://github.com/akanshgulati/scrap-favicon)
- [ElemeFE/element](https://github.com/ElemeFE/element)
- [vuejs/vue](https://github.com/vuejs/vue)
- [yyf1994gggg/vuex-chrome](https://github.com/yyf1994gggg/vuex-chrome)

## 许可证

[MIT](/LICENSE) License