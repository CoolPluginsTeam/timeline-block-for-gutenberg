<?php
/**
 * Cool Plugins Onboarding Framework — versioned loader.
 *
 * This file is bundled IDENTICALLY inside every plugin that ships the
 * framework. WordPress.org has no shared-dependency mechanism, so several
 * active plugins may each carry their own copy of this framework at different
 * versions. Loading two copies would fatal with "Cannot redeclare class".
 *
 * The fix: every copy registers itself in a global list with its version and
 * path. On `after_setup_theme` (priority 1, before plugins build their UI) we
 * pick the HIGHEST version present and load only that one. Older plugins then
 * transparently run on the newest framework, so a single framework fix ships
 * to all of them as soon as any one plugin updates.
 *
 * Each plugin calls:
 *
 *     require_once __DIR__ . '/cool-plugins-onboarding/loader.php';
 *     cpo_onboarding_register( '1.0.0', __DIR__ . '/cool-plugins-onboarding' );
 *
 * ...then, once loaded, instantiates the framework with its own config (see
 * examples/cool-timeline.php).
 *
 * @package CoolPlugins\Onboarding
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'cpo_onboarding_register' ) ) {

	/**
	 * Register a bundled framework copy as a load candidate.
	 *
	 * @param string $version Semantic version of THIS bundled copy.
	 * @param string $base_dir Absolute path to the framework package directory
	 *                         (the folder containing /framework).
	 * @return void
	 */
	function cpo_onboarding_register( $version, $base_dir ) {
		if ( ! isset( $GLOBALS['cpo_onboarding_candidates'] ) ) {
			$GLOBALS['cpo_onboarding_candidates'] = array();
		}

		$GLOBALS['cpo_onboarding_candidates'][] = array(
			'version'  => (string) $version,
			'bootstrap' => rtrim( $base_dir, '/\\' ) . '/framework/bootstrap.php',
		);

		// Register the resolver once. Priority 1 so the framework is available
		// before plugins register menus/assets on admin_menu (priority 9+).
		if ( ! has_action( 'after_setup_theme', 'cpo_onboarding_resolve' ) ) {
			add_action( 'after_setup_theme', 'cpo_onboarding_resolve', 1 );
		}
	}

	/**
	 * Pick the highest registered version and load it exactly once.
	 *
	 * @return void
	 */
	function cpo_onboarding_resolve() {
		if ( defined( 'CPO_ONBOARDING_VERSION' ) ) {
			return; // Already resolved this request.
		}

		$candidates = isset( $GLOBALS['cpo_onboarding_candidates'] )
			? $GLOBALS['cpo_onboarding_candidates']
			: array();

		if ( empty( $candidates ) ) {
			return;
		}

		usort(
			$candidates,
			static function ( $a, $b ) {
				return version_compare( $b['version'], $a['version'] );
			}
		);

		foreach ( $candidates as $winner ) {
			if ( is_readable( $winner['bootstrap'] ) ) {
				define( 'CPO_ONBOARDING_VERSION', $winner['version'] );
				require_once $winner['bootstrap'];

				/**
				 * Fires once the framework is loaded and its classes are
				 * available. Plugins hook here to instantiate the framework
				 * with their own config.
				 *
				 * @param string $version The loaded framework version.
				 */
				do_action( 'cpo_onboarding_loaded', $winner['version'] );
				return;
			}
		}
	}
}
