<?php


// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Whether timelines should render with the new design.
 *
 * Old installs keep the legacy design until an admin opts in from the welcome notice.
 *
 * @return bool
 */
function ctlb_is_new_design() {
	if ( 'yes' === get_option( 'ctlb_migrate_new_design' ) ) {
		return true;
	}

	if ( 'yes' === get_option( 'ctlb_keep_legacy_design' ) ) {
		return false;
	}

	$initial_version = trim( (string) get_option( 'ctlb-initial-save-version', '' ) );
	if ( '' === $initial_version ) {
		return false;
	}

	$refresh_version = defined( 'CTLB_DESIGN_REFRESH_VERSION' ) ? CTLB_DESIGN_REFRESH_VERSION : '2.0.0';

	return version_compare( $initial_version, $refresh_version, '>=' );
}

add_filter( 'render_block', 'ctlb_add_new_design_class', 10, 2 );
/**
 * Add the ctlb-new-design class to the timeline wrapper at render time, so saved post content never changes.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block.
 * @return string
 */
function ctlb_add_new_design_class( $block_content, $block ) {
	if ( ! isset( $block['blockName'] ) || 'cp-timeline/content-timeline-block' !== $block['blockName'] ) {
		return $block_content;
	}

	if ( ! ctlb_is_new_design() ) {
		return $block_content;
	}

	// Mirrors the editor's one-time "Reset all" of story padding/margin: until a post has been opened
	// and saved after migrating (coreSpacingReset), drop that inline spacing at render time instead.
	if ( empty( $block['attrs']['coreSpacingReset'] ) ) {
		$block_content = ctlb_strip_legacy_story_spacing( $block_content );
	}

	if ( false !== strpos( $block_content, 'ctlb-new-design' ) ) {
		return $block_content;
	}

	$patched = preg_replace(
		'/(<div\b[^>]*\bclass="[^"]*\bctlb-wrapper\b)/',
		'$1 ctlb-new-design',
		$block_content,
		1
	);

	return ( null === $patched ) ? $block_content : $patched;
}

/**
 * Removes inline padding/margin from the headings and paragraphs of a timeline.
 *
 * Older timelines store spacing on every story's title and description block (style="padding-top:0px;..."),
 * which the new design's own spacing must not be overridden by. Other inline styles (colour, font size, ...)
 * are kept, and a style attribute left empty is dropped.
 *
 * @param string $html Rendered timeline block HTML.
 * @return string
 */
function ctlb_strip_legacy_story_spacing( $html ) {
	$stripped = preg_replace_callback(
		'/<(h[1-6]|p)\b([^>]*?)\sstyle="([^"]*)"([^>]*)>/i',
		function ( $matches ) {
			$kept = array();
			foreach ( explode( ';', $matches[3] ) as $declaration ) {
				$declaration = trim( $declaration );
				if ( '' === $declaration ) {
					continue;
				}
				if ( preg_match( '/^(padding|margin)(-(top|right|bottom|left|block|inline)(-(start|end))?)?\s*:/i', $declaration ) ) {
					continue;
				}
				$kept[] = $declaration;
			}
			$style = $kept ? ' style="' . implode( ';', $kept ) . '"' : '';
			return '<' . $matches[1] . $matches[2] . $style . $matches[4] . '>';
		},
		$html
	);

	return ( null === $stripped ) ? $html : $stripped;
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

function cltb_timeline_block_load_post_assets() {// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
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
							echo '<link href="' . esc_url( $head_font_url ) . '" rel="stylesheet">';
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
							echo '<link href="' . esc_url( $subhead_font_url ) . '" rel="stylesheet">';
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
function cltb_cp_timeline_cgb_block_assets() { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
	$ctlb_block_dir  = Timeline_Block_Dir . 'includes/cool-timeline-block/';
	$ctlb_asset_path = $ctlb_block_dir . 'dist/block.build.asset.php';
	$ctlb_asset      = file_exists( $ctlb_asset_path ) ? include $ctlb_asset_path : array();
	$ctlb_build_ver  = ! empty( $ctlb_asset['version'] ) ? $ctlb_asset['version'] : Timeline_Block_Version;
	$ctlb_common_css = $ctlb_block_dir . 'assets/common-block-editor.css';
	$ctlb_common_ver = file_exists( $ctlb_common_css ) ? (string) filemtime( $ctlb_common_css ) : Timeline_Block_Version;

	// Frontend / shared block CSS — no editor/admin dependencies.
	wp_register_style(
		'cltb_cp_timeline-cgb-style',
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/style-index.css',
		array(),
		$ctlb_build_ver
	);

	wp_register_script(
		'cltb_cp_timeline-cgb-block-js',
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/block.build.js',
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-block-editor' ),
		$ctlb_build_ver,
		true
	);

	wp_localize_script(
		'cltb_cp_timeline-cgb-block-js',
		'cgbGlobal',
		array(
			'isNewDesign' => ctlb_is_new_design(),
		)
	);

	// Sidebar footer: the Pro plugin turns this on through the filter (no upgrade button, solid "View demos").
	wp_localize_script(
		'cltb_cp_timeline-cgb-block-js',
		'ctlBlockData',
		array(
			'isPro' => (bool) apply_filters( 'ctlb_is_pro', false ),
		)
	);

	// Editor-only CSS — loaded via register_block_type() editor_style (not block.json;
	// this block is registered by name, so block.json asset fields are unused at runtime).
	wp_register_style(
		'timeline-block-common-editor-css',
		Timeline_Block_Url . 'includes/cool-timeline-block/assets/common-block-editor.css',
		array( 'wp-edit-blocks' ),
		$ctlb_common_ver
	);

	// Built editor CSS from webpack.
	wp_register_style(
		'cltb_cp_timeline-cgb-block-editor-css',
		Timeline_Block_Url . 'includes/cool-timeline-block/dist/index.css',
		array( 'wp-edit-blocks', 'timeline-block-common-editor-css' ),
		$ctlb_build_ver
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
