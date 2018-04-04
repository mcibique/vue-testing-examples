module.exports = {
  root: true,
  env: {
    mocha: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/standard"
  ],
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "no-unused-expressions": "off"
  }
}
