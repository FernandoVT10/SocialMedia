module.exports = {
    entry: "./src/index.jsx",
    output: {
        path: __dirname + "/public/js",
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    }
};