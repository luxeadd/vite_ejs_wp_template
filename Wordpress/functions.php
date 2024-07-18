<?php

/**
 * Functions
 */

if (!defined('WP_ENV')) {
  define('WP_ENV', 'development'); // 開発環境の場合
  // define('WP_ENV', 'production'); // 本番環境の場合
}

// 初期設定
require_once get_theme_file_path('/include/init.php');

// 各種ファイル読み込み設定
require_once get_theme_file_path('/include/script.php');

// 各種ページリンク設定
require_once get_theme_file_path('/include/link.php');

// 各種path設定
require_once get_theme_file_path('/include/path.php');

// 管理画面設定
require_once get_theme_file_path('/include/admin.php');

// セキュリティ設定
require_once get_theme_file_path('/include/security.php');
