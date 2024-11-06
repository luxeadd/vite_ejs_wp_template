<?php
// カスタムタクソノミー設定
add_action('init', function () {
  register_post_type('qa', [
    'label' => 'よくある質問',  //管理画面表示名
    'public' => true,
    'supports' => ['thumbnail', 'title', 'editor', 'excerpt', 'page-attributes'],  //表示する内容
    'has_archive' => false,  //アーカイブページの作成
    'hierarchical' => false,  //階層構造（親子関係）の設定ができる　supportsにpage-attributesが必要
    'show_in_rest' => true, //ブロックエディターに対応
  ]);
  register_taxonomy('qa_category', 'qa', [
    'label' => 'ジャンル',  //管理画面表示名
    'hierarchical' => true,  //階層構造（親子関係）の設定ができる 管理画面でチェックボックス形式で出せる
    'show_in_rest' => true, //ブロックエディターに対応
  ]);
});

// 投稿一覧にタクソノミーを表示
add_filter('manage_qa_posts_columns', function ($columns) {
  $columns['qa_category'] = 'ジャンル';
  return $columns;
});

add_action('manage_qa_posts_custom_column', function ($column, $post_id) {
  if ($column == 'qa_category') {
      $terms = get_the_terms($post_id, 'qa_category');
      if (!empty($terms)) {
          $out = [];
          foreach ($terms as $term) {
              $out[] = $term->name;
          }
          echo join(', ', $out);
      } else {
          echo 'なし';
      }
  }
}, 10, 2);