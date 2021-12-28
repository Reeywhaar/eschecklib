# ESCHECKLIB

Simple lib to check javascript code conformance to various ecma specifications

## Example
```js
const { escheck } = require('eschecklib')

async function () {
  const result = await escheck({ glob: "./build/*.js" })
  if (result.length) {
    const out = []
    for (const err of result) {
      console.error(err.error)
    }
  }
}
```