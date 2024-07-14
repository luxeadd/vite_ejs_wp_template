# vite_ejs_template
- これはejs仕様のvite環境です


# 画像に関して
- build時にjpgやpngをwebpに変換する仕様となります。
- フォールバックをつけたい場合はbuild後にconfig.jsのfallbackWebpをtrueにして再度buildしてください。（フォールバックbuild後はfallbackWebpをfalseに戻してください、そうしないと開発サーバーにて画像が表示されなくなります。）