const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );

      webpackConfig.resolve.plugins[scopePluginIndex].allowedFiles.add(
        path.resolve("../EventBus.js")
      );
      return webpackConfig;
    },
  },
};
