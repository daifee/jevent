
(function (global, factory) {
  'use strict';

  // 执行工厂方法
  var jEvent = factory(global);

  // 暴露接口
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function () {
      return jEvent;
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = jEvent;
  } else {
    global.jEvent = jEvent;
  }
}(this, function(win) {
  'use strict';

  /**
   * id发生器
   */
  var cid = 0;

  function getId() {
    return cid++;
  }

  /**
   * 管理回调函数的jevent_id
   */
  var callback_id_key = '__jevent_id';

  function callbackId(callback, id) {
    if (arguments.length === 1) {
      return callback[callback_id_key];
    } else {
      return callback[callback_id_key] = id;
    }
  }


  /**
   * 管理callback的容器
   */
  var container = {};
  var container_key = '__jevent_container';

  function getContainer(obj) {
    if (obj === jEvent) {
      return container;
    }

    if (container_key in obj) {
      return obj[container_key];
    } else {
      return obj[container_key] = {};
    }
  }

  function clearContainer(obj) {
    if (obj === jEvent) {
      container = {};
    } else {
      delete obj[container_key];
    }
  }


  var jEvent = {
    on: function (key, callback, obj) {
      var id = getId();
      var container = getContainer(this);
      var fn;

      callbackId(callback, id);

      if (obj) {
        fn = function (arg) {
          callback.call(obj, arg);
        }
        // 为了.off()
        callbackId(fn, id);
      } else {
        fn = callback;
      }

      container[key] || (container[key] = []);
      container[key].push(fn);

      return this;
    },

    emit: function (key, arg) {
      var container = getContainer(this);
      var callbacks = container[key];

      if (callbacks) {
        for (var i = 0, len = callbacks.length; i < len; i++) {
          callbacks[i](arg);
        }
      }

      return this;
    },

    off: function (key, callback) {
      var container = getContainer(this);

      switch (arguments.length) {
        case 0:
          clearContainer(this);
          break;
        case 1:
          delete container[key];
          break;
        case 2:
          var callbacks = container[key];
          var i = 0;
          var cb;

          while (cb = callbacks[i]) {
            if (callbackId(callback) === callbackId(cb)) {
              callbacks.splice(i, 1);
            } else {
              i++;
            }
          }
          break;
      }

      return this;
    }
  };


  return jEvent;
}));


