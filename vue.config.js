const path = require("path")

module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.(css|scss)$/,
                    loader: "webpack-px-to-rem",
                    query: {
                        basePx: 14,
                        min: 1,
                        floatWidth:3
                    }
                },
                {
                    test: /\.scss$/,
                    use: {
                        loader: "sass-resources-loader",
                        options:{
                            sourceMap: true,
                            resources: [
                                path.join(__dirname,"./src/static/scss/common.scss")
                            ]
                        }
                    }
                }
            ]
        },
        devServer: {
            proxy:'http://127.0.0.1:7002'
        }
    }
}