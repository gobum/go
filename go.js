function go(any) {
  return go.generator.isPrototypeOf(any)
    ? Promise.resolve().then(next)
    : Promise.resolve(any);

  function next(value) {
    var state = any.next(value);
    value = go(state.value);
    return state.done ? value : value.then(next);
  }
}

go.generator = (function*(){}).prototype.__proto__;