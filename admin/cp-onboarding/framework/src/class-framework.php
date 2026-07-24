<?php
/**
 * Onboarding framework — admin page, assets, AJAX.
 *
 * One instance per plugin. All plugin-specific behaviour comes from the
 * injected Config, so the same code serves every Cool Plugins product and
 * every Free/Pro, Full/Liter edition.
 *
 * @package CoolPlugins\Onboarding
 */

namespace CoolPlugins\Onboarding;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.WP.I18n.TextDomainMismatch, WordPress.NamingConventions.PrefixAllGlobals.DynamicHooknameFound

/**
 * Framework controller.
 */
final class Framework {

	/**
	 * @var Config
	 */
	private $config;

	/**
	 * @var Telemetry|null
	 */
	private $telemetry = null;

	/**
	 * @param Config $config Plugin config.
	 */
	public function __construct( Config $config ) {
		$this->config = $config;

		if ( $config->telemetry_enabled() ) {
			$this->telemetry = new Telemetry( $config );
		}
	}

	/**
	 * Register hooks. Safe to call once per plugin.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'admin_menu', array( $this, 'register_submenu' ), 9 );
		add_action( 'admin_init', array( $this, 'maybe_set_admin_page_title' ) );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		add_action(
			'wp_ajax_' . $this->config->ajax_action( 'prepare' ),
			array( $this, 'ajax_prepare' )
		);

		add_action(
			'wp_ajax_' . $this->config->ajax_action( 'install' ),
			array( $this, 'ajax_install' )
		);

		if ( $this->telemetry ) {
			add_action(
				'wp_ajax_' . $this->config->ajax_action( 'track' ),
				array( $this, 'ajax_track' )
			);
		}
	}

	/**
	 * Page slug for this plugin's onboarding screen.
	 *
	 * @return string
	 */
	public function page_slug() {
		return $this->config->slug() . '-getting-started';
	}

	/**
	 * Register the "Getting Started" submenu.
	 *
	 * @return void
	 */
	public function register_submenu() {

		$menu_title = $this->config->page( 'menu_title' );
		if ( '' === $menu_title ) {
			$menu_title = 'Getting Started';
		}

		// Surface the page under the plugin's main menu when configured; fall back
		// to options.php (hidden, URL-accessible) when no parent slug is provided.
		// Never pass null — PHP 8.1+ deprecates null in wp_normalize_path()/wp_is_stream().
		$parent = $this->config->parent_slug();
		if ( ! is_string( $parent ) || '' === $parent ) {
			$parent = 'options.php';
		}

		$hook = add_submenu_page(
			$parent,
			$menu_title,
			$menu_title,
			$this->config->capability(),
			$this->page_slug(),
			array( $this, 'render_page' )
		);

		if ( $hook ) {
			add_action( 'load-' . $hook, array( $this, 'set_admin_page_title' ) );
		}
	}

	/**
	 * Set global $title before admin-header.php.
	 *
	 * Orphan pages (no parent slug) are not in the top-level $menu, so WordPress
	 * cannot resolve a title and passes null to strip_tags() in admin-header.php.
	 * admin_init runs before admin-header regardless of the resolved page hook.
	 *
	 * @return void
	 */
	public function maybe_set_admin_page_title() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only screen detection.
		$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
		if ( $this->page_slug() !== $page ) {
			return;
		}

		global $title;

		if ( ! empty( $title ) ) {
			return;
		}

		$this->set_admin_page_title();
	}

	/**
	 * Assign the onboarding screen title to the global $title.
	 *
	 * @return void
	 */
	public function set_admin_page_title() {
		global $title;

		$menu_title = $this->config->page( 'menu_title' );
		if ( empty( $menu_title ) ) {
			$menu_title = 'Getting Started';
		}

		$title = $menu_title;
	}



	/**
	 * Enqueue CSS/JS only on this plugin's onboarding screen.
	 *
	 * @param string $hook_suffix Current screen.
	 * @return void
	 */
	public function enqueue_assets( $hook_suffix ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- screen detection only.
		$current = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';

		$on_screen = ( $this->config->parent_slug() . '_page_' . $this->page_slug() === $hook_suffix )
			|| ( $this->page_slug() === $current );

		if ( ! $on_screen ) {
			return;
		}

		$base = $this->config->plugin_url() . 'admin/cp-onboarding/framework/assets/';
		$ver  = $this->config->version();

		wp_enqueue_style( 'dashicons' );
		wp_enqueue_style( $this->config->handle(), $base . 'onboarding.css', array(), $ver );

		// Inline the brand colors so a single shared stylesheet themes per plugin.
		$colors = $this->config->colors();
		$root   = sprintf(
			'.wrap.cpo-onboarding-page{--cpo-primary:%1$s;--cpo-primary-dark:%2$s;}',
			esc_html( $colors['primary'] ),
			esc_html( $colors['primary_dark'] )
		);
		wp_add_inline_style( $this->config->handle(), $root );

		wp_enqueue_script( $this->config->handle(), $base . 'onboarding.js', array(), $ver, true );

		wp_localize_script( $this->config->handle(), $this->config->js_global(), $this->script_data() );
	}

	/**
	 * Data passed to the front-end script. All strings are pre-translated by
	 * the plugin's text domain (the framework never owns a text domain).
	 *
	 * @return array
	 */
	private function script_data() {
		$td = $this->config->text_domain();

		$data = array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'action'  => $this->config->ajax_action( 'prepare' ),
			'nonce'   => wp_create_nonce( $this->config->option( 'prepare' ) ),
			'labels'  => array(
				'loading'     => __( 'Please wait…', 'default' ),
				'redirecting' => __( 'Redirecting…', 'default' ),
			),
		);

		// Allow the plugin to override/extend labels in its own text domain.
		$data['labels'] = wp_parse_args(
			(array) apply_filters( $this->config->prefix() . '_onboarding_labels', array(), $td ),
			$data['labels']
		);

		// Default wiring for the 'manually' (custom AJAX) addon install button.
		// Points at the framework's built-in handler so it works out of the box;
		// a plugin can still override 'action'/'labels' via the script-data filter
		// below (e.g. to use its own richer handler).
		$data['install'] = array(
			'action' => $this->config->ajax_action( 'install' ),
			'labels' => array(
				'installing' => __( 'Installing…', 'default' ),
				'activating' => __( 'Activating…', 'default' ),
				'activated'  => __( 'Activated', 'default' ),
				'setupGuide' => __( 'Check Setup Guide', 'default' ),
				'error'      => __( 'Plugin could not be installed. Please try again.', 'default' ),
			),
		);

		if ( $this->telemetry ) {
			$data['track'] = array(
				'action' => $this->config->ajax_action( 'track' ),
				'nonce'  => wp_create_nonce( $this->config->option( 'track' ) ),
			);
		}

		// Static fallbacks per method (used if AJAX fails). Pulled from config.
		$redirects = array();
		foreach ( $this->config->methods() as $method ) {
			if ( ! empty( $method['type'] ) && ! empty( $method['fallback_url'] ) ) {
				$redirects[ $method['type'] ] = esc_url_raw( $method['fallback_url'] );
			}
		}
		$data['redirects'] = $redirects;

		/**
		 * Final chance for a plugin to adjust localized data.
		 *
		 * @param array  $data   Script data.
		 * @param Config $config Plugin config.
		 */
		return apply_filters( $this->config->prefix() . '_onboarding_script_data', $data, $this->config );
	}

	/**
	 * Render the onboarding page via the shared view.
	 *
	 * @return void
	 */
	public function render_page() {
		if ( ! current_user_can( $this->config->capability() ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'default' ) );
		}

		if ( $this->telemetry ) {
			$this->telemetry->seed_selection();
		}

		$config    = $this->config;       // Exposed to the view.
		$telemetry = $this->telemetry;    // Exposed to the view.

		include CPO_ONBOARDING_DIR . '/views/onboarding-page.php';
	}

	/**
	 * AJAX: record a telemetry event. Always returns empty success.
	 *
	 * @return void
	 */
	public function ajax_track() {
		check_ajax_referer( $this->config->option( 'track' ), 'nonce' );

		if ( ! current_user_can( $this->config->capability() ) || ! $this->telemetry ) {
			wp_send_json_success();
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above.
		$event = isset( $_POST['event'] ) ? sanitize_key( wp_unslash( $_POST['event'] ) ) : '';
		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above.
		$bucket = isset( $_POST['bucket'] ) ? sanitize_key( wp_unslash( $_POST['bucket'] ) ) : '';

		if ( 'method_picked' === $event && '' !== $bucket ) {
			$this->telemetry->set_selection( $bucket );
			update_option( $this->config->option( 'method' ), $bucket, false );
		}

		$this->telemetry->track( $event, $bucket );

		wp_send_json_success();
	}

	/**
	 * AJAX: prepare the selected method.
	 *
	 * - A method with a demo config runs the generator and returns a URL.
	 * - Otherwise returns the method's configured redirect/fallback URL.
	 *
	 * @return void
	 */
	public function ajax_prepare() {
		check_ajax_referer( $this->config->option( 'prepare' ), 'nonce' );

		if ( ! current_user_can( $this->config->capability() ) ) {
			wp_send_json_error( array( 'message' => __( 'Unauthorized.', 'default' ) ), 403 );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above.
		$type = isset( $_POST['method_type'] ) ? sanitize_key( wp_unslash( $_POST['method_type'] ) ) : '';

		$method = $this->find_method_by_type( $type );
		if ( ! $method ) {
			wp_send_json_error( array( 'message' => __( 'Invalid selection.', 'default' ) ), 400 );
		}

		// Method that just redirects (no demo generation).
		if ( empty( $method['demo'] ) ) {
			$url = ! empty( $method['redirect_url'] )
				? esc_url_raw( $method['redirect_url'] )
				: ( ! empty( $method['fallback_url'] ) ? esc_url_raw( $method['fallback_url'] ) : '' );

			if ( '' === $url ) {
				wp_send_json_error( array( 'message' => __( 'No destination configured.', 'default' ) ), 400 );
			}

			wp_send_json_success(
				array(
					'redirectUrl' => $url,
					'type'        => $type,
				)
			);
		}

		// Demo-generating method.
		$demo_config = $this->config->demo();
		if ( empty( $demo_config ) ) {
			wp_send_json_error( array( 'message' => __( 'Demo generator is unavailable.', 'default' ) ), 500 );
		}
		if ( ! class_exists( __NAMESPACE__ . '\\Demo_Generator' ) ) {
   		 wp_send_json_error( array( 'message' => __( 'Demo generator is unavailable.', 'default' ) ), 500 );
		}
		$generator = new Demo_Generator( $this->config, $demo_config );
		$result    = $generator->generate();

		if ( is_wp_error( $result ) ) {
			wp_send_json_error(
				array(
					'message' => $result->get_error_message(),
					'code'    => $result->get_error_code(),
				),
				500
			);
		}

		$redirect = ! empty( $result['preview_url'] ) ? $result['preview_url'] : $result['redirect_url'];

		wp_send_json_success(
			array(
				'redirectUrl' => $redirect,
				'editUrl'     => $result['redirect_url'],
				'pageId'      => (int) $result['page_id'],
				'postIds'     => array_map( 'absint', (array) $result['post_ids'] ),
				'already'     => ! empty( $result['already'] ),
				'type'        => $type,
			)
		);
	}

	/**
	 * AJAX: install (or activate) a configured cross-sell addon from WordPress.org.
	 *
	 * Only addons declared in config with the 'manually' install method are allowed
	 * (the slug allow-list is derived from config, never from the request). Reuses the
	 * standard WP.org install → activate flow. Plugins that need richer behaviour
	 * (e.g. Pro) point `data.install.action` at their own handler instead.
	 *
	 * @return void
	 */
	public function ajax_install() {
		check_ajax_referer( $this->config->option( 'install' ), 'wp_nonce' );

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above.
		$slug = isset( $_POST['slug'] ) ? sanitize_key( wp_unslash( $_POST['slug'] ) ) : '';
		if ( '' === $slug ) {
			wp_send_json_error( array( 'errorMessage' => __( 'No plugin specified.', 'default' ) ), 400 );
		}

		if ( ! in_array( $slug, $this->installable_slugs(), true ) ) {
			wp_send_json_error( array( 'errorMessage' => __( 'This plugin cannot be installed from here.', 'default' ) ), 403 );
		}

		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		// Already installed (including paid plugins not on wordpress.org): just activate.
		foreach ( get_plugins() as $file => $data ) {
			if ( dirname( $file ) !== $slug ) {
				continue;
			}
			if ( ! current_user_can( 'activate_plugins' ) ) {
				wp_send_json_error(
					array( 'errorMessage' => __( 'Sorry, you are not allowed to activate plugins on this site.', 'default' ) ),
					403
				);
			}
			$this->activate_installed( array( 'file' => $file ) );
		}

		if ( ! current_user_can( 'install_plugins' ) ) {
			wp_send_json_error(
				array( 'errorMessage' => __( 'Sorry, you are not allowed to install plugins on this site.', 'default' ) ),
				403
			);
		}

		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

		$api = plugins_api(
			'plugin_information',
			array(
				'slug'   => $slug,
				'fields' => array( 'sections' => false ),
			)
		);

		if ( is_wp_error( $api ) ) {
			wp_send_json_error( array( 'errorMessage' => $api->get_error_message() ), 500 );
		}

		$skin     = new \WP_Ajax_Upgrader_Skin();
		$upgrader = new \Plugin_Upgrader( $skin );
		$result   = $upgrader->install( $api->download_link );

		// Already installed: activate the existing copy instead of failing.
		if ( is_wp_error( $skin->result ) && 'folder_exists' === $skin->result->get_error_code() ) {
			$this->activate_installed( install_plugin_install_status( $api ) );
		}

		if ( is_wp_error( $result ) ) {
			wp_send_json_error( array( 'errorMessage' => $result->get_error_message() ), 500 );
		}

		if ( is_wp_error( $skin->result ) ) {
			wp_send_json_error( array( 'errorMessage' => $skin->result->get_error_message() ), 500 );
		}

		if ( $skin->get_errors()->has_errors() ) {
			wp_send_json_error( array( 'errorMessage' => $skin->get_error_messages() ), 500 );
		}

		if ( null === $result ) {
			wp_send_json_error(
				array( 'errorMessage' => __( 'Unable to connect to the filesystem. Please confirm your credentials.', 'default' ) ),
				500
			);
		}

		$this->activate_installed( install_plugin_install_status( $api ) );
	}

	/**
	 * Activate a freshly installed plugin and return a JSON success response.
	 *
	 * @param array $install_status Result of install_plugin_install_status().
	 * @return void Sends a JSON response and exits.
	 */
	private function activate_installed( $install_status ) {
		$file = isset( $install_status['file'] ) ? $install_status['file'] : '';

		if ( '' !== $file && current_user_can( 'activate_plugin', $file ) && is_plugin_inactive( $file ) ) {
			$network_wide = is_multisite();
			$activated    = activate_plugin( $file, '', $network_wide );

			if ( is_wp_error( $activated ) ) {
				wp_send_json_error( array( 'errorMessage' => $activated->get_error_message() ), 500 );
			}
		}

		wp_send_json_success( array( 'activated' => true ) );
	}

	/**
	 * Slugs that the built-in installer is allowed to install: configured addons
	 * whose install method resolves to 'manually'.
	 *
	 * @return string[]
	 */
	private function installable_slugs() {
		$slugs = array();

		foreach ( Addons::resolve( $this->config->addons(), $this->config ) as $addon ) {
			if ( 'manually' === $addon['install_method'] ) {
				$slugs[] = $addon['slug'];
			}
		}

		return $slugs;
	}

	/**
	 * Find a configured method by its public 'type'.
	 *
	 * @param string $type Method type.
	 * @return array|null
	 */
	private function find_method_by_type( $type ) {
		if ( '' === $type ) {
			return null;
		}
		foreach ( $this->config->methods() as $method ) {
			if ( isset( $method['type'] ) && $method['type'] === $type ) {
				return $method;
			}
		}
		return null;
	}

	/**
	 * Accessor for the config (used by integrations).
	 *
	 * @return Config
	 */
	public function config() {
		return $this->config;
	}
}
