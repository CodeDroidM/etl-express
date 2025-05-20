<?php
/**
 * Theme functions for ETL Express child theme
 */

add_action( 'wp_enqueue_scripts', function() {
    // Parent and child styles
    wp_enqueue_style( 'yuki-style', get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'etl-express-style', get_stylesheet_uri(), array( 'yuki-style' ), wp_get_theme()->get( 'Version' ) );
}, 20 );

add_action( 'after_setup_theme', function() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'custom-logo', array(
        'height'      => 80,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
    add_theme_support( 'woocommerce' );
    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'etl-express' ),
        'footer'  => __( 'Footer Menu', 'etl-express' ),
    ) );
} );

/**
 * Conditionally load React dashboard on /dashboard page slug.
 */
add_action( 'wp_enqueue_scripts', function() {
    if ( is_page( 'dashboard' ) ) {
        wp_enqueue_script(
            'etl-dashboard',
            get_stylesheet_directory_uri() . '/assets/dashboard/main.js',
            array( 'wp-element' ),
            null,
            true
        );
    }
} );

/**
 * Register SaaS hero block pattern (auto‑loaded from /patterns folder in WP >= 6.0).
 */
function etl_register_patterns() {
    register_block_pattern_category( 'etl-express', array( 'label' => __( 'ETL Express', 'etl-express' ) ) );
}
add_action( 'init', 'etl_register_patterns' );