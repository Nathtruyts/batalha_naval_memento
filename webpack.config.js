const path = require("path");

module.exports = {
  entry: "./src/index.tsx", // Ponto de entrada principal
  output: {
    path: path.resolve(__dirname, "dist"), // Pasta de saída
    filename: "bundle.js", // Nome do arquivo compilado
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Extensões resolvidas
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Para arquivos TypeScript e React
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"), // Serve o HTML do diretório público
    },
    compress: true, // Ativa compressão gzip
    port: 3000, // Porta do servidor
    historyApiFallback: true, // Garante que o React funcione com rotas
  },
};
