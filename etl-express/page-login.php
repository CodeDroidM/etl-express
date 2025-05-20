<?php
/**
 * Template Name: Account Login
 * Description: Front‑end login page for ETL Express SaaS.
 */
get_header();
?>
<main id="primary" class="site-main container">
  <?php
  if ( is_user_logged_in() ) {
      wp_redirect( home_url( '/dashboard' ) );
      exit;
  }
  echo do_shortcode( '[wp_login_form redirect="' . esc_url( home_url( '/dashboard' ) ) . '"]' );
  ?>
</main>
<?php
get_footer();
?>