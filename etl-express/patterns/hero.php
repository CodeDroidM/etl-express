<?php
register_block_pattern(
    'etl-express/hero',
    array(
        'title'       => __( 'ETL Express Hero', 'etl-express' ),
        'description' => _x( 'Cover block with headline and CTA', 'Block pattern description', 'etl-express' ),
        'categories'  => array( 'etl-express' ),
        'content'     => '<!-- wp:cover {"url":"https://picsum.photos/seed/etl/1600/900","dimRatio":60,"minHeight":420,"isDark":false} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-etl-primary-background-color"></span><img class="wp-block-cover__image-background" alt="" src="https://picsum.photos/seed/etl/1600/900" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:heading {"textAlign":"center","level":1,"textColor":"base"} --><h1 class="has-text-align-center has-base-color has-text-color">Turn Raw Data → Reliable Insights</h1><!-- /wp:heading --><!-- wp:paragraph {"align":"center","textColor":"base"} --><p class="has-text-align-center has-base-color has-text-color">Automate your pipelines in minutes – no scripts required.</p><!-- /wp:paragraph --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} --><div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"etl-secondary","textColor":"base"} --><div class="wp-block-button"><a class="wp-block-button__link has-base-color has-etl-secondary-background-color has-text-color has-background">Start Free Trial</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div></div><!-- /wp:cover -->'
    )
);