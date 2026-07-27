<?php


// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'enqueue_block_editor_assets', 'cltb_editor_side_css' );
function cltb_editor_side_css() {
		// Common Editor style.
		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		wp_enqueue_style(
			'timeline-block-block-common-editor-css', // Handle.
			plugin_dir_url( __FILE__ ) . '../assets/common-block-editor.css', // Block editor CSS.
			array( 'wp-edit-blocks' ),// Dependency to include the CSS after it.
			Timeline_Block_Version 
		);
}

function cltb_timeline_block_load_post_assets() {
	global $post;
	$this_post = $post;

	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	$this_post = apply_filters( 'timeline-block_post_for_stylesheet', $this_post );
	if ( ! is_object( $this_post ) ) {
		return;
	}

	if ( ! isset( $this_post->ID ) ) {
		return;
	}

	if ( has_blocks( $this_post->ID ) && isset( $this_post->post_content ) ) {

		$page_blocks      = parse_blocks( $this_post->post_content );

		if ( ! is_array( $page_blocks ) || empty( $page_blocks ) ) {
			return;
		}

		$default_Fonts = array( '', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia' );
		foreach ( $page_blocks as $i => $block ) {


			if ( is_array( $block ) ) {

				if ( '' === $block['blockName'] ) {
					continue;
				}
				
				if ( isset( $block['attrs']['headFontFamily'] ) ) {
					if ( ! in_array( $block['attrs']['headFontFamily'], $default_Fonts,true ) ) {
						$headFont = array();
						array_push( $headFont, $block['attrs']['headFontFamily'] );
						if ( isset( $block['attrs']['headFontWeight'] ) ) {
							array_push( $headFont, $block['attrs']['headFontWeight'] );
						}
						if ( isset( $block['attrs']['headFontSubset'] ) ) {
							array_push( $headFont, $block['attrs']['headFontSubset'] );
						}

						$head_font_url = ctlb_timeline_get_font_url( $headFont );

						if ( ! in_array( $head_font_url, $loaded_font_urls, true ) ) {
							$loaded_font_urls[] = $head_font_url;
							// phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet
							echo '<link href="' . esc_url( $head_font_url ) . '" rel="stylesheet">';
						}
					}
				}
				if ( isset( $block['attrs']['subHeadFontFamily'] ) ) {
					if ( ! in_array( $block['attrs']['subHeadFontFamily'], $default_Fonts,true ) ) {
						$subheadFont = array();
						array_push( $subheadFont, $block['attrs']['subHeadFontFamily'] );
						if ( isset( $block['attrs']['subHeadFontWeight'] ) ) {
							array_push( $subheadFont, $block['attrs']['subHeadFontWeight'] );
						}
						if ( isset( $block['attrs']['subHeadFontSubset'] ) ) {
							array_push( $subheadFont, $block['attrs']['subHeadFontSubset'] );
						}

						$subhead_font_url = ctlb_timeline_get_font_url( $subheadFont );

						if ( ! in_array( $subhead_font_url, $loaded_font_urls, true ) ) {
							$loaded_font_urls[] = $subhead_font_url;
							// phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet
							echo '<link href="' . esc_url( $subhead_font_url ) . '" rel="stylesheet">';
						}
					}
				}
				if ( isset( $block['attrs']['dateFontFamily'] ) ) {
					if ( ! in_array( $block['attrs']['dateFontFamily'], $default_Fonts,true ) ) {
						$dateFont = array();
						array_push( $dateFont, $block['attrs']['dateFontFamily'] );
						if ( isset( $block['attrs']['dateFontWeight'] ) ) {
							array_push( $dateFont, $block['attrs']['dateFontWeight'] );
						}
						if ( isset( $block['attrs']['dateFontSubset'] ) ) {
							array_push( $dateFont, $block['attrs']['dateFontSubset'] );
						}

						$date_font_url = ctlb_timeline_get_font_url( $dateFont );

						if ( ! in_array( $date_font_url, $loaded_font_urls, true ) ) {
							$loaded_font_urls[] = $date_font_url;
							// phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet
							echo '<link href="' . esc_url( $date_font_url ) . '" rel="stylesheet">';
						}
					}
				}
			}
		}
	}

}

function ctlb_timeline_get_font_url( $font_set ) {
	$font_url = add_query_arg(
		array(
			'family' => rawurlencode( implode( ':', $font_set ) ),
		),
		'https://fonts.googleapis.com/css'
	);
	return $font_url;
}

/**
 * Register block scripts/styles. WordPress loads:
 * - style         → frontend + editor (public block CSS only)
 * - editor_style  → editor only (never frontend)
 * - editor_script → editor only
 */
function cltb_cp_timeline_cgb_block_assets() {
	// Frontend / shared block CSS — no editor/admin dependencies.
	wp_register_style(
		'cltb_cp_timeline-cgb-style',
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/style-index.css',
		is_admin() ? array( 'wp-block-editor' ) : null,
		Timeline_Block_Version // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	);

	wp_register_script(
		'cltb_cp_timeline-cgb-block-js',
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/block.build.js',
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-block-editor' ),
		Timeline_Block_Version, // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		true
	);

	// Editor-only CSS — loaded via register_block_type() editor_style (not block.json;
	// this block is registered by name, so block.json asset fields are unused at runtime).
	wp_register_style(
		'timeline-block-common-editor-css',
		Timeline_Block_Url . 'includes/cool-timeline-block/assets/common-block-editor.css',
		array( 'wp-edit-blocks' ),
		Timeline_Block_Version // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	);

	// Built editor CSS from webpack.
	wp_register_style(
		'cltb_cp_timeline-cgb-block-editor-css',
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/index.css',
		array( 'wp-edit-blocks', 'timeline-block-common-editor-css' ),
		null // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	);

	if ( function_exists( 'register_block_type' ) ) {

		register_block_type(
			'cp-timeline/content-timeline-block',
			array(
				'api_version'   => 3,
				'style'         => 'cltb_cp_timeline-cgb-style',
				'editor_script' => 'cltb_cp_timeline-cgb-block-js',
				// Single handle: common-block-editor.css is pulled in via style dependencies.
				'editor_style'  => 'cltb_cp_timeline-cgb-block-editor-css',
			)
		);
		register_block_type(
			'cp-timeline/content-timeline-block-child',
			array(
				'api_version' => 3,
			)
		);
	}
}

// Hook: Block assets.
add_action( 'init', 'cltb_cp_timeline_cgb_block_assets' );
