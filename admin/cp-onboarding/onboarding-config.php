<?php
/**
 * Timeline Block onboarding wiring.
 *
 * @package TimelineBlock
 */

use CoolPlugins\Onboarding\Config;
use CoolPlugins\Onboarding\Framework;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.TextDomainMismatch, WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound

/**
 * Builds the onboarding Config array for Timeline Block.
 */
final class CTLB_Onboarding_Config {

	/**
	 * Plugin text domain.
	 *
	 * @var string
	 */
	private const TEXT_DOMAIN = 'timeline-block';

	/**
	 * Timeline Block Pro plugin folder slug.
	 *
	 * @var string
	 */
	const PRO_SLUG = 'timeline-block-pro-for-gutenberg';

	/**
	 * Build the full config array passed to CoolPlugins\Onboarding\Config.
	 *
	 * @param string $page      Current admin page slug from $_GET['page'].
	 * @param string $mode      Screen mode from $_GET['mode'].
	 * @param array  $telemetry Telemetry counters (block_clicks).
	 * @return array
	 */
	public function build( $page, $mode, array $telemetry ) {
		$is_onboarding = ( 'ctlb-getting-started' === $page && 'onboarding' === $mode );

		$config = $this->identity();

		$config['show_chooser'] = false;
		$config['edition']      = 'liter';
		$config['addons']       = $is_onboarding ? array() : $this->pro_addons( $is_onboarding );
		$config['links']        = array(
			'footer' => $this->footer_cards( $is_onboarding ),
		);
		$config['methods']      = array(
			'block' => $this->method_block( $telemetry, $is_onboarding ),
		);

		return $config;
	}

	/**
	 * Core plugin identity and page copy.
	 *
	 * @return array
	 */
	private function identity() {
		$td = self::TEXT_DOMAIN;

		return array(
			'slug'            => 'ctlb',
			'prefix'          => 'ctlb',
			'text_domain'     => $td,
			'version'         => defined( 'Timeline_Block_Version' ) ? Timeline_Block_Version : '1.0.0',
			'plugin_dir'      => Timeline_Block_Dir,
			'plugin_url'      => Timeline_Block_Url,
			'parent_slug'     => 'options-general.php',
			'edition'         => 'liter',
			'tier'            => 'free',
			'only_new_user'   => false,
			'new_user_option' => 'ctlb_is_new_user',
			'colors'          => array(
				'primary'      => '#2e9e9d',
				'primary_dark' => '#257f7e',
			),
			'page'            => array(
				'menu_title' => __( 'Timeline Addons', $td ),
				'heading'    => __( 'Create your timeline', $td ),
				'subheading' => __( 'Follow the quick setup guide to create your timeline in minutes.', $td ),
				'chooser'    => __( 'Block Editor', $td ),
			),
		);
	}

	/**
	 * Build a single footer card.
	 *
	 * @param string $icon  Icon markup.
	 * @param string $title Card title.
	 * @param string $text  Card body text.
	 * @param array  $links Link rows (label + url).
	 * @return array
	 */
	private function card( $icon, $title, $text, array $links ) {
		return array(
			'icon'  => $icon,
			'title' => $title,
			'text'  => $text,
			'links' => $links,
		);
	}

	/**
	 * Block editor method.
	 *
	 * @param array $telemetry     Telemetry counters.
	 * @param bool  $is_onboarding Whether onboarding mode is active.
	 * @return array
	 */
	private function method_block( array $telemetry, $is_onboarding ) {
		$td = self::TEXT_DOMAIN;

		$utm_params    = $is_onboarding
			? '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=demo&utm_content=onboarding'
			: '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=demo&utm_content=dashboard';
		$view_demo_url = 'https://cooltimeline.com/demo/gutenberg-timeline-block/' . $utm_params;

		$method = array(
			'type'          => 'block-based',
			'title'         => __( 'Block Editor', $td ),
			'badge'         => __( 'Recommended', $td ),									
			'content_badge' => __( 'Best for Beginners', $td ),
			'description'   => __( 'Create timelines using Timeline Blocks.', $td ),
			'best_for'      => __( 'Beginners and block-first sites', $td ),
			'editions'      => array( 'liter', 'full' ),
			'video'         => array(
				'id'       => 'WsFekfIL-A8',
				'title'    => __( 'Create a Timeline with Block Editor', $td ),
				'duration' => '3:44',
			),
			'steps'         => array(
				array(
					'title' => __( 'Open any page or post', $td ),
					'desc'  => __( 'Go to Pages → Add Page (or Posts → Add Post), or edit an existing page/post where you want to display the timeline.', $td ),
				),
				array(
					'title' => __( 'Add Timeline Block', $td ),
					'desc'  => sprintf(
						/* translators: %s: block inserter icon */
						__( 'Click %s and search for "Timeline Block".', $td ),
						'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z"></path></svg>'
					),
				),
				array(
					'title' => __( 'Add timeline stories', $td ),
					'desc'  => __( 'Add title, date, description, media and icons.', $td ),
				),
				array(
					'title' => __( 'Publish your timeline', $td ),
					'desc'  => __( 'Save or publish to display your timeline.', $td ),
				),
			),
			'redirect_url'  => add_query_arg(
				array(
					'post_type' => 'page',
					'action'    => 'filter-ctlb-blocks',
				),
				admin_url( 'post-new.php' )
			),
			'fallback_url'  => add_query_arg(
				array(
					'post_type' => 'page',
					'action'    => 'filter-ctlb-blocks',
				),
				admin_url( 'post-new.php' )
			),
			'secondary'     => array(
				'label' => __( 'View Demo', $td ),
				'url'   => $view_demo_url,
			),
			'footer'        => $this->footer_cards( $is_onboarding ),
		);

		if ( empty( $telemetry['block_clicks'] ) ) {
			$method['cta'] = array( 'label' => __( 'Create Sample Timeline', $td ) );
		} else {
			$method['cta'] = array();
		}

		return $method;
	}

	/**
	 * Pro upsell addon for Timeline Block.
	 *
	 * @param bool $is_onboarding Whether onboarding mode is active.
	 * @return array<int, array>
	 */
	private function pro_addons( $is_onboarding ) {
		$td = self::TEXT_DOMAIN;

		$utm_params  = $is_onboarding
			? '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=demo&utm_content=onboarding'
			: '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=demo&utm_content=dashboard';
		$utm_params2 = $is_onboarding
			? '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=onboarding'
			: '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=dashboard';

		if ( $this->has_timeline_block_pro() ) {
			return array();
		}

		if ( $this->is_timeline_block_pro_installed() ) {
			return array(
				array(
					'slug'           => self::PRO_SLUG,
					'type'           => 'free',
					'group'          => 'block-based',
					'install_method' => 'manually',
					'title'          => __( 'Timeline Block Pro', $td ),
					'description'    => __( 'Unlock horizontal layouts, advanced settings, and premium designs.', $td ),
					'label_text'     => __( 'Timeline Block Pro is installed — activate it to unlock premium features.', $td ),
					'learn_more'     => 'https://cooltimeline.com/plugin/timeline-block-pro-for-gutenberg/' . $utm_params,
					'setup_url'      => self::timeline_block_pro_setup_url(),
					'show'           => true,
				),
			);
		}

		return array(
			array(
				'slug'          => self::PRO_SLUG,
				'type'          => 'pro',
				'group'         => 'block-based',
				'title'         => __( 'Timeline Block Pro', $td ),
				'description'   => __( 'Unlock horizontal layouts, advanced settings, and premium designs.', $td ),
				'label_text'    => __( 'Want more layouts and designs?', $td ),
				'upgrade_label' => __( 'Buy Timeline Block Pro', $td ),
				'upgrade_url'   => 'https://cooltimeline.com/plugin/timeline-block-pro-for-gutenberg/' . $utm_params2,
				'learn_more'    => 'https://cooltimeline.com/plugin/timeline-block-pro-for-gutenberg/' . $utm_params,
			),
		);
	}

	/**
	 * Whether Timeline Block Pro is active.
	 *
	 * @return bool
	 */
	private function has_timeline_block_pro() {
		if ( defined( 'Timeline_Block_Pro_Version' ) || defined( 'CTLB_PRO' ) ) {
			return true;
		}

		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$file = self::timeline_block_pro_plugin_file();
		return '' !== $file && is_plugin_active( $file );
	}

	/**
	 * Whether Timeline Block Pro is installed (active or not).
	 *
	 * @return bool
	 */
	private function is_timeline_block_pro_installed() {
		return '' !== self::timeline_block_pro_plugin_file();
	}

	/**
	 * Resolve the Timeline Block Pro bootstrap file.
	 *
	 * @return string Relative plugin file, or empty string if not installed.
	 */
	public static function timeline_block_pro_plugin_file() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		foreach ( get_plugins() as $file => $data ) {
			if ( dirname( $file ) === self::PRO_SLUG ) {
				return $file;
			}
		}

		return '';
	}

	/**
	 * Post-activate setup URL for Timeline Block Pro.
	 *
	 * When Cool Timeline Pro (>= 6.1.5) is active, send users to its Getting Started
	 * screen instead of Timeline Block Pro's own onboarding.
	 *
	 * @return string
	 */
	public static function timeline_block_pro_setup_url() {
		if ( self::should_redirect_to_cool_timeline_pro() ) {
			return admin_url( 'admin.php?page=ctl-getting-started' );
		}

		return admin_url( 'admin.php?page=ctlbp-getting-started' );
	}

	/**
	 * Whether Cool Timeline Pro is active at a supported version for shared onboarding.
	 *
	 * @return bool
	 */
	public static function should_redirect_to_cool_timeline_pro() {
		if ( ! defined( 'CTLPV' ) || ! is_string( CTLPV ) || '' === CTLPV ) {
			return false;
		}

		if ( version_compare( CTLPV, '6.1.5', '<' ) ) {
			return false;
		}

		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		return is_plugin_active( 'cool-timeline-pro/cool-timeline-pro.php' );
	}

	/**
	 * Footer card set for the block editor onboarding screen.
	 *
	 * @param bool $is_onboarding Whether onboarding mode is active.
	 * @return array
	 */
	private function footer_cards( $is_onboarding ) {
		$td = self::TEXT_DOMAIN;

		$utm_params = $is_onboarding
			? '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=docs&utm_content=onboarding'
			: '?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard';

		return array(
			$this->card(
				'<span class="dashicons dashicons-editor-help"></span>',
				__( 'Support', $td ),
				__( 'Need help? Our team can assist with setup and troubleshooting.', $td ),
				array(
					array(
						'class' => 'cpo-button cpo-button-secondary cpo-button-small',
						'label' => __( 'Get Support', $td ),
						'url'   => 'https://coolplugins.net/support/' . $utm_params,
					),
				)
			),
			$this->card(
				'<span class="dashicons dashicons-book"></span>',
				__( 'Documentation', $td ),
				__( 'Use the most common setup guides first.', $td ),
				array(
					array(
						'label' => __( 'How to add Timeline Block', $td ),
						'class' => 'ctlb_doc_link',
						'url'   => 'https://cooltimeline.com/doc/gutenberg-timeline-block/' . $utm_params,
					),
					array(
						'label' => __( 'FAQ', $td ),
						'class' => 'ctlb_doc_link',
						'url'   => 'https://cooltimeline.com/doc/faq/' . $utm_params,
					),
					array(
						'label' => __( 'View All Docs', $td ),
						'class' => 'ctlb_doc_link',
						'url'   => 'https://cooltimeline.com/docs/timeline-block-pro/' . $utm_params,
					),
				)
			),
			$this->card(
				'<span class="dashicons dashicons-star-filled"></span>',
				__( 'Your Feedback Matters', $td ),
				__( 'If you are happy with the plugin, we would greatly appreciate a quick review. Your support helps us continue improving it.', $td ),
				array(
					array(
						'label' => __( 'Leave a Review', $td ),
						'url'   => 'https://wordpress.org/support/plugin/timeline-block/reviews/#new-post',
						'class' => 'cpo-button cpo-button-secondary cpo-button-small',
					),
				)
			),
		);
	}
}

/**
 * Register plugin-specific onboarding hooks.
 *
 * @param Config $config Resolved onboarding config.
 * @return void
 */
function ctlb_onboarding_register_hooks( Config $config ) {
	add_filter(
		'ctlb_onboarding_labels',
		static function ( $labels ) {
			$labels['loading']     = __( 'Creating Timeline…', 'timeline-block' );
			$labels['redirecting'] = __( 'Redirecting…', 'timeline-block' );
			$labels['error']       = __( 'Something went wrong. Please try again.', 'timeline-block' );
			return $labels;
		}
	);

	// Activate-only for Timeline Block Pro (already installed). No WP.org install.
	add_action(
		'wp_ajax_' . $config->ajax_action( 'install' ),
		static function () use ( $config ) {
			if ( ! current_user_can( 'activate_plugins' ) ) {
				wp_send_json_error(
					array( 'errorMessage' => __( 'Sorry, you are not allowed to activate plugins on this site.', 'timeline-block' ) ),
					403
				);
			}

			check_ajax_referer( $config->option( 'install' ), 'wp_nonce' );

			// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above.
			$slug = isset( $_POST['slug'] ) ? sanitize_key( wp_unslash( $_POST['slug'] ) ) : '';
			if ( '' === $slug || CTLB_Onboarding_Config::PRO_SLUG !== $slug ) {
				wp_send_json_error(
					array( 'errorMessage' => __( 'This plugin cannot be activated from here.', 'timeline-block' ) ),
					403
				);
			}

			$file = CTLB_Onboarding_Config::timeline_block_pro_plugin_file();
			if ( '' === $file ) {
				wp_send_json_error(
					array( 'errorMessage' => __( 'Plugin is not installed. Please install it first.', 'timeline-block' ) ),
					404
				);
			}

			if ( is_plugin_active( $file ) ) {
				wp_send_json_success(
					array(
						'activated'   => true,
						'redirectUrl' => CTLB_Onboarding_Config::timeline_block_pro_setup_url(),
					)
				);
			}

			if ( ! current_user_can( 'activate_plugin', $file ) ) {
				wp_send_json_error(
					array( 'errorMessage' => __( 'Sorry, you are not allowed to activate this plugin.', 'timeline-block' ) ),
					403
				);
			}

			$result = activate_plugin( $file );
			if ( is_wp_error( $result ) ) {
				wp_send_json_error( array( 'errorMessage' => $result->get_error_message() ), 500 );
			}

			wp_send_json_success(
				array(
					'activated'   => true,
					'redirectUrl' => CTLB_Onboarding_Config::timeline_block_pro_setup_url(),
				)
			);
		},
		1
	);
}

// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only screen detection.
$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only screen detection.
$mode = isset( $_GET['mode'] ) ? sanitize_key( wp_unslash( $_GET['mode'] ) ) : 'dashboard';

$telemetry_data = get_option( 'ctlb_onboarding_telemetry', array() );
$block_clicks   = isset( $telemetry_data['counters']['cta_clicked.block-based'] )
	? $telemetry_data['counters']['cta_clicked.block-based']
	: 0;

$builder      = new CTLB_Onboarding_Config();
$config_array = $builder->build(
	$page,
	$mode,
	array(
		'block_clicks' => $block_clicks,
	)
);

$config = new Config( $config_array );

ctlb_onboarding_register_hooks( $config );

( new Framework( $config ) )->init();
