module.exports = {
  "presets": [
    ["@babel/env", {"targets": {
      "browsers": [
        "> 0.5%",
        "last 5 versions",
        "ie >= 10"
      ]}
    }]
  ],
  "plugins": [
    "@babel/plugin-proposal-unicode-property-regex",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ],
  "env": {
    "test": {
      "plugins": ["istanbul"]
    }
  },
  "ignore": [/node_modules\/core-js/],
  "comments": false
}
