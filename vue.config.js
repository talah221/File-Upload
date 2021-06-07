module.exports = {
  productionSourceMap: false,

  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Ram Control";
      return args;
    });
  },

  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/scss/variables.scss";
        `
      }
    }
  },

  configureWebpack: {
    devtool: "source-map"
  },

  publicPath: "/qcApp/",
  assetsDir: "assets"
};
