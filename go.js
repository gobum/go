/** -----------------------------------------------------------------------------------------------
 * go.js
 *   An asynchronous driver for generator.
 *   author: leadzen（李战）
 */
var go = function (toString, reIsGenerator) {
  function go(any) {
    return isGenerator(any)
      ? Promise.resolve().then(next)
      : Promise.resolve(any);

    function next(value) {
      return Promise.resolve(any.next(value))
        .then(function (state) {
          value = go(state.value);
          return state.done ? value : value.then(next);
        });
    }
  }

  return Object.defineProperties(go, {
    all: {
      value(iterable) {
        return Promise.all(function* (iterable) {
          for (var value of iterable) {
            yield go(value);
          }
        }(iterable));
      }
    },

    race: {
      value(iterable){
        return Promise.race(function* (iterable) {
          for (var value of iterable) {
            yield go(value);
          }
        }(iterable));
      }
    }
  });

  function isGenerator(any) {
    return reIsGenerator.test(toString.call(any));
  }
}(
  Object.prototype.toString,        // toString
  /\[object (?:Async)?Generator\]/  // reIsGenerator
);
