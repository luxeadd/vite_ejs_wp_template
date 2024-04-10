import { defineConfig } from "vite";
import { globSync } from "glob"; //ワイルドカードを使って各ファイルの名前を取得し一括で登録するため
import path from "node:path"; //上記の実行次にnpmのpathを利用
import { fileURLToPath } from "node:url"; //上記の実行時にURLをpathに変更させるため
import { ViteEjsPlugin } from "vite-plugin-ejs";
import liveReload from 'vite-plugin-live-reload'; //ライブリロードのプラグイン
import { SourceMap } from "node:module";
import VitePluginWebpAndPath from 'vite-plugin-webp-and-path'; //webp画像変換
import viteImagemin from 'vite-plugin-imagemin';  //画像圧縮



//JavaScriptファイル名を取得する設定　ignoreでnode_modules内やhtmlディレクトリ内は弾くようにしておく
const inputJsArray = globSync("./src/**/*.js", {
  ignore: ["node_modules/**", "**/modules/**", "**/html/**"],
}).map((file) => {
  return [
    path.relative(
      "src/js",
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url)),
  ];
});

//HTMLファイル名を取得する設定
const inputHtmlArray = globSync(["src/**/*.html"], {
  ignore: ["node_modules/**"],
}).map((file) => {
  return [
    path.relative(
      "src",
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url)),
  ];
});

//SCSSファイルを取得する設定
const inputScssArray = globSync("./src/**/*.scss", {
  ignore: ["src/scss/**/_*.scss"],
}).map((file) => {
  const fileName = file.slice(file.lastIndexOf('/') + 1, file.length - path.extname(file).length);
  return [
    // path.relative(
    //   "src",
    //   file.slice(0, file.length - path.extname(file).length)
    // ),
    fileName,
    fileURLToPath(new URL(file, import.meta.url)),
  ];
});

/**　配列まとめてからObjectにする設定 */
const inputObj = Object.fromEntries(
  inputJsArray.concat(inputHtmlArray, inputScssArray)
);


export default defineConfig({
  root: "./src", //開発ディレクトリ設定
  base: "./", //相対パスにするための./とする

  plugins: [
    liveReload(['parts/*.ejs']),//開発サーバーのライブリロードに任意のファイルを追加する設定
    ViteEjsPlugin(),//ejs設定
    VitePluginWebpAndPath({ //webp画像変換
      targetDir: './dist/assets/images',  // デフォルトは './dist/'
			imgExtensions: 'jpg,png',  // デフォルトは 'jpg,png'
			textExtensions: 'html,css,ejs',  // デフォルトは 'html,css'
			quality: 80,  // デフォルトは 80
    }),
    // viteImagemin({ //画像圧縮
    //   gifsicle: {
    //     optimizationLevel: 7,
    //     interlaced: false,
    //   },
    //   optipng: {
    //     optimizationLevel: 7,
    //   },
    //   mozjpeg: {
    //     quality: 20,
    //   },
    //   pngquant: {
    //     quality: [0.8, 0.9],
    //     speed: 4,
    //   },
    // }),
  ],

  css: {
    sourceMap: true, // CSSのソースマップを有効化
  },

  build: {
    outDir: "../dist", //出力場所の指定
    emptyOutDir: true, //書き出すときにディレクトリを一旦空にする指定（どちらでもお好きな方で）
    sourcemap: false, //ソースマップの設定
    rollupOptions: {
      input: inputObj, //Globで該当ファイル名取得してObjectにしたもの
      output: {
        entryFileNames: `assets/js/[name].js`, //JSの出力設定
        chunkFileNames: `assets/js/modules/[name].js`, //共通使用のModule　JSのの出力設定
        assetFileNames: (assetInfo) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
            return "assets/images/[name].[ext]"; //画像アセットの出力設定
          }

          if (/\.css$/.test(assetInfo.name)) {
            return "assets/css/[name].[ext]"; //CSSアセットの出力設定
          }

          return "assets/[name].[ext]"; //その他のファイルの出力設定
        },
      },
    },
  },

  // server: { //Docker環境（仮想環境）なので以下の設定が必要
  //   port: 3000,//Dockerの設定でPortは3000にしています
  //   host: true,//Dockerなどの仮想から外に出すためには　host:trueとする
  //   strictPort: true,//ポートがすでに使用されている場合に、次に使用可能なポートを自動的に試さない設定にしておきます
  //   watch: {
  //     usePolling: true//Dockerなどの仮想の場合この設定をしておくと吉
  //   }
  // }
  
});
