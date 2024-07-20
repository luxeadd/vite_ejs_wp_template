## ファイルの特徴
- EJS兼WordPress用vite環境ファイル
- EJSの場合はsrc内の情報は静的ページ（dist）に反映される
- WordPressの場合はscss.jsはsrc内で記載、phpはテーマフォルダ内で記載
- WordPressはdockerを使用する前提で調整しています。docker以外の場合はフォルダ構成を変更する必要があり
- GitHubActions自動デプロイ、docker・wp-cli対応

## ファイル構成   
∟ dist ・・・本番用  
　∟ assets  
　　∟ css  
　　∟ images  
　　∟ js  
　∟ index.html

∟ src ・・・開発用  
　∟ index.html  
　∟ common ・・・EJS共通ファイル  
　∟ parts ・・・EJSパーツファイル  
　∟ images  
　∟ js  
　∟ sass  
　　∟ base ・・・リセット系    
　　∟ utility ・・・共通SCSS  
　　∟ object ・・・FLOCSS対応  
　　∟ styles.scss ・・・インクルード用SCSS  
∟ WordPress ・・・WordPressテンプレートファイル   
∟ public ・・・viteで加工不要のファイル（画像など）  
∟ buildScript ・・・コマンド実行用ファイル  
∟ dev.config.json ・・・開発用設定ファイル  
∟ vite.config.js ・・・vite設定ファイル  
∟ postcss.config.cjs ・・・postcss設定ファイル  
∟ docker-compose ・・・docker・WordPress設定用  
∟ dockerfile ・・・docker・wp-cliインストール用  
∟ wp-install.sh ・・・wp-cliコマンド実行用  
∟ package.json ・・・npmパッケージ管理用  
∟ .github ・・・GitHub Actions用ymlファイル  

## このコーディングファイルの使い方
まず、以下に書いてある内容を必ずお読みください
この中身で分かることは以下のとおりです

- 使用環境
- 使い方および操作方法
- 画像出力について 

## 使用環境
- Node.js バージョン14系以上
- npm バージョン8以上
- バージョン確認方法：※ターミナル上でコマンドを入力すること
  - `node -v`
  - `npm -v`
- コマンドを入力後、数字がでてくれば大丈夫です
## 使い方および操作方法  
### 前提  
- dev.config.jsonで各種設定を行います
```
{
  "wordpress": true, 
  WordPressテーマファイルを使用するかどうか

  "WordPressPort": 9092,
  WordPressテーマファイルを使用する場合はポート番号を指定

  "WordPressThemeName": "test", 
  WordPressテーマファイルを使用する場合はテーマ名を指定

  "fallbackImage": false 
  画像フォールバックを使用するかどうか。falseがデフォルト。基本はコマンド操作するので直接変更はしない
}
```  
- ビルドした際はjpgやpngをwebpに変換する仕様となります。
### EJSの場合
1. dev.config.jsonで`"wordpress": false,`に設定
2. ターミナルを開く
3. `npm i`をターミナルへ入力
4. ダウンロードが始まります
5. `npm run dev`でタスクランナーが起動します
- `npm run build`でファイルを書き出す  

以下仕様に合わせて使い分けてください
- `npm run build-format`でファイルを書き出しHTMLの整形とcssにパラメーターを付与
- `npm run build-fallback`でファイルを書き出し、再度webpに変換せずに画像を書き出します。フォールバックをつけたい場合はこちらを使用
- `npm run build-fallback-format`で上記全てを実行  

### WordPressの場合（docker使用）
1. docker-compose.yml：更新箇所を変更 ※コンテナNo、ポートNo、Volume
2. wp-install.sh：WordPressローカルポートをdocker-compose.yml記載のポートに合わせる
3. wp-install.sh：ログイン情報更新
4. dev.config.jsonで`"wordpress": true,`に設定し、`WordPressPort`と`WordPressThemeName`を指定  
5. ターミナルを開く
6. docker起動 
```
docker-compose up -d
```

7. インストールしたWordPressに入る 
```
docker exec -it wordpressName /bin/bash
```  
※wordpressNameの部分はdocker-compose.yml記載のWordPressコンテナ名を入力

8. /tmp/wp-install.shのコマンドを許可
```
chmod +x /tmp/wp-install.sh
```

9. wp-install.sh記載のコマンドを実行してWordPressをインストール
```
/tmp/wp-install.sh
```
10. `npm i`をターミナルへ入力
11. ダウンロードが始まります
12. WordPress反映用フォルダ`my-themes`が作成されるので`Wordpress`フォルダを`my-themes`内に移動しフォルダ名とstyle.css内記述をテーマ名に変更  
```
mv WordPress my-themes/任意の名前
```
13. `npm run dev`でタスクランナーが起動します
- `npm run build`でファイルを書き出す  

以下仕様に合わせて使い分けてください
- `npm run build-fallback`でファイルを書き出し、再度webpに変換せずに画像を書き出します。フォールバックをつけたい場合はこちらを使用  

#### 注意点 
- `functions/script.php`の`define('WORDPRESS_DEV', true);`をtrueで開発サーバー、falseで本番環境のcss、jsを読み込むようにしているのでデプロイ時には必ずfalseにしたフォイルをアップしてください。

## 画像出力について

- 画像効率化の観点よりテンプレートを組んでいますので、以下の様式を使用してください。 （レスポンシブ、webp 対応）

EJS

```
<%- include(baseMeta.path +'common/_picture', 
  { 
    baseMeta:baseMeta, 
    img:'common/image1', 
    spImg:'true', 
    spImgName:'_sp', 
    file:'.jpg',  
    alt:'ダミー画像', 
    webp:'true',
    pcWidth : '800',
    pcHeight : '800',
    spWidth : '300',
    spHeight : '300',
    async:'true', 
    lazy:'true', 
  }
) %>
```

WordPress

```
<?php
    $args = [
      'pictureImg' => 'common/image',
      'spImg' => 'true',
      'spImgName' => '',
      'alt' => '',
      'file' => '.jpg',
      'webp' => 'true',
      'pcWidth' => '850',
      'pcHeight' => '567',
      'spWidth' => '390',
      'spHeight' => '260',
      'async' => 'true',
      'lazy' => 'true',
    ];
    get_template_part('tmp/picture', null, $args);
?>
```
