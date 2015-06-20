(function (global) {
  'use strict';

  /**
   * callback id
   *
   * 每个绑定的callback会被添加一个属性
   * property = id_key
   * value = cid
   *
   */
  var cid = 0;
  function getCid() {
    return cid++;
  }

  var id_key = '__jevent_id';
  function callbackId(callback, id) {
    if (arguments.length === 1) {
      return callback[id_key];
    } else {
      callback[id_key] = id;
    }
  }

  /**
   * callback的容器
   *
   * 使用jEvent绑定的callback保存在container
   * 其他继承jEvent的对象有自己独立的callback容器，容器是自动创建的，用户不可见
   * 其他继承jEvent的对象会自动添加一个属性，作为callback容器，所以他们的容器是相互独立的
   * 容器是内部自动创建的
   * property = container_key
   * value = {}
   */
  var container = {};
  var container_key = '__events';
  function getEventContainer(obj) {
    // jEvent对象的容器
    if (obj === jEvent) {
      return container;
    }

    // 继承jEvent对象的其他对象的容器
    if (container_key in obj) {
      return obj[container_key];
    } else {
      return obj[container_key] = {};
    }
  }

  function unsetEventContainer(obj) {
    if (obj === jEvent) {
      container = {};
    } else {
      obj[container_key] = {};
    }
  }

  /**
   * jEvent 对象
   */

  var jEvent = {
    on: function (key, callback, obj) {
      var id = getCid();
      var container = getEventContainer(this);
      var fn;

      if (obj) {
        callbackId(callback, id);
        fn = function (param) {
          callback.call(obj, param)
        }
      } else {
        fn = callback;
      }
      callbackId(fn, id);

      container[key] || (container[key] = []);
      container[key].push(fn);

      return this;
    },

    emit: function (key, param) {
      var container = getEventContainer(this);
      var callbacks = container[key];

      var i = 0;
      var callback;

      if (callbacks) {
        while (callback = callbacks[i]) {
          callback(param);
          i++;
        }
      }

      return this;
    },

    off: function (key, callback) {
      var container = getEventContainer(this);

      switch (arguments.length) {
        case 0:
          unsetEventContainer(this);
          break;
        case 1:
          delete container[key];
          break;
        case 2:
          var events = container[key];

          for (var i = 0, len = events.length; i < len; i++) {
            if (callbackId(callback) === callbackId(events[i])) {
              events.splice(i, 1);
              i--;
              len--;
            }
          }
          break;
      }

      return this;
    }
  };

  global.jEvent = jEvent;

  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function () {
       return jEvent;
    });
  }

}(this));
