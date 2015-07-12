# jEvent

[![Build Status](https://travis-ci.org/epooren/jevent.svg?branch=master)](https://travis-ci.org/epooren/jevent) [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

JS事件管理

---

## Installtion

> npm install jevent --save


## API

* `jEvent.on(name, callback, [obj])`
* `jEvent.emit(name, [arg])`
* `jEvent.off([name, [callback]])`


其他对象可以继承`jEvent`上面的API

```js

var dialog = {};

jQuery.extend(obj, jEvent);

dialog.on('alert', function () {
	alert('Hi');
});

dialog.emit('alert');  // Hi

```
