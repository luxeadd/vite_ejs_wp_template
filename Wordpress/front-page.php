<?php get_header(); ?>

<?php 
$args = [
'pictureImg' => 'common/image1',
'spImg' => 'true',
'spImgName' => '',
'alt' => '',
'file' => '.jpg',
'webp' => 'true',
'pcWidth' => '420',
'pcHeight' => '420',
'spWidth' => '150',
'spHeight' => '150',
'async' => 'true',
'lazy' => 'true',
];
get_template_part('tmp/picture', null, $args);
?>
<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>

<?php get_footer(); ?>