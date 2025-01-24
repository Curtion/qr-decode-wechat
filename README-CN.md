# qr-decode-wechat

[English Version](README.md)

`JavaScript`的二维码解析库, 使用`4.11.0`版本的[opencv](https://github.com/opencv/opencv)、[wechat_qrcode](https://github.com/opencv/opencv_contrib/tree/4.11.0/modules/wechat_qrcode)编译成`WebAssembly`。

使用了[qr-scanner-wechat](https://github.com/antfu/qr-scanner-wechat)项目的部分代码。

和`qr-scanner-wechat`相比修改了以下内容：

 - 支持多结果解析返回
 - 禁止使用[unsafe-eval](https://github.com/emscripten-core/emscripten/issues/20994)语法, 原理上使其可以在`微信小程序`和`Manifest V3拓展`中使用

[在线演示](https://curtion.github.io/qr-decode-wechat/example/cdn-vanilla/)

# 使用方法

## npm

```shell
npm i qr-decode-wechat
```

```javascript
import { decode } from 'qr-decode-wechat'

const result = await decode(canvas) // Or ImageElement
```

## 浏览器

```html
<script src="//unpkg.com/qr-decode-wechat/dist/main.umd.js"></script>
<script>
    const result = await qrDecode.decode(canvas) // Or ImageElement
</script>
```

## Node

暂不可用
