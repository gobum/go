module.exports = go['default'] = go;

function go(any) {
  return generatorPrototype.isPrototypeOf(any) ? next() : Promise.resolve(any);

  function next(value) {
    var state = any.next(value);
    value = go(state.value);
    return state.done ? value : value.then(next);
  }
}

var generatorPrototype = (function*(){}).prototype.__proto__;