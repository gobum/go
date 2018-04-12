(function(promise){
  var log = console.log;
  var files = process.argv.slice(2);

  if(files.length) {
    var path = require("path");
    global.test = function(topic, value) {
      if(typeof value === "function") {
        promise = promise.then(function(){
          log(topic);
          return Promise.resolve(value());
        });
      }
      else if (value) {
        log("  \x1b[32m✔ %s\x1b[0m", topic);
      } else {
        log("  \x1b[31m✘ %s\x1b[0m", topic);
      }
    };
    
    files.map(function(file){
      file = path.resolve(file);
      file = path.relative(__dirname, file);
      if(/^[^./]/.test(file)) {
        file = "./" + file;
      }
      require(file);
    });

    promise.catch(function(error) {
      log("  \x1b[31m⦸ %s\x1b[0m", error.message);
    });
  }
})(Promise.resolve());