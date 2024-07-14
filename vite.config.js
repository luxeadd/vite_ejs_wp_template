import { defineConfig } from 'vite';
import { globSync } from 'glob'; //各ファイルの名前を取得し一括で登録
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import viteSassGlobImports from 'vite-plugin-sass-glob-import'; // SCSSのインポートを自動化する ワイルドカード使用
import { ViteEjsPlugin } from 'vite-plugin-ejs'; // ejs使用
import liveReload from 'vite-plugin-live-reload'; //ライブリロード
import VitePluginWebpAndPath from 'vite-plugin-webp-and-path'; //webp画像変換
import viteImagemin from 'vite-plugin-imagemin'; //画像圧縮
// import { SourceMap } from 'node:module';

const useWebp = true; // trueにするとwebp画像変換を行う

/** 各ファイルの名称、path情報を配列に格納する設定 */
const inputJsArray = globSync('./src/**/*.js', {
  ignore: ['src/js/**/_*.js']
}).map((file) => {
  return [
    path.relative(
      'src/js',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ];
});
const inputHtmlArray = globSync(['src/**/*.html'], {
  ignore: ['node_modules/**']
}).map((file) => {
  return [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ];
});
const inputScssArray = globSync('./src/**/*.scss', {
  ignore: ['src/sass/**/_*.scss']
}).map((file) => {
  const fileName = file.slice(
    file.lastIndexOf('/') + 1,
    file.length - path.extname(file).length
  );
  return [
    // path.relative(
    //   "src",
    //   file.slice(0, file.length - path.extname(file).length)
    // ),
    fileName,
    fileURLToPath(new URL(file, import.meta.url))
  ];
});

/** 各ファイル情報の配列をまとめて、Objectに設定 */
const inputObj = Object.fromEntries(
  inputJsArray.concat(inputHtmlArray, inputScssArray)
);

/** Viteの設定 */
export default defineConfig({
  root: './src', //開発ディレクトリ設定
  base: './', //相対パスに設定
  publicDir: '../public', //publicディレクトリ設定

  build: {
    outDir: '../dist', //出力場所の指定
    emptyOutDir: true, //書き出すときにディレクトリを一旦削除
    sourcemap: false, //jsのソースマップの設定
    minify: false, //圧縮を無効化
    rollupOptions: {
      input: inputObj, //Globで該当ファイル名取得してObjectにしたもの
      output: {
        //出力時に名前を動的にせずに取得したファイル名で固定
        entryFileNames: `assets/js/[name].js`, //JSの出力設定
        chunkFileNames: `assets/js/modules/[name].js`, //共通使用のModule　JSのの出力設定
        assetFileNames: (assetInfo) => {
          if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
            return 'assets/images/[name].[ext]'; //画像アセットの出力設定
          }

          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name].[ext]'; //CSSアセットの出力設定
          }

          return 'assets/[name].[ext]'; //その他のファイルの出力設定
        }
      }
    }
  },

  css : { //ソースマップの指定
    devSourcemap: true
  },

  server: {
    port: 3200, // 任意のポート番号を書く
    host: true //IPアドレス使用可能
    // open: '/index.html', //起動時に自動でブラウザで開くページを指定（自動にしない場合はコメントアウト）
  },

  // server: { //Docker環境（仮想環境）の場合以下の設定
  //   port: 3000,//Dockerの設定でPortは3000にしています
  //   host: true,//Dockerなどの仮想から外に出すためには　host:trueとする
  //   strictPort: true,//ポートがすでに使用されている場合に、次に使用可能なポートを自動的に試さない設定にしておきます
  //   watch: {
  //     usePolling: true//Dockerなどの仮想の場合この設定をしておくと吉
  //   }
  // }

  plugins: [
    viteSassGlobImports(), // SCSSのインポートを自動化する（ワイルドカード使用可能）
    liveReload(['parts/*.ejs', 'common/*.ejs', '../public/**/*.php']),//指定したファイルでもライブリロード可能にする
    ViteEjsPlugin(), //ejs使用
    useWebp
      ? //webp画像変換
        VitePluginWebpAndPath({
          targetDir: './dist/',
          imgExtensions: 'jpg,png',
          textExtensions: 'html,css,ejs,js,php',
          quality: 80,
          preserveOriginal: true // 元の画像を残す
        })
      : //画像圧縮
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
  ]
});
