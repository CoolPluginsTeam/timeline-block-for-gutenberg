<?php
/**
 * Framework bootstrap — registers a lightweight autoloader for the
 * CoolPlugins\Onboarding namespace. No Composer required.
 *
 * @package CoolPlugins\Onboarding
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'CPO_ONBOARDING_DIR' ) ) {
	define( 'CPO_ONBOARDING_DIR', __DIR__ );
}

spl_autoload_register(
	static function ( $class ) {
		$prefix = 'CoolPlugins\\Onboarding\\';
		$len    = strlen( $prefix );

		if ( 0 !== strncmp( $prefix, $class, $len ) ) {
			return;
		}

		// CoolPlugins\Onboarding\Demo_Generator -> src/class-demo-generator.php
		$relative = substr( $class, $len );
		$relative = strtolower( str_replace( '_', '-', $relative ) );
		$file     = CPO_ONBOARDING_DIR . '/src/class-' . $relative . '.php';

		if ( is_readable( $file ) ) {
			require_once $file;
		}
	}
);
