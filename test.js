
var expect = require('chai').expect;
var jEvent = require('./jevent.js');

// 接口
function interface(obj) {
  expect(obj.on).to.be.a('function');
  expect(obj.on).to.have.length(31);

  expect(obj.emit).to.be.a('function');
  expect(obj.emit).to.have.length(2);

  expect(obj.off).to.be.a('function');
  expect(obj.off).to.have.length(2);
}

function simple(obj) {
  var expected = 0;

  obj.on('add', function () {
    expected = 1;
  });

  obj.emit('add');
  expect(expected).to.equal(1);
}

function multiple(obj) {
  // 多个callback顺序执行
  obj.on('add', function () {
    expected = 0;
  });
  obj.on('add', function () {
    expected = expected + 2;
  });

  // 0+2
  obj.emit('add');
  expect(expected).to.equal(2);

  obj.on('add', function () {
    expected = expected + 3;
  });
  // 0+2+3
  obj.emit('add');
  expect(expected).to.equal(5);
}

function transferArgObj(obj_origin) {
  var obj = {
    expected: 0,
    cb: function (arg) {
      this.expected = arg;
    }
  };

  obj_origin.on('obj', obj.cb);
  obj_origin.emit('obj');
  expect(obj.expected).to.equal(0);

  obj_origin.on('obj', obj.cb, obj);
  obj_origin.emit('obj', 1);
  expect(obj.expected).to.equal(1);
}


function offEvent(obj) {
  var expected = 0;

  obj.on('off', function () {
    expected++;
  });
  obj.on('heloo', function () {
    expected++;
  });

  obj.off();
  obj.emit('off');
  obj.emit('heloo');
  expect(expected).to.equal(0);
}

function offEventKey(obj) {
  var expected = 0;

  obj.on('off', function () {
    expected = 3;
  });
  obj.on('heloo', function () {
    expected = 5;
  });

  obj.off('off');
  obj.emit('off');
  expect(expected).to.equal(0);
  obj.emit('heloo');
  expect(expected).to.equal(5);
}


function offEventCb(obj) {
  var expected = 0;

  function add() {
    expected++;
  }

  obj.on('off', add);
  obj.on('off', add);
  obj.on('off', function () {
    expected++;
  });

  obj.off('off', add);
  obj.emit('off');
  expect(expected).to.equal(1);
}


describe('jEvent', function () {
  describe('interface', function () {
    it('the function has three argument', function () {
      interface(jEvent);
    });
  });
});


describe('jEvent', function () {
  describe('.on() & .emit()', function () {
    beforeEach(function () {
      jEvent.off();
    });

    it('simple', function () {
      simple(jEvent);
    });

    it('multiple', function () {
      multiple(jEvent);
    });

    it('transfer arg * obj', function () {
      transferArgObj(jEvent);
    });
  });


  describe('.off', function () {
    beforeEach(function () {
      jEvent.off();
    });

    it('off()', function () {
      offEvent(jEvent);
    });

    it('off(key)', function () {
      offEventKey(jEvent);
    });

    it('off(key, callback)', function () {
      offEventCb(jEvent);
    });

  });
});



// 继承
var subEvent = {};
for (var key in jEvent) {
  if (jEvent.hasOwnProperty(key)) {
    subEvent[key] = jEvent[key];
  }
}

describe('subEvent', function () {
  describe('interface', function () {
    it('the function has three argument', function () {
      interface(subEvent);
    });
  });
});



describe('subEvent', function () {
  describe('.on() & .emit()', function () {
    beforeEach(function () {
      subEvent.off();
    });

    it('simple', function () {
      simple(subEvent);
    });

    it('multiple', function () {
      multiple(subEvent);
    });

    it('transfer arg * obj', function () {
      transferArgObj(subEvent);
    });
  });


  describe('.off', function () {
    beforeEach(function () {
      subEvent.off();
    });

    it('off()', function () {
      offEvent(subEvent);
    });

    it('off(key)', function () {
      offEventKey(subEvent);
    });

    it('off(key, callback)', function () {
      offEventCb(subEvent);
    });

  });
});


