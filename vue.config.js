let path = require("path");
let useServiceStub = !!process.env.npm_config_stub;

module.exports = {
  chainWebpack(config) {
    config.resolve.alias.set("@unit", path.resolve(__dirname, "test", "unit"));

    if (useServiceStub) {
      config.resolve.extensions.prepend(".stub.js");
    }
  }
}