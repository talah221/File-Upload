module.exports = {
  productionSourceMap: false,

  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "BuildApp";
      return args;
    });
  },

  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/scss/variables.scss";
        `,
      },
    },
  },

  configureWebpack: {
    devtool: "source-map",
  },

  publicPath: "/",
  assetsDir: "assets",
};
