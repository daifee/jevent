/*!
 * jEvent
 * author: daifee <mr_zhangjiayong@163.com>
 */


function Listener(meta) {
  this.event = meta.event;
  this.handler = meta.handler;
  this.obj = meta.obj;
}

Listener.prototype.emit = function (paramter) {
  this.handler.call(this.obj, paramter);
};


function Listeners() {
  this.models = [];
}

Listeners.prototype.each = function (callback) {
  for (var i = 0, len = this.models.length; i < len; i++) {
    callback.call(this, this.models[i], i);
  }
};

Listeners.prototype.add = function (listener) {
  var added = false;

  this.each(function (model) {
    // 已存在handler
    if (model.handler === listener.handler) {
      // 定义了obj，还要判断handler是否对应同一个obj
      if (listener.obj) {
        model.obj === listener.obj && (added = true);
      } else {
        added = true;
      }
    }
  });

  added === false && (this.models.push(listener));
};

Listeners.prototype.resetModels = function (models) {
  this.models = models;
};

/**
 * jEvent绑定的事件集合
 * 扩展（extend）jEvent的子对象，除了添加jEvent的接口，
 * 还会增加一个属性：`._jevent_collection`保存其绑定的事件
 */
var collection = new Listeners();

var getCollection = function (obj) {
  var listeners;

  if (obj === jEvent) {
    listeners = collection;
  } else {
    // ! 比 instanceof 高级
    if (!(obj._jevent_collection instanceof Listeners)) {
      obj._jevent_collection = new Listeners();
    }

    listeners = obj._jevent_collection;
  }

  return listeners;
};


var jEvent = {

  /**
   * 绑定事件
   * @param  {string} event   事件名称
   * @param  {function} handler 事件监听函数
   * @param  {object} obj     handler.call(obj, ...)
   * @return {object}         this
   */
  on: function (event, handler, obj) {
    var meta = {
      'event': event,
      'handler': handler,
      'obj': obj
    };

    var listener = new Listener(meta);
    var listeners = getCollection(this);
    listeners.add(listener);

    return this;
  },

  /**
   * 绑定事件，只会被触发一次
   * @param  {string} event   事件名称
   * @param  {function} handler 事件监听函数
   * @param  {object} obj     handler.call(obj, ...)
   * @return {object}         this
   */
  one: function (event, handler, obj) {
    var meta = {
      'event': event,
      'handler': handler,
      'obj': obj,
      'one': true
    };

    var listener = new Listener(meta);
    var listeners = getCollection(this);
    listeners.add(listener);

    return this;
  },

  /**
   * 触发事件
   * @param  {string} event    事件名称
   * @param  {mix} paramter 传入`handler()`的参数
   * @return {object}          this
   */
  trigger: function (event, paramter) {
    var listeners = getCollection(this);
    var models = [];

    listeners.each(function (listener) {
      if (event === listener.event) {
        listener.emit(paramter);

        // this === listeners
        if (!listener.one) models.push(listener);
      } else {
        models.push(listener);
      }
    });

    listeners.resetModels(models);

    // this === who.trigger()
    return this;
  },

  /**
   * alias of `trigger`
   * @param  {[type]} event    [description]
   * @param  {[type]} paramter [description]
   * @return {[type]}          [description]
   */
  emit: function (event, paramter) {
    return this.trigger(event, paramter);
  },

  /**
   * 移除事件监听
   * @param  {string} event   事件名称
   * @param  {function} handler 监听事件的函数
   * @param  {object} obj     对应`on()`的第3个参数
   * @return {object}         this
   */
  off: function (event, handler, obj) {
    var listeners = getCollection(this);
    var models = [];
    var arg_len = 0;

    // fuck offChange(handler, obj);
    for (var i = 0, len = arguments.length; i < len; i++) {
      typeof arguments[i] !== 'undefined' && (arg_len++);
    }

    listeners.each(function (listener) {
      // this === listeners
      switch (arg_len) {
        case 1:
          if (listener.event !== event) models.push(listener);
          break;
        case 2:
          if (listener.event !== event || listener.handler !== handler) {
            models.push(listener);
          }
          break;
        case 3:
          if (listener.event !== event
              || listener.handler !== handler
              || listener.obj !== obj) {
            models.push(listener);
          }
          break;
      }
    });

    listeners.resetModels(models);

    // this === who.off()
    return this;
  },

  /**
   * 1. `typeof mix === "function"`时，等同于`.on('change', mix, obj)`
   * 2. 否则，等同于`.trigger('change', mix, obj)`
   * @param  {mix} mix 第1种，`mix = handler`；第二种，`mix = paramter`
   * @param  {object} obj 只有第1种情况才有该参数
   * @return {object}     this
   */
  change: function (mix, obj) {
    // on(); mix === handler
    if (typeof mix === 'function') {
      return this.on('change', mix, obj);

    // trigger(); mix === paramter
    } else {
      return this.trigger('change', mix);
    }
  },

  /**
   * `.off('change', handler, obj)`的简写
   * @param  {[type]} handler [description]
   * @param  {[type]} obj     [description]
   * @return {[type]}         [description]
   */
  offChange: function (handler, obj) {
    return this.off('change', handler, obj);
  }
};


module.exports = jEvent;
