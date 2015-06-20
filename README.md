# jEvent

JS事件中枢

---

用于组件提供异步回调接口，能有效降低各组件的耦合。

jQuery的`on emit off`三个方法提供了类似功能，但直接用jQuery的不够优雅。

**用法：**

```js

// 简单
jEvent.on('show', function (param) {
  console.log(param);  // 22
});

jEvent.emit('show', 22);  // 第二个参数可选

jEvent.off('show');  // 解除对show的监听


// 继承
var Dialog = {};

$.extend(Dialog, jEvent);
Dialog.on('show', function () {
  console.log(11);
});

// 继承的对象不会相互影响
Dialog.emit('show');  // 不会影响上面的jEvent.on('show', ...);


```
