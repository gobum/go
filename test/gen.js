var go = require("../index.js");
var delay = (t, v) => new Promise(f => setTimeout(f, t, v));

test("co(generator)", async function () {
  function* gen() {
    var values = [];
    for (var i = 0; i < 4; i++) {
      values[i] = yield delay(10, i);
      test("values[" + i + "] === " + i, values[i] === i);
    }
    return values;
  }

  var values = await go(gen());
  test("values.length === 4", values.length === 4);
  test("values.join() === '0,1,2,3'", values.join() === '0,1,2,3');

});