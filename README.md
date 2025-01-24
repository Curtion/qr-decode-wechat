# qr-decode-wechat

[中文版](README-CN.md)

A JavaScript QR code decoding library, compiled to WebAssembly using opencv v4.11.0 and wechat_qrcode module from opencv_contrib.

Partially based on code from [qr-scanner-wechat](https://github.com/antfu/qr-scanner-wechat) project.

Key improvements compared to qr-scanner-wechat:

 - Support multiple decoding results return
 - Eliminate [unsafe-eval](https://github.com/emscripten-core/emscripten/issues/20994) usage, making it compatible with WeChat Mini Programs and Chrome Manifest V3 extensions

# Usage

## npm

```shell
npm i qr-decode-wechat
```

```javascript
import { decode } from 'qr-decode-wechat'

const result = await decode(canvas) // Or ImageElement
```

## Browser

```html
<script src="//unpkg.com/qr-decode-wechat/dist/main.umd.js"></script>
<script>
    const result = await qrDecode.decode(canvas) // Or ImageElement
</script>
```

## Node

Currently not supported
