
var assert = require('chai').assert;
var jEvent = require('./jevent.js');
var assign = require('object.assign');


suite('jEvent', function () {

  test('#on()', function () {
    var obj = jEvent
        .on('on', function () {})
        .on('on-obj', function () {}, {});

    assert.equal(obj, jEvent, '链式调用on()');
  });

  test('#one()', function () {
    var obj = jEvent
        .one('one', function () {})
        .one('one-obj', function () {}, {});

    assert.equal(obj, jEvent, '链式调用one()');
  });

  test('#trigger()', function () {
    var i = 0;

    jEvent
    .on('on', function () {
      i++;
    })
    .one('on', function () {
      i++;
    })
    .on('ignore', function () {
      i++;
    });

    var obj = jEvent.trigger('on');

    assert.equal(i, 2, '触发了on()和one()绑定的事件');
    assert.equal(obj, jEvent, '链式操作');
  });

  test('#trigger() 传参', function () {
    var i = 0;
    jEvent.one('paramater', function (paramater) {
      i = paramater;
    });
    jEvent.trigger('paramater', 23);
    assert.equal(i, 23, 'i === 23');
  });

  test('#emit() 传参', function () {
    var i = 0;
    jEvent.one('paramater', function (paramater) {
      i = paramater;
    });
    jEvent.emit('paramater', 23);
    assert.equal(i, 23, 'i === 23');
  });


  test('#off()', function () {
    var i = 0;
    jEvent.on('off', function () {
      i++;
    });
    jEvent.off();
    jEvent.trigger('off');
    assert.equal(i, 0, '成功接触所有绑定的事件');
  });

  test('#off() event', function () {
    jEvent.off();

    var i = 0;

    jEvent
    .on('off', function () { i++;})
    .on('ignore', function () { i++;});

    jEvent.off('ignore');
    jEvent.trigger('off');
    assert.equal(i, 1, '成功解除绑定的声明函数');
  });

  test('#off() event handler', function () {
    jEvent.off();

    var i = 0;
    var add = function () {
      i++;
    }

    jEvent
    .on('off', function () { i++;})
    .on('off', add)
    .on('off', function () { i++;});

    jEvent.off('off', add);
    jEvent.trigger('off');
    assert.equal(i, 2, '成功解除绑定的声明函数&对象');
  });


  test('#off() event handler obj', function () {
    jEvent.off();

    var i = 0;
    var obj = {};
    var add = function () {
      i++;
    }
    jEvent
    .on('off', function () { i++;})
    .on('off', add)
    .on('off', add, obj);

    jEvent.off('off', add, obj);
    jEvent.trigger('off');
    assert.equal(i, 2, '成功解除绑定的声明函数&对象');
  });

  test('#change() 绑定的事件', function () {
    jEvent.off();

    var i = 0;

    jEvent
    .change(function () { i++})
    // = jEvent.trigger('change');
    .change();

    assert.equal(i, 1, 'change');
  });

  test('#change() 传参', function () {
    jEvent.off();

    var i = 0;

    jEvent
    .change(function (paramater) { i = paramater;})
    // = .trigger('change', 32);
    .change(32);

    assert.equal(i, 32, 'i === 32');
  });

  test('#offChange()', function () {
    jEvent.off();

    var i = 0;

    jEvent
    .change(function (paramater) { i = paramater;})
    .offChange()
    .change(32);

    assert.equal(i, 0, 'i === 0');
  });
});


suite('extend jEvent', function () {
  var fuck_gfw = {
    name: 'fuck'
  };

  setup(function () {
    assign(fuck_gfw, jEvent);
  });

  test('#off() event handler obj', function () {
    fuck_gfw.off();

    var i = 0;
    var obj = {};
    var add = function () {
      i++;
    }
    fuck_gfw
    .on('off', function () { i++;})
    .on('off', add)
    .on('off', add, obj);

    fuck_gfw.off('off', add, obj);
    fuck_gfw.trigger('off');
    assert.equal(i, 2, '成功解除绑定的声明函数&对象');
  });
});




