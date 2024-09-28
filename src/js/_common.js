// ----------------------
// ページトップ表示切り替え
// ----------------------
let jsPageTopBtn = document.querySelector('.js-page-top');
if (jsPageTopBtn) {
  function getScrolled() {
    return window.pageYOffset !== undefined ? window.pageYOffset : document.documentElement.scrollTop;
  }
  window.onscroll = function () {
    getScrolled() > 1000 ? jsPageTopBtn.classList.add('is-active') : jsPageTopBtn.classList.remove('is-active');
  };
}