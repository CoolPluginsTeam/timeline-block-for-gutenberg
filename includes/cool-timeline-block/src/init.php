<?php


// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// add_action( 'enqueue_block_assets', 'cltb_timeline_block_editor_assets' );
// function cltb_timeline_block_editor_assets() {

// 	$id = get_the_ID();

// 	if ( has_block( 'cp-timeline/content-timeline-block', $id ) ) {
// 		wp_enqueue_style( 'cltb_cp_timeline-cgb-style' );
// 	} else {
// 		// if ( ! is_admin() ) {
// 			// wp_dequeue_style( 'cltb_cp_timeline-cgb-style' );
// 		// }
// 	}
// }



add_action( 'enqueue_block_assets', 'cltb_editor_side_css' );
function cltb_editor_side_css() {
		// Common Editor style.
		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		wp_enqueue_style(
		   'timeline-block-common-editor-css', // Handle.
			plugin_dir_url( __FILE__ ) . '../assets/common-block-editor.css', // Block editor CSS.
			array( 'wp-edit-blocks' )// Dependency to include the CSS after it.
		);
}

add_action( 'wp_head', 'cltb_timeline_block_load_post_assets' );
function ctlb_get_all_blocks( $blocks ) {
	$all_blocks = array();

	foreach ( $blocks as $block ) {

		$all_blocks[] = $block;

		if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
			$all_blocks = array_merge(
				$all_blocks,
				ctlb_get_all_blocks( $block['innerBlocks'] )
			);
		}

		// Resolve reusable blocks and synced patterns (core/block with ref).
		if ( isset( $block['blockName'] ) && 'core/block' === $block['blockName'] && ! empty( $block['attrs']['ref'] ) ) {
			$reusable_id = absint( $block['attrs']['ref'] );
			if ( $reusable_id && 'wp_block' === get_post_type( $reusable_id ) ) {
				$reusable_post = get_post( $reusable_id );
				if ( $reusable_post && ! empty( $reusable_post->post_content ) ) {
					$reusable_blocks = parse_blocks( $reusable_post->post_content );
					$all_blocks      = array_merge(
						$all_blocks,
						ctlb_get_all_blocks( $reusable_blocks )
					);
				}
			}
		}
	}

	return $all_blocks;
}

function cltb_timeline_block_load_post_assets() {
	global $post;
	$this_post = $post;
	if ( ! is_object( $this_post ) ) {
		return;
	}
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	$this_post = apply_filters( 'timeline-block_post_for_stylesheet', $this_post );
	if ( ! is_object( $this_post ) ) {
		return;
	}

	if ( ! isset( $this_post->ID ) ) {
		return;
	}

	if ( has_blocks( $this_post->ID ) && isset( $this_post->post_content ) ) {

		$blocks      = parse_blocks( $this_post->post_content );
		$page_blocks = ctlb_get_all_blocks( $blocks );

		if ( ! is_array( $page_blocks ) || empty( $page_blocks ) ) {
			return;
		}
		$loaded_font_urls = array();
		foreach ( $page_blocks as $i => $block ) {
			

			if ( is_array( $block ) ) {

				if ( '' === $block['blockName'] ) {
					continue;
				}
				$default_Fonts = array( '', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia' );
				if ( isset( $block['attrs']['headFontFamily'] ) ) {
					if ( ! in_array( $block['attrs']['headFontFamily'], $default_Fonts ) ) {
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
							echo '<link href="'.esc_url($head_font_url).'" rel="stylesheet">';
						}
					}
				}
				if ( isset( $block['attrs']['subHeadFontFamily'] ) ) {
					if ( ! in_array( $block['attrs']['subHeadFontFamily'], $default_Fonts ) ) {
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
							echo '<link href="'.esc_url($subhead_font_url).'" rel="stylesheet">';
						}
					}
				}
				if ( isset( $block['attrs']['dateFontFamily'] ) ) {
					if ( ! in_array( $block['attrs']['dateFontFamily'], $default_Fonts ) ) {
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
							echo '<link href="'.esc_url($date_font_url).'" rel="stylesheet">';
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

function cltb_cp_timeline_cgb_block_assets() {
	wp_register_style(
		'cltb_cp_timeline-cgb-style', // Handle.
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/style-index.css',
		is_admin() ? array( 'wp-editor' ) : null,
		null // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	);

	wp_register_script(
		'cltb_cp_timeline-cgb-block-js', // Handle.
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/block.build.js',
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
		null, // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		true
	);

	wp_register_style(
		'cltb_cp_timeline-cgb-block-editor-css', // Handle.
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/index.css',
		array( 'wp-edit-blocks' ),
		null // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	);

	if ( function_exists( 'register_block_type' ) ) {

		register_block_type(
			'cp-timeline/content-timeline-block',
			array(
				'api_version'   => 2,
				// Enqueue blocks.style.build.css on both frontend & backend.
				'style'         => 'cltb_cp_timeline-cgb-style',
				// Enqueue blocks.build.js in the editor only.
				'editor_script' => 'cltb_cp_timeline-cgb-block-js',
				// Enqueue blocks.editor.build.css in the editor only.
				'editor_style'  => 'cltb_cp_timeline-cgb-block-editor-css',
			)
		);
		register_block_type(
			'cp-timeline/content-timeline-block-child',
			array(
				'api_version' => 2,
			)
		);
	}
}

// Hook: Block assets.
add_action( 'init', 'cltb_cp_timeline_cgb_block_assets' );
