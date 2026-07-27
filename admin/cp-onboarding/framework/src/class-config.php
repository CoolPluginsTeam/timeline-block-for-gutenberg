<?php
/**
 * Per-plugin configuration object.
 *
 * Every plugin (Cool Timeline, Events Shortcode, Timeline Widget, Events
 * Widget for Elementor — each in Free/Pro, Full/Liter) passes one of these.
 * Nothing about plugin identity, copy, URLs, demo data or telemetry buckets
 * is hardcoded in the framework — it all comes from here.
 *
 * @package CoolPlugins\Onboarding
 */

namespace CoolPlugins\Onboarding;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Immutable-ish config wrapper around a validated args array.
 */
final class Config {

	/**
	 * Resolved arguments.
	 *
	 * @var array
	 */
	private $args;

	/**
	 * @param array $args Raw config from the plugin.
	 */
	public function __construct( array $args ) {
		$this->args = $this->validate( wp_parse_args( $args, $this->defaults() ) );
	}

	/**
	 * Default config shape. Documents every supported key.
	 *
	 * @return array
	 */
	private function defaults() {
		return array(
			// --- Identity (required) ---
			'slug'        => '',          // 'cool-timeline'
			'prefix'      => '',          // 'ctl' — namespaces options, actions, JS global.
			'text_domain' => '',          // Plugin text domain (strings are passed pre-translated).
			'version'     => '1.0.0',
			'plugin_dir'  => '',          // trailing-slashed absolute path.
			'plugin_url'  => '',          // trailing-slashed URL.
			'parent_slug' => '',          // Parent admin menu slug to attach "Getting Started" under.

			// --- Edition / tier gating ---
			'edition'     => 'full',      // 'full' | 'liter'
			'tier'        => 'free',      // 'free' | 'pro'
			'capability'  => 'manage_options',

			// --- Gating of the whole screen ---
			'new_user_option' => '',      // Option name; default '{prefix}_is_new_user' = 'yes'.

			// --- Branding (CSS variables, injected inline so one stylesheet serves all) ---
			'colors'      => array(
				'primary'      => '#2e9e9d',
				'primary_dark' => '#257f7e',
			),

			// --- Page copy ---
			'page'        => array(
				'menu_title' => '',   // 'Getting Started'
				'heading'    => '',   // 'Welcome to Cool Timeline!'
				'subheading' => '',
				'chooser'    => '',   // 'Choose how you want to create your timeline'
			),

			// Method chooser/tabs visibility:
			//   'auto'  => show only when more than one method is visible (default).
			//   true    => always show.
			//   false   => never show (liter: just render the panel/video/steps).
			'show_chooser' => 'auto',

			// --- Methods / steps (data-driven panels) ---
			'methods'     => array(),

			// --- One-click demo generator (optional) ---
			'demo'        => array(),

			// --- Cross-sell addon cards (optional) ---
			'addons'      => array(),

			// --- Footer links ---
			'links'       => array(),     // 'docs', 'support', 'faq', 'demo', 'tutorials' (each url or array).

			// --- Telemetry ---
			'telemetry'   => true,
		);
	}

	/**
	 * Light validation / coercion. Fails soft — never fatals an admin page.
	 *
	 * @param array $args Merged args.
	 * @return array
	 */
	private function validate( array $args ) {
		$args['slug']        = sanitize_key( $args['slug'] );
		$args['prefix']      = sanitize_key( $args['prefix'] );
		$args['text_domain'] = sanitize_key( $args['text_domain'] );
		$args['edition']     = in_array( $args['edition'], array( 'full', 'liter' ), true ) ? $args['edition'] : 'full';
		$args['tier']        = in_array( $args['tier'], array( 'free', 'pro' ), true ) ? $args['tier'] : 'free';

		if ( '' === $args['new_user_option'] ) {
			$args['new_user_option'] = $args['prefix'] . '_is_new_user';
		}

		$args['methods'] = is_array( $args['methods'] ) ? $args['methods'] : array();
		$args['addons']  = is_array( $args['addons'] ) ? $args['addons'] : array();
		$args['links']   = is_array( $args['links'] ) ? $args['links'] : array();

		return $args;
	}

	/* --- Simple getters --- */

	public function slug() {
		return $this->args['slug'];
	}

	public function prefix() {
		return $this->args['prefix'];
	}

	public function text_domain() {
		return $this->args['text_domain'];
	}

	public function version() {
		return $this->args['version'];
	}

	public function plugin_dir() {
		return $this->args['plugin_dir'];
	}

	public function plugin_url() {
		return $this->args['plugin_url'];
	}

	public function parent_slug() {
		return $this->args['parent_slug'];
	}

	public function edition() {
		return $this->args['edition'];
	}

	public function tier() {
		return $this->args['tier'];
	}

	public function is_pro() {
		return 'pro' === $this->args['tier'];
	}

	public function is_liter() {
		return 'liter' === $this->args['edition'];
	}

	public function capability() {
		return $this->args['capability'];
	}

	public function colors() {
		return $this->args['colors'];
	}

	public function page( $key = null ) {
		if ( null === $key ) {
			return $this->args['page'];
		}
		return isset( $this->args['page'][ $key ] ) ? $this->args['page'][ $key ] : '';
	}

	/**
	 * Whether to render the method chooser/tabs.
	 *
	 * 'auto' (default) shows it only when more than one method is visible.
	 *
	 * @return bool
	 */
	public function show_chooser() {
		$setting = $this->args['show_chooser'];
		if ( 'auto' === $setting ) {
			return count( $this->visible_methods() ) > 1;
		}
		return (bool) $setting;
	}

	public function methods() {
		return $this->args['methods'];
	}

	public function addons() {
		return $this->args['addons'];
	}

	public function demo() {
		return is_array( $this->args['demo'] ) ? $this->args['demo'] : array();
	}

	public function links() {
		return $this->args['links'];
	}

	public function link( $key ) {
		return isset( $this->args['links'][ $key ] ) ? $this->args['links'][ $key ] : '';
	}

	public function telemetry_enabled() {
		return (bool) $this->args['telemetry'];
	}

	public function new_user_option() {
		return $this->args['new_user_option'];
	}

	/* --- Derived names: everything is prefixed so two plugins never collide --- */

	/**
	 * Build a namespaced AJAX action name.
	 *
	 * @param string $name Short action name ('prepare', 'track', 'install').
	 * @return string
	 */
	public function ajax_action( $name ) {
		return $this->args['prefix'] . '_onboarding_' . $name;
	}

	/**
	 * Build a namespaced option key.
	 *
	 * @param string $name Short option name.
	 * @return string
	 */
	public function option( $name ) {
		return $this->args['prefix'] . '_onboarding_' . $name;
	}

	/**
	 * Asset/nonce/JS-global handle, unique per plugin.
	 *
	 * @param string $suffix Optional suffix.
	 * @return string
	 */
	public function handle( $suffix = '' ) {
		$base = $this->args['prefix'] . '-onboarding';
		return '' === $suffix ? $base : $base . '-' . $suffix;
	}

	/**
	 * The JS object name localized into the page.
	 *
	 * @return string
	 */
	public function js_global() {
		// e.g. ctlOnboardingData
		return $this->args['prefix'] . 'OnboardingData';
	}

	/**
	 * Methods visible for the current edition/tier.
	 *
	 * - Edition gate: a method limited to certain editions is dropped in others.
	 * - Tier gate: 'pro' methods stay visible in free builds (rendered as an
	 *   upsell by the view) unless explicitly marked hide_in_free.
	 *
	 * @return array
	 */
	public function visible_methods() {
		$edition = $this->edition();
		$is_pro  = $this->is_pro();

		$visible = array();

		foreach ( $this->methods() as $key => $method ) {
			if ( ! empty( $method['editions'] )
				&& is_array( $method['editions'] )
				&& ! in_array( $edition, $method['editions'], true ) ) {
				continue;
			}

			if ( ! $is_pro && ! empty( $method['hide_in_free'] ) ) {
				continue;
			}

			// Optional gating: a method may declare a condition callable; hide it when false.
			if ( isset( $method['condition'] ) && is_callable( $method['condition'] ) ) {
				if ( ! function_exists( 'is_plugin_active' ) ) {
					require_once ABSPATH . 'wp-admin/includes/plugin.php';
				}
				if ( ! call_user_func( $method['condition'] ) ) {
					continue;
				}
			}

			// Flag for the view: locked upsell when a pro method runs in a free build.
			$method['_locked'] = ( ! $is_pro && ! empty( $method['tier'] ) && 'pro' === $method['tier'] );

			$visible[ $key ] = $method;
		}

		return $visible;
	}

	/**
	 * Resolve which method tab should be active on first paint.
	 *
	 * Honors a `method` query arg (e.g. from an addon "Check Setup Guide" link)
	 * when it matches a visible method; otherwise falls back to the first method.
	 *
	 * @param array $visible_methods Output of visible_methods().
	 * @return string Method key, or empty string when no methods are visible.
	 */
	public function default_method_key( array $visible_methods ) {
		if ( empty( $visible_methods ) ) {
			return '';
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display-only tab selection.
		$requested = isset( $_GET['method'] ) ? sanitize_key( wp_unslash( $_GET['method'] ) ) : '';

		if ( '' !== $requested && isset( $visible_methods[ $requested ] ) ) {
			return $requested;
		}

		return (string) key( $visible_methods );
	}
}
