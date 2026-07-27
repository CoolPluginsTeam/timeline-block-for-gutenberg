<?php
/**
 * Shared Timeline Addons admin header template.
 *
 * Copy this file identically into each Cool Timeline addon plugin.
 * Each addon loads it with require_once and calls render/enqueue only on its own screens.
 *
 * @package CoolPlugins\TimelineHeader
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound, WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound

if ( ! function_exists( 'cp_timeline_header_get_css' ) ) {
	/**
	 * Return inline CSS for the global header.
	 *
	 * @return string
	 */
	function cp_timeline_header_get_css() {
		return '
.cph-top-header {
	--cph-primary: #2e9e9d;
    --cph-primary-dark: #257f7e;
    --cph-border: #e2e8f0;

	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	width: calc(100% + 20px);
	left:-20px;
	margin: 0 0 16px;
	padding: 0 20px 0 2px;
	background-color: #ffffff;
	border-bottom: 1px solid #ddd;
	height: 62px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
	z-index: 99;
}

.cph-header-left .cph-header-img-box {
	width: 35px;
	height: 35px;
}

.cph-header-left .cph-header-img-box img {
	width: 100%;
	height: 100%;
}

.cph-top-header .cph-header-left {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-left: 20px;
}

.cph-header-left h1 {
	font-size: 19px;
	font-weight: 700;
	margin: 0;
	line-height: 1.2;
}

.cph-top-header .cph-header-right {
	display: flex;
	gap: 12px;
	margin-right: 0;
	flex-shrink: 0;
}
.cph-header-right a .dashicons-editor-help {
	font-size: 28px!important;
	width: 28px!important;
	height: 28px!important;
	left: 0!important;
	top: 0!important;
	color: var(--cpo-primary)!important;
}
.cph-top-header .cph-header-right svg {
	width: 17px;
	height: 18px;
}

.cph-top-header .cph-header-right a:focus {
	box-shadow: none !important;
}


/* --- Buttons (scoped WordPress .button restyle) --- */

.cph-top-header a.cph-btn ,
.cph-top-header button.cph-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 8px 12px;
	border: 1px solid;
	border-radius: 6px;
	cursor: pointer;
	font-size: 14px;
	line-height: 1.35;
	font-weight: 600;
	text-align: center;
	text-decoration: none;
	white-space: nowrap;
	box-shadow: none;
	transition:
		background-color 0.15s ease,
		border-color 0.15s ease,
		color 0.15s ease,
		box-shadow 0.15s ease,
		transform 0.05s ease;
}

.cph-top-header a.cph-btn:focus,
.cph-top-header a.cph-btn:visited,
.cph-top-header button.cph-btn:focus,
.cph-top-header button.cph-btn:visited {
	box-shadow: none !important;
}

.cph-top-header a.cph-btn:hover,
.cph-top-header button.cph-btn:hover {
	box-shadow: none !important;

	background: #069392;
	color: #fff !important;
}

.cph-top-header a.cph-btn:active,
.cph-top-header button.cph-btn:active {
	box-shadow: none !important;
	
	background: #069392;
	color: #fff !important;
}

.cph-top-header a.cph-btn-outline,
.cph-top-header button.cph-btn-outline {
	    background: #fff;
    border-color: var(--cph-primary);
    color: var(--cph-primary);
}

.cph-top-header a.cph-btn-primary,
.cph-top-header button.cph-btn-primary {
	background: #15AAA9;
	border: none;
	color: #fff !important;
	box-shadow: 0 1px 2px rgba(0, 124, 122, 0.22);
}

.cph-top-header a.cph-btn-primary:focus,
.cph-top-header a.cph-btn-primary:visited,
.cph-top-header button.cph-btn-primary:focus,
.cph-top-header button.cph-btn-primary:visited {
	box-shadow: none !important;
}

.cph-top-header a.cph-btn-primary:hover,
.cph-top-header button.cph-btn-primary:hover {
	box-shadow: none !important;
	border: none;
	background: #069392;
	color: #fff !important;
}




.cph-header-notices {
	margin: 0 20px 16px 2px;
}

.cph-header-notices:empty {
	display: none;
	margin: 0;
}

.cph-header-notices .notice,
.cph-header-notices [class*="_admin_notice"] {
	margin-top: 0;
	margin-bottom: 10px;
}

body.cph-timeline-addon-page .wrap {
	margin-top: 0;
}

body.cph-timeline-addon-page .wrap.cpo-onboarding-page {
	margin-top: 0;
	max-width: 100%;
}

body.cph-timeline-addon-page.post-type-cool_timeline.edit-php .wrap > h1.wp-heading-inline {
	display: none;
}

body.cph-timeline-addon-page.post-type-cool_timeline.post-new-php .wrap > h1,
body.cph-timeline-addon-page.post-type-cool_timeline.post-php .wrap > h1 {
	display: none;
}

body.cph-timeline-addon-page.cool-plugins-timeline-addon_page_cool_timeline_settings .csf-header {
	display: none;
}

@media screen and (max-width: 782px) {
	.cph-top-header {
		padding: 0 10px;
		height: auto;
		min-height: 62px;
	}

	.cph-header-left h1 {
		font-size: 15px;
	}

	.cph-btn {
		padding: 6px 12px;
		font-size: 12px;
	}

	.cph-header-notices {
		margin-left: 10px;
		margin-right: 10px;
	}
}

@media screen and (max-width: 480px) {
	.cph-top-header {
		flex-direction: column;
		height: auto;
		padding: 15px 10px;
		gap: 12px;
		text-align: center;
	}

	.cph-top-header .cph-header-left,
	.cph-top-header .cph-header-right {
		width: 100%;
		justify-content: center;
	}
}';
	}
}

if ( ! function_exists( 'cp_timeline_header_enqueue_styles' ) ) {
	/**
	 * Enqueue inline header styles (call only on screens where the header renders).
	 *
	 * @param string $version Asset version string.
	 * @return void
	 */
	function cp_timeline_header_enqueue_styles( $version = '1.0.0' ) {
		$handle = 'cp-timeline-global-header';

		wp_register_style( $handle, false, array(), $version );
		wp_enqueue_style( $handle );
		wp_add_inline_style( $handle, cp_timeline_header_get_css() );
	}
}

if ( ! function_exists( 'cp_timeline_header_render' ) ) {
	/**
	 * Render the global Timeline Addons admin header.
	 *
	 * @param array $args {
	 *     Header configuration.
	 *
	 *     @type string $heading        Header title.
	 *     @type string $icon_url       Logo image URL.
	 *     @type string $docs_url       Documentation button URL.
	 *     @type string $support_url    Support button URL.
	 *     @type string $docs_label     Documentation button label.
	 *     @type string $support_label  Support button label.
	 *     @type string $text_domain    Text domain for fallbacks.
	 *     @type string $prefix         CSS class prefix. Default cph.
	 * }
	 * @return void
	 */
	function cp_timeline_header_render( array $args ) {
		$defaults = array(
			'heading'       => '',
			'icon_url'      => '',
			'docs_url'      => '',
			'support_url'   => '',
			'docs_label'    => '',
			'support_label' => '',
			'text_domain'   => 'default',
			'prefix'        => 'cph',
		);

		$args   = wp_parse_args( $args, $defaults );
		$prefix = sanitize_key( $args['prefix'] );

		// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain
		if ( '' === $args['docs_label'] ) {
			$args['docs_label'] = __( 'Check Docs', $args['text_domain'] );
		}
		if ( '' === $args['support_label'] ) {
			$args['support_label'] = __( 'Get Support', $args['text_domain'] );
		}

		$icon_alt = '' !== $args['heading'] ? $args['heading'] : __( 'Timeline Addons', $args['text_domain'] );
		// phpcs:enable WordPress.WP.I18n.NonSingularStringLiteralDomain
		?>
		<header class="<?php echo esc_attr( $prefix ); ?>-top-header">
			<div class="<?php echo esc_attr( $prefix ); ?>-header-left">
				<?php if ( ! empty( $args['icon_url'] ) ) : ?>
				<div class="<?php echo esc_attr( $prefix ); ?>-header-img-box">
					<img src="<?php echo esc_url( $args['icon_url'] ); ?>" alt="<?php echo esc_attr( $icon_alt ); ?>">
				</div>
				<?php endif; ?>
				<h1><?php echo esc_html( $args['heading'] ); ?></h1>
			</div>
			<div class="<?php echo esc_attr( $prefix ); ?>-header-right">
				<?php if ( ! empty( $args['support_url'] ) ) : ?>
				<a href="<?php echo esc_url( $args['support_url'] ); ?>" target="_blank" rel="noopener noreferrer" class="<?php echo esc_attr( $prefix ); ?>-btn <?php echo esc_attr( $prefix ); ?>-btn-outline">
				<span class="dashicons dashicons-editor-help"></span>
					<?php echo esc_html( $args['support_label'] ); ?>
				</a>
				<?php endif; ?>
				<?php if ( ! empty( $args['docs_url'] ) ) : ?>
				<a href="<?php echo esc_url( $args['docs_url'] ); ?>" target="_blank" rel="noopener noreferrer" class="<?php echo esc_attr( $prefix ); ?>-btn <?php echo esc_attr( $prefix ); ?>-btn-primary">
				<span class="dashicons dashicons-book"></span>
					<?php echo esc_html( $args['docs_label'] ); ?>
				</a>
				<?php endif; ?>
			</div>
		</header>

		<div class="cph-header-notices">
		<?php
		/**
		 * Fires immediately after the Timeline Addons global header.
		 *
		 * Used by admin notices to render below the header on plugin screens.
		 */
		do_action( 'cph_after_timeline_header' );
		?>
		</div>
		<?php
	}
}
