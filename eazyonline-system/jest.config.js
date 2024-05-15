module.exports = {
  setupFiles: ["./jest.setup.js"],
  moduleFileExtensions: ["js", "json", "vue"],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "vue-jest",
  },
  testMatch: ["**/test/unit/**/*.spec.js", "**/test/integration/**/*.spec.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
    "^vue$": "vue/dist/vue.common.js",
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/(?!vue-axios)"],
};
