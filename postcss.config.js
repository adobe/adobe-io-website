module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-varfallback"),
    require("postcss-dropunusedvars")({ fix: true }),
    require("cssnano"),
    require("postcss-remove-unused-css")({path: "./hlx_statics"}),
  ],
};
