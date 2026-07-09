<?php
/**
 * Cross-sell addon resolution.
 *
 * Moves the per-render plugin-state logic (originally an inline closure in the
 * Cool Timeline template that called get_plugins() repeatedly) into the
 * framework, caches the installed-plugins scan once per request, and reads the
 * addon list from config. Each addon may declare a `condition` callable so a
 * card only shows in the right context (e.g. Elementor active).
 *
 * @package CoolPlugins\Onboarding
 */

namespace CoolPlugins\Onboarding;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Addon helper.
 */
final class Addons {

	/**
	 * Cached installed plugins map (file => data).
	 *
	 * @var array|null
	 */
	private static $installed = null;

	/**
	 * Resolve configured addons into render-ready data.
	 *
	 * @param array  $addons Config addon definitions.
	 * @param Config $config Plugin config.
	 * @return array
	 */
	public static function resolve( array $addons, Config $config ) {
		if ( empty( $addons ) ) {
			return array();
		}

		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$resolved = array();

		foreach ( $addons as $addon ) {
			if ( empty( $addon['slug'] ) ) {
				continue;
			}

			// Optional gating: hide the addon when `show` is false/0 or the
			// `condition` callable returns false. `show` lets a plugin hide a
			// card without removing it from config (case 3: "hide this section").
			if ( isset( $addon['show'] ) && ! filter_var( $addon['show'], FILTER_VALIDATE_BOOLEAN ) ) {
				continue;
			}
			if ( isset( $addon['condition'] ) && is_callable( $addon['condition'] )
				&& ! call_user_func( $addon['condition'] ) ) {
				continue;
			}

			// Card type: 'free' (default) installs/activates a free plugin;
			// 'pro' promotes a paid plugin with an external upgrade link only.
			$type = ( isset( $addon['type'] ) && 'pro' === strtolower( (string) $addon['type'] ) ) ? 'pro' : 'free';

			$state  = self::state_for( $addon['slug'] );
			$method = self::normalize_method( isset( $addon['install_method'] ) ? $addon['install_method'] : '' );
			$title  = isset( $addon['title'] ) ? $addon['title'] : '';

			// WordPress plugin-search method: build the native search URL once here.
			$search_url = '';
			if ( 'free' === $type && 'default' === $method ) {
				$term       = ! empty( $addon['search'] ) ? $addon['search'] : $title;
				$search_url = self::search_url( $term );
			}

			// Pro cards never install: their button is the external upgrade link.
			$label = 'pro' === $type
				? ( isset( $addon['upgrade_label'] ) ? $addon['upgrade_label'] : __( 'Upgrade to Pro', 'default' ) )
				: $state['label'];

			$resolved[] = array(
				'slug'           => $addon['slug'],
				'title'          => $title,
				'description'    => isset( $addon['description'] ) ? $addon['description'] : '',
				'icon'           => isset( $addon['icon'] ) ? $addon['icon'] : '',
				'learn_more'     => isset( $addon['learn_more'] ) ? $addon['learn_more'] : '',
				'setup_url'      => isset( $addon['setup_url'] ) ? $addon['setup_url'] : '',
				'install_method' => $method,
				'search_url'     => $search_url,
				'state'          => 'pro' === $type ? 'promo' : $state['state'],
				'label'          => $label,
				'nonce'          => wp_create_nonce( $config->option( 'install' ) ),
				'label_text'     => isset( $addon['label_text'] ) ? $addon['label_text'] : '',
				'type'           => $type,
				'upgrade_url'    => isset( $addon['upgrade_url'] ) ? $addon['upgrade_url'] : '',
				'group'          => isset( $addon['group'] ) ? $addon['group'] : '',
			);
		}

		return $resolved;
	}

	/**
	 * Normalize a configured install_method to a canonical value.
	 *
	 * - 'manually' (custom AJAX inline install): 'manually', 'maually', 'manual', 'ajax'.
	 * - 'default' (WordPress plugin-search page): 'default', 'wp_search', 'search'.
	 * - Anything else (including empty) falls back to 'manually'.
	 *
	 * @param string $method Raw method from config.
	 * @return string 'manually'|'default'
	 */
	private static function normalize_method( $method ) {
		$method = strtolower( trim( (string) $method ) );

		if ( in_array( $method, array( 'default', 'wp_search', 'search' ), true ) ) {
			return 'default';
		}

		return 'manually';
	}

	/**
	 * Build the WordPress plugin-install search URL for a term.
	 *
	 * @param string $term Search term (e.g. a plugin name).
	 * @return string
	 */
	public static function search_url( $term ) {
		$search = rawurlencode( '"' . $term . '" coolplugins' );

		return admin_url( 'plugin-install.php?s=' . $search . '&tab=search&type=term' );
	}

	/**
	 * Determine install/activate state for a plugin slug.
	 *
	 * @param string $slug Plugin folder slug.
	 * @return array{state:string,label:string}
	 */
	private static function state_for( $slug ) {
		$main_file = $slug . '/' . $slug . '.php';
		$is_active = is_plugin_active( $main_file );
		$installed = $is_active;

		if ( ! $is_active ) {
			foreach ( self::installed() as $file => $data ) {
				if ( dirname( $file ) === $slug ) {
					$installed = true;
					$is_active = is_plugin_active( $file );
					break;
				}
			}
		}

		if ( $is_active ) {
			return array( 'state' => 'activated', 'label' => __( 'Activated', 'default' ) );
		}
		if ( $installed ) {
			return array( 'state' => 'activate', 'label' => __( 'Activate', 'default' ) );
		}
		return array( 'state' => 'install', 'label' => __( 'Install Free', 'default' ) );
	}

	/**
	 * Cached get_plugins().
	 *
	 * @return array
	 */
	private static function installed() {
		if ( null === self::$installed ) {
			self::$installed = function_exists( 'get_plugins' ) ? get_plugins() : array();
		}
		return self::$installed;
	}
}
