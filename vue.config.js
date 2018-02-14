let path = require("path");

module.exports = {
  chainWebpack(config) {
    config.resolve.alias.set("@unit", path.resolve(__dirname, "test", "unit"));
  }
}