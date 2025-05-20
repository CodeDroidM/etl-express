<?php
/**
 * Template Name: Dashboard
 * Description: Protected area embedding the React SPA.
 */
auth_redirect(); // Redirects to login if not authenticated
get_header();
?>
<main id="primary" class="site-main container">
  <div id="etl-root">Loading your data pipelines…</div>
</main>
<?php
get_footer();
?>