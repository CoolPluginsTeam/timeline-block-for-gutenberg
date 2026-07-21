<?php
/**
 * Plugin Name:Timeline Block
 * Plugin URI:https://cooltimeline.com
 * Description:Responsive timeline block for Gutenberg editor.
 * Version:1.9.0
 * Author:Cool Plugins
 * Author URI:https://coolplugins.net/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugins_list
 * License:GPLv2 or later
 * License URI:https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:timeline-block
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound

define( 'Timeline_Block_File', __FILE__ );
define( 'Timeline_Block_Url', plugin_dir_url( Timeline_Block_File ) );
define( 'Timeline_Block_Dir', plugin_dir_path( __FILE__ ) );
if ( ! defined( 'Timeline_Block_Version' ) ) {
	define( 'Timeline_Block_Version', '1.9.0' );
}

// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound

/**
 * This class is responsible for registering all block assets, making them available for enqueueing through the block editor in the appropriate context.
 * For more information on applying styles with stylesheets in the block editor, refer to the following resource:
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
if ( ! class_exists( 'CoolTimelineBlock' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound
	final class CoolTimelineBlock {


		

		/**
		 * This property holds the unique instance of the plugin.
		 */
		private static $instance;

		/**
		 * This method retrieves an instance of our plugin.
		 * It ensures that only one instance of the plugin is created, adhering to the singleton pattern.
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/** Constructor */
		public function __construct() {
			// This section sets up the plugin object by hooking into the 'plugins_loaded' action to include required files.
			add_action( 'plugins_loaded', array( $this, 'ctlb_include_files' ) );

			// Load plugin textdomain
			add_action('init', array($this, 'ctlb_load_plugin_textdomain'));
			register_activation_hook( __FILE__, array( $this, 'ctlb_plugin_activate' ));

			if ( is_admin() && $this->ctlb_should_load_onboarding() ) {
				add_action( 'enqueue_block_editor_assets', array( $this, 'ctlb_enqueue_onboarding_inserter' ) );
			}
		}

		/**
		 * Whether Timeline Block onboarding should load.
		 *
		 * Skip when Cool Timeline (free) is active — it provides its own onboarding.
		 *
		 * @return bool
		 */
		private function ctlb_should_load_onboarding() {
			if ( ! function_exists( 'is_plugin_active' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			return ! is_plugin_active( 'cool-timeline/cooltimeline.php' );
		}

		/**
		 * Initialize plugin options
		 * Note: load_plugin_textdomain() is not needed for WordPress.org hosted plugins
		 * as translations are automatically loaded since WordPress 4.6
		 */
		public function ctlb_load_plugin_textdomain() {
			if ( ! get_option( 'ctlb-initial-save-version' ) ) {
				add_option( 'ctlb-initial-save-version', Timeline_Block_Version );
			}
			if ( ! get_option( 'ctlb-install-date' ) ) {
				add_option( 'ctlb-install-date', gmdate( 'Y-m-d H:i:s' ) );
			}
		}



		 public function ctlb_plugin_activate() {
			if ( ! get_option( 'ctlb-initial-save-version' ) ) {
				add_option( 'ctlb-initial-save-version', Timeline_Block_Version );
			}

			$is_new_user = false === get_option( 'ctlb-install-date' );

			if ( $is_new_user && $this->ctlb_should_load_onboarding() ) {
				update_option( 'ctlb_is_new_user', 'yes' );
				set_transient( 'ctlb_activation_redirect', 1, 5 * MINUTE_IN_SECONDS );
			}

			if ( ! get_option( 'ctlb-install-date' ) ) {
				add_option( 'ctlb-install-date', gmdate( 'Y-m-d H:i:s' ) );
			}
			}

		/**
		 * This method includes all the necessary files for the plugin to function.
		 * It loads files for the Gutenberg block, the Cool Timeline Block source, and admin feedback functionality.
		 */
		public function ctlb_include_files() {
			require Timeline_Block_Dir . 'includes/cool-timeline-block/src/init.php'; // Includes the Cool Timeline Block source initialization file.

			if ( is_admin() ) { // Checks if the current request is for an administrative interface page.
				$pluginpath= plugin_basename( __FILE__ );
				require_once Timeline_Block_Dir . 'admin/feedback/ctlb-users-feedback.php'; // Includes the admin feedback functionality file.
			    add_filter( "plugin_action_links_$pluginpath", array( $this, 'ctlb_settings_link' ) );

				if ( $this->ctlb_should_load_onboarding() ) {
					require_once Timeline_Block_Dir . 'admin/ctlb-timeline-header.php';
					require_once Timeline_Block_Dir . 'admin/cp-onboarding/loader.php';
					cpo_onboarding_register( '1.1.2', Timeline_Block_Dir . 'admin/cp-onboarding' );

					add_action(
						'cpo_onboarding_loaded',
						static function () {
							require_once Timeline_Block_Dir . 'admin/cp-onboarding/onboarding-config.php';
						}
					);

					add_action( 'admin_init', array( $this, 'ctlb_maybe_redirect_to_onboarding' ) );
				}
			}
		}

		/**
		 * Redirect to onboarding after first activation.
		 *
		 * @return void
		 */
		public function ctlb_maybe_redirect_to_onboarding() {
			if ( ! get_transient( 'ctlb_activation_redirect' ) ) {
				return;
			}

			delete_transient( 'ctlb_activation_redirect' );

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only bulk activation check.
			if ( isset( $_GET['activate-multi'] ) ) {
				return;
			}

			wp_safe_redirect( admin_url( 'admin.php?page=ctlb-getting-started&mode=onboarding' ) );
			exit;
		}

		/**
		 * Enqueue block inserter helper for onboarding deep links.
		 *
		 * @return void
		 */
		public function ctlb_enqueue_onboarding_inserter() {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display-only query arg.
			if ( ! isset( $_GET['action'] ) || 'filter-ctlb-blocks' !== $_GET['action'] ) {
				return;
			}

			$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
			if ( ! $screen || ! $screen->is_block_editor() ) {
				return;
			}

			wp_enqueue_script(
				'ctlb-block-inserter',
				Timeline_Block_Url . 'admin/cp-onboarding/assets/inserter.js',
				array( 'wp-dom-ready', 'wp-blocks', 'wp-data', 'wp-editor', 'wp-block-editor' ),
				Timeline_Block_Version,
				true
			);
		}
		   public function ctlb_settings_link( $links ) {
			if ( $this->ctlb_should_load_onboarding() ) {
				// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch -- Plugin text domain is timeline-block.
				$links[] = '<a href="admin.php?page=ctlb-getting-started&mode=onboarding">' . esc_html__( 'Getting Started', 'timeline-block' ) . '</a>';
			}

			$links[] = '<a style="font-weight:bold; color:#852636;" href="https://cooltimeline.com/plugin/timeline-block-pro-for-gutenberg/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=plugins_list#pricing">Get Pro</a>';

			return $links;
		}


		public static function ctlb_get_user_info(){
         global $wpdb;
        // Server and WP environment details
        $server_info = [
            'server_software'        => isset($_SERVER['SERVER_SOFTWARE']) ? sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) ) : 'N/A',
			//phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
            'mysql_version'          => $wpdb ? sanitize_text_field($wpdb->get_var("SELECT VERSION()")) : 'N/A',
            'php_version'            => sanitize_text_field(phpversion() ?: 'N/A'),
            'wp_version'             => sanitize_text_field(get_bloginfo('version') ?: 'N/A'),
            'wp_debug'               => (defined('WP_DEBUG') && WP_DEBUG) ? 'Enabled' : 'Disabled',
            'wp_memory_limit'        => sanitize_text_field(ini_get('memory_limit') ?: 'N/A'),
            'wp_max_upload_size'     => sanitize_text_field(ini_get('upload_max_filesize') ?: 'N/A'),
            'wp_permalink_structure' => sanitize_text_field(get_option('permalink_structure') ?: 'Default'),
            'wp_multisite'           => is_multisite() ? 'Enabled' : 'Disabled',
            'wp_language'            => sanitize_text_field(get_option('WPLANG') ?: get_locale()),
            'wp_prefix'              => isset($wpdb->prefix) ? sanitize_key($wpdb->prefix) : 'N/A',
        ];
        // Theme details
        $theme = wp_get_theme();
        $theme_data = [
            'name'      => sanitize_text_field($theme->get('Name')),
            'version'   => sanitize_text_field($theme->get('Version')),
            'theme_uri' => esc_url($theme->get('ThemeURI')),
        ];
        if (!function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        if (!function_exists('get_plugin_data')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        $plugin_data = [];
        $active_plugins = get_option('active_plugins', []);
        foreach ($active_plugins as $plugin_path) {
            $plugin_file = WP_PLUGIN_DIR . '/' . ltrim($plugin_path, '/');
            if (file_exists($plugin_file)) {
                $plugin_info = get_plugin_data($plugin_file, false, false);
                $plugin_url = !empty($plugin_info['PluginURI']) ? esc_url($plugin_info['PluginURI']) : (!empty($plugin_info['AuthorURI']) ? esc_url($plugin_info['AuthorURI']) : 'N/A');
                $plugin_data[] = [
                    'name'       => sanitize_text_field($plugin_info['Name']),
                    'version'    => sanitize_text_field($plugin_info['Version']),
                    'plugin_uri' => !empty($plugin_url) ? $plugin_url : 'N/A',
                ];
            }
        }
        return [
            'server_info'   => $server_info,
            'extra_details' => [
                'wp_theme'       => $theme_data,
                'active_plugins' => $plugin_data,
            ],
        ];
    }
	}
}
CoolTimelineBlock::get_instance();
