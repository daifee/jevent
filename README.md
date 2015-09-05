# jEvent

[![Build Status](https://travis-ci.org/epooren/jevent.svg?branch=master)](https://travis-ci.org/epooren/jevent) [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

JS事件管理器

---

## INSTANLLATION

```sh
$ npm install jevent --save
```

## USAGE

```js
// var jEvent

jEvent.on('fuck-gfw', function () {
  console.log('one');
});

jEvent.trigger('fuck-gfw');


var obj = {};
$.extend(obj, jEvent);

obj.on('fuck-gfw', function () {
  console.log('again……');
});
obj.trigger('fuck-gfw');

// show in console
// one
// again……
```

**注意：** `obj`与`jEvent`分别绑定的事件互不干扰，所以不会出现打印`one`


## API

* `jEvent.on(event, handler[, obj])`
* `jEvent.one(event, handler[, obj])`
* `jEvent.trigger(event)`
* `jEvent.off([event[, handler[, obj]]])`
* `jEvent.on(event, handler[, obj])`
* `jEvent.change(mix[, obj])`
* `jEvent.offChange([handler[, obj]])`

详情看源码（jevent.js）

## LICENSE

MIT
