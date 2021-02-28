module.exports = {
  productionSourceMap: false,

  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Ram Control";
      return args;
    });
  },

  configureWebpack: {
    devtool: "source-map"
  },

  publicPath: "",
  assetsDir: "assets"
};
