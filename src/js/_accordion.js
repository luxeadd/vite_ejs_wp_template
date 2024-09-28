// ----------------------
// アコーディオン
// ----------------------
// ボタン要素にaria-expandedを設定、展開する要素にaria-hiddenを設定
// css；展開する要素に以下を設定
// grid-template-rows: 0fr;
// transition: 250ms grid-template-rows ease, 250ms padding-block ease;
// &[aria-hidden="false"] {
//   grid-template-rows: 1fr;
// }
// > div {
//   overflow: hidden;
// }
if (document.querySelector('.js-accordion__btn')) {
  document.querySelectorAll('.js-accordion__btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      // var body = this.previousElementSibling;//上の要素を展開
      var body = this.nextElementSibling;//下の要素を展開
      if (body) {
        body.setAttribute('aria-hidden', expanded);
      }
    });
  });
}