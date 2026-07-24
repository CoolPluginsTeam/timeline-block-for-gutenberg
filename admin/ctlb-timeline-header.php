<?php
/**
 * Timeline Block — global header on onboarding screen.
 *
 * @package TimelineBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.WP.I18n.TextDomainMismatch

if ( ! function_exists( 'ctlb_is_onboarding_page' ) ) {
	/**
	 * Whether the current admin screen is the Timeline Block onboarding page.
	 *
	 * @return bool
	 */
	function ctlb_is_onboarding_page() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only screen detection.
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';

		return 'ctlb-getting-started' === $page;
	}
}

require_once __DIR__ . '/timeline-global-header.php';

add_action(
	'admin_enqueue_scripts',
	static function () {
		if ( ! ctlb_is_onboarding_page() ) {
			return;
		}

		cp_timeline_header_enqueue_styles( Timeline_Block_Version );
	}
);

add_filter(
	'admin_body_class',
	static function ( $classes ) {
		if ( ctlb_is_onboarding_page() ) {
			$classes .= ' cph-timeline-addon-page';
		}

		return $classes;
	}
);

add_action(
	'in_admin_header',
	static function () {
		if ( ! ctlb_is_onboarding_page() ) {
			return;
		}

		$utm_params = '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=docs&utm_content=global-header';

		cp_timeline_header_render(
			array(
				'heading'       => __( 'Timeline Addons', 'timeline-block' ),
				'icon_url'      => Timeline_Block_Url . 'assets/images/timeline-icon.svg',
				'docs_url'      => 'https://cooltimeline.com/docs/timeline-block-pro/' . $utm_params,
				'support_url'   => 'https://coolplugins.net/support/' . $utm_params,
				'docs_label'    => __( 'Check Docs', 'timeline-block' ),
				'support_label' => __( 'Get Support', 'timeline-block' ),
				'text_domain'   => 'timeline-block',
			)
		);
	}
);
