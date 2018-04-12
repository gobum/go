var go = require(".");

beg("go nothing", function () {
  beg(go() instanceof Promise);
});

beg("go a generator that returns a value", function () {
  function* main() {
    return "hello value";
  }
  return go(main()).then(function (value) {
    beg(value === "hello value");
  });
});

beg("go a generator that returnes an array", function () {
  function* main() {
    var array = [];
    array[0] = yield beg.delay(10, "Y");
    beg(array[0] === "Y");
    array[1] = yield beg.delay(10, "E");
    beg(array[1] === "E");
    array[2] = yield beg.delay(10, "S");
    beg(array[2] === "S");
    return array;
  }

  return go(main()).then(function (array) {
    beg(array.join("") === "YES");
  });
});

beg("go a generator that returns a promise", function () {
  function* main(hello) {
    beg(hello === "hello");
    return Promise.resolve(hello).then(function (hello) {
      return hello + " promise";
    });
  }

  return go(main("hello")).then(function (value) {
    beg(value === "hello promise");
  })
});

beg("go a generator that returns a generator", function () {
  function* main(hello) {
    beg(hello === "hello");
    return function* () {
      return hello + " generator";
    }();
  }

  return go(main("hello")).then(function (value) {
    beg(value === "hello generator");
  })
});

beg("go a generator that throws an error", function () {
  function* main(hello) {
    beg(hello === "hello");
    throw Error(hello + " error");
  }

  return go(main("hello")).catch(function (error) {
    beg(error.message === "hello error");
  });
});

beg("go a method generator that returns its property", function () {
  var it = {
    hello: "hello",
    world: "world",
    *main() {
      beg(this.hello === "hello");
      return this.hello + " " + this.world;
    }
  };

  return go(it.main()).then(function (value) {
    beg(value === "hello world");
  });
});

beg("go generator - generator - generator", function () {
  function* main(from) {
    beg(from === "go");
    var value = yield first("main");
    return "main-" + value;
  }

  function* first(from) {
    beg(from === "main");
    var value = yield last("first");
    return "first-" + value;
  }

  function* last(from) {
    beg(from === "first");
    var value = yield beg.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    beg(value === "main-first-last");
  });
});

beg("go generator - async - generator", function () {
  function* main(from) {
    beg(from === "go");
    var value = yield first("main");
    return "main-" + value;
  }

  async function first(from) {
    beg(from === "main");
    var value = await go(last("first"));
    return "first-" + value;
  }

  function* last(from) {
    beg(from === "first");
    var value = yield beg.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    beg(value === "main-first-last");
  });
});

beg("go generator - async - async", function () {
  function* main(from) {
    beg(from === "go");
    var value = yield first("main");
    return "main-" + value;
  }

  async function first(from) {
    beg(from === "main");
    var value = await last("first");
    return "first-" + value;
  }

  async function last(from) {
    beg(from === "first");
    var value = await beg.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    beg(value === "main-first-last");
  });
});

beg("go generator - Promise.all(generators.map(go))", function () {
  function* main(from) {
    beg(from === "go");
    var value = Promise.all([first("first"), last("last")].map(go));
    return value;
  }

  function* first(name) {
    beg(name === "first");
    var value = yield beg.delay(10, "first");
    return value;
  }

  function* last(name) {
    beg(name === "last");
    var value = yield beg.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    beg(value.join("-") === "first-last");
  });
});

beg("go generator - Promise.all(yield generators))", function () {
  function* main(from) {
    beg(from === "go");
    var value = Promise.all([yield first("first"), yield last("last")]);
    return value;
  }

  function* first(name) {
    beg(name === "first");
    var value = yield beg.delay(10, "first");
    return value;
  }

  function* last(name) {
    beg(name === "last");
    var value = yield beg.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    beg(value.join("-") === "first-last");
  });
});

