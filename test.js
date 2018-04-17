var go = require(".");

it("go nothing", function () {
  it(go() instanceof Promise).ok;
});

it("go a generator that returns a value", function () {
  function* main() {
    return "hello value";
  }
  return go(main()).then(function (value) {
    it(value === "hello value").ok;
  });
});

it("go a generator that returnes an array", function () {
  function* main() {
    var array = [];
    array[0] = yield it.delay(10, "Y");
    it(array[0] === "Y").ok;
    array[1] = yield it.delay(10, "E");
    it(array[1] === "E").ok;
    array[2] = yield it.delay(10, "S");
    it(array[2] === "S").ok;
    return array;
  }

  return go(main()).then(function (array) {
    it(array.join("") === "YES").ok;
  });
});

it("go a generator that returns a promise", function () {
  function* main(hello) {
    it(hello === "hello").ok;
    return Promise.resolve(hello).then(function (hello) {
      return hello + " promise";
    });
  }

  return go(main("hello")).then(function (value) {
    it(value === "hello promise").ok;
  })
});

it("go a generator that returns a generator", function () {
  function* main(hello) {
    it(hello === "hello").ok;
    return function* () {
      return hello + " generator";
    }();
  }

  return go(main("hello")).then(function (value) {
    it(value === "hello generator").ok;
  })
});

it("go a generator that throws an error", function () {
  function* main(hello) {
    it(hello === "hello").ok;
    throw Error(hello + " error");
  }

  return go(main("hello")).catch(function (error) {
    it(error.message === "hello error").ok;
  });
});

it("go a method generator that returns its property", function () {
  var obj = {
    hello: "hello",
    world: "world",
    *main() {
      it(this.hello === "hello").ok;
      return this.hello + " " + this.world;
    }
  };

  return go(obj.main()).then(function (value) {
    it(value === "hello world").ok;
  });
});

it("go generator - generator - generator", function () {
  function* main(from) {
    it(from === "go").ok;
    var value = yield first("main");
    return "main-" + value;
  }

  function* first(from) {
    it(from === "main").ok;
    var value = yield last("first");
    return "first-" + value;
  }

  function* last(from) {
    it(from === "first").ok;
    var value = yield it.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    it(value === "main-first-last").ok;
  });
});

it("go generator - async - generator", function () {
  function* main(from) {
    it(from === "go").ok;
    var value = yield first("main");
    return "main-" + value;
  }

  async function first(from) {
    it(from === "main").ok;
    var value = await go(last("first"));
    return "first-" + value;
  }

  function* last(from) {
    it(from === "first").ok;
    var value = yield it.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    it(value === "main-first-last").ok;
  });
});

it("go generator - async - async", function () {
  function* main(from) {
    it(from === "go").ok;
    var value = yield first("main");
    return "main-" + value;
  }

  async function first(from) {
    it(from === "main").ok;
    var value = await last("first");
    return "first-" + value;
  }

  async function last(from) {
    it(from === "first").ok;
    var value = await it.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    it(value === "main-first-last").ok;
  });
});

it("go generator - Promise.all(generators.map(go))", function () {
  function* main(from) {
    it(from === "go").ok;
    var value = Promise.all([first("first"), last("last")].map(go));
    return value;
  }

  function* first(name) {
    it(name === "first").ok;
    var value = yield it.delay(10, "first");
    return value;
  }

  function* last(name) {
    it(name === "last").ok;
    var value = yield it.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    it(value.join("-") === "first-last").ok;
  });
});

it("go generator - Promise.all(yield generators))", function () {
  function* main(from) {
    it(from === "go").ok;
    var value = Promise.all([yield first("first"), yield last("last")]);
    return value;
  }

  function* first(name) {
    it(name === "first").ok;
    var value = yield it.delay(10, "first");
    return value;
  }

  function* last(name) {
    it(name === "last").ok;
    var value = yield it.delay(10, "last");
    return value;
  }

  return go(main("go")).then(function (value) {
    it(value.join("-") === "first-last").ok;
  });
});

it("go.all generators", function(){
  function* main() {
    it("main running").ok;
    return yield go.all([first(), inner(), last()]);
  }

  function* first() {
    it("first running").ok;
    return yield it.delay(10, "first");
  }

  function* inner() {
    it("inner running").ok;
    return yield it.delay(10, "inner");
  }

  function* last(name) {
    it("last running").ok;
    return yield it.delay(10, "last");
  }

  return go(main()).then(function (value) {
    it(value.join() === "first,inner,last").ok;
  });
});

it("go.race generators", function(){
  function* main() {
    it("main running").ok;
    return yield go.race([first(), inner(), last()]);
  }

  function* first() {
    it("first running").ok;
    return yield it.delay(10, "first");
  }

  function* inner() {
    it("inner running").ok;
    return yield it.delay(5, "inner");
  }

  function* last(name) {
    it("last running").ok;
    return yield it.delay(10, "last");
  }

  return go(main()).then(function (value) {
    it(value === "inner").ok;
  });
});