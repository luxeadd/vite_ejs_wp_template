//webpにフォールバックをつけるときはbuild後にfallbackWebpをtrueにして再度buildする
//フォールバックbuild後はfallbackWebpをfalseに戻しtください、そうしないと開発サーバーにて画像が表示されなくなります。
export const fallbackSettings = {
  fallbackWebp: false,
};