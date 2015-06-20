

QUnit.test('最基本用法', function (assert) {
  assert.expect(1);

  jEvent.on('show', function () {
    assert.ok(true, 'ok true');
  });

  jEvent.emit('show');
});

QUnit.test('异步 emit', function (assert) {
  assert.expect(1);
  var done = assert.async();

  setTimeout(function () {
    jEvent.emit('show-1');
  }, 100);

  jEvent.on('show-1', function () {
    assert.ok(true, 'ok true');
    done();
  });
});

QUnit.test('多次触发 emit', function (assert) {
  var done = assert.async();

  var i = 0;

  jEvent.on('show-2', function () {
    i++;
    assert.ok(i, 'i++');
    i === 3 && done();
  });

  jEvent.emit('show-2');
  setTimeout(function () {
    jEvent.emit('show-2');
  }, 100);
  setTimeout(function () {
    jEvent.emit('show-2');
  }, 200);
});

QUnit.test('绑定多个callback', function (assert) {
  assert.expect(3);
  var done = assert.async();

  setTimeout(function () {
    jEvent.emit('show-3');
  }, 100);

  var i = 0;

  jEvent.on('show-3', function () {
    i++;
    assert.strictEqual(i, 1, 'i = 1');
  });

  jEvent.on('show-3', function () {
    i++;
    assert.strictEqual(i, 2, 'i = 2');
  });

  jEvent.on('show-3', function () {
    i++;
    assert.strictEqual(i, 3, 'i = 3');
    done();
  });
});


QUnit.test('绑定多个key on', function (assert) {
  assert.expect(4);
  var i = 0;

  jEvent.on('show-4', function () {
    i++;
    assert.strictEqual(i, 3, '3');
  });

  jEvent.on('hide-4', function () {
    i++;
    assert.strictEqual(i, 1, '1');
  });

  jEvent.on('hide-4', function () {
    assert.strictEqual(i, 1, '1+');
  });

  jEvent.on('alert-4', function () {
    i++;
    assert.strictEqual(i, 2, '2');
  });

  jEvent.emit('hide-4');
  jEvent.emit('alert-4');
  jEvent.emit('show-4');
});


QUnit.test('传递参数', function (assert) {
  assert.expect(1);

  jEvent.on('show-5', function (param) {
    assert.strictEqual(param, 99, 'param = 99');
  });

  jEvent.emit('show-5', 99);
});


// 预期错误
QUnit.test('触发没有绑定的事件', function (assert) {
  assert.expect(0);

  jEvent.emit('error-6', 0);

  jEvent.on('error-6', function (param) {
    assert.strictEqual(param, 99, 'param = 99');
  });
});


// off
QUnit.test('off基本用法', function (assert) {
  assert.expect(0);

  function show() {
    assert.ok(false, 'expect 0');
  }

  jEvent.on('off-7', show);

  jEvent.off('off-7', show);
  jEvent.emit('off-7');
});


QUnit.test('off 1', function (assert) {
  assert.expect(1);

  function show() {
    assert.ok(false, 'expect 1');
  }

  function hide() {
    assert.ok(true, 'expect hide');
  }

  jEvent.on('off-8', show);
  jEvent.on('off-8', hide);

  jEvent.off('off-8', show);
  jEvent.emit('off-8');
});



QUnit.test('off 2', function (assert) {
  assert.expect(1);

  function show() {
    assert.ok(false, 'expect 0');
  }

  function hide() {
    assert.ok(false, 'expect 0');
  }

  function asker() {
    assert.ok(true, 'expect 1');
  }

  jEvent.on('off-9', show);
  jEvent.on('off-9', hide);
  jEvent.on('off-9', asker);

  jEvent.off('off-9', show);
  jEvent.off('off-9', hide);
  jEvent.emit('off-9');
});


QUnit.test('off 3', function (assert) {
  assert.expect(0);

  function show() {
    assert.ok(false, 'expect 0');
  }

  function hide() {
    assert.ok(false, 'expect 0');
  }

  jEvent.on('off-10', show);
  jEvent.on('off-10', hide);

  jEvent.off('off-10');
  jEvent.emit('off-10');
});



QUnit.test('off 4', function (assert) {
  assert.expect(0);

  function show() {
    assert.ok(false, 'expect 0');
  }

  function hide() {
    assert.ok(false, 'expect 0');
  }

  jEvent.on('off-11', show);
  jEvent.on('off-11', hide);
  jEvent.on('off-off', function () {
    assert.ok(false, 'expect 0');
  });

  jEvent.off();
  jEvent.emit('off-11');
  jEvent.emit('off-off');
});



/**
 * 继承
 */

function extend(child, parent) {
  var key;

  for (key in parent) {
    if (parent.hasOwnProperty(key)) {
      child[key] = parent[key];
    }
  }
}

QUnit.test('extend', function (assert) {
  assert.expect(2);

  var obj = {};
  extend(obj, jEvent);

  var obj2 = {};
  extend(obj2, jEvent);

  obj.on('extend', function (param) {
    assert.strictEqual(param, 1, 'extend 1');
  });

  obj2.on('extend', function (param) {
    assert.strictEqual(param, 2, 'extend 2')
  });

  jEvent.off('extend');  // 不影响

  obj.emit('extend', 1);
  obj.off();
  obj2.emit('extend', 2);
});

