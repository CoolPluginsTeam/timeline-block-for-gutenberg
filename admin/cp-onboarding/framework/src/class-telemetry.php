<?php
/**
 * Aggregated, anonymous, on-site telemetry counters.
 *
 * Same lightweight design as the original (no HTTP, no PII, non-autoloaded
 * option) but instance-based and prefixed, so each plugin keeps its own
 * counters in its own option key instead of sharing one global.
 *
 * Storage shape (per plugin):
 *   [ 'counters' => [ 'event.bucket' => int ], 'selection' => '...',
 *     'first_seen' => ts, 'last_seen' => ts ]
 *
 * @package CoolPlugins\Onboarding
 */

namespace CoolPlugins\Onboarding;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Telemetry counter store.
 */
final class Telemetry {

	const MAX_KEYS          = 50;
	const DEFAULT_SELECTION = 'default';

	/**
	 * @var Config
	 */
	private $config;

	/**
	 * Allowed events. Plugins can extend via filter.
	 *
	 * @var string[]
	 */
	private $allowed_events;

	/**
	 * Allowed buckets per event. Unknown -> 'other'.
	 *
	 * @var array
	 */
	private $allowed_buckets;

	/**
	 * @param Config $config Plugin config.
	 */
	public function __construct( Config $config ) {
		$this->config = $config;

		$prefix = $config->prefix();

		$this->allowed_events = (array) apply_filters(
			$prefix . '_onboarding_events',
			array( 'method_picked', 'cta_clicked', 'cta_failed', 'addon_install_clicked', 'video_played', 'substep_picked' )
		);

		$this->allowed_buckets = (array) apply_filters(
			$prefix . '_onboarding_buckets',
			array()
		);
	}

	/**
	 * Option key for this plugin's telemetry.
	 *
	 * @return string
	 */
	private function key() {
		return $this->config->option( 'telemetry' );
	}

	/**
	 * Track an event.
	 *
	 * @param string $event  Event name.
	 * @param string $bucket Optional bucket.
	 * @return bool
	 */
	public function track( $event, $bucket = '' ) {
		$event = sanitize_key( (string) $event );

		if ( ! in_array( $event, $this->allowed_events, true ) ) {
			return false;
		}

		$bucket = $this->normalize_bucket( $event, (string) $bucket );
		$ckey   = '' === $bucket ? $event : $event . '.' . $bucket;

		$data = $this->read();

		if ( ! isset( $data['counters'][ $ckey ] ) && count( $data['counters'] ) >= self::MAX_KEYS ) {
			return false;
		}

		$data['counters'][ $ckey ] = isset( $data['counters'][ $ckey ] )
			? (int) $data['counters'][ $ckey ] + 1
			: 1;

		$now = time();
		if ( empty( $data['first_seen'] ) ) {
			$data['first_seen'] = $now;
		}
		$data['last_seen'] = $now;

		$this->write( $data );
		return true;
	}

	/**
	 * All counters.
	 *
	 * @return array
	 */
	public function get_counters() {
		$data = $this->read();
		return isset( $data['counters'] ) ? (array) $data['counters'] : array();
	}

	/**
	 * Single counter.
	 *
	 * @param string $event  Event.
	 * @param string $bucket Bucket.
	 * @return int
	 */
	public function get_count( $event, $bucket = '' ) {
		$ckey     = '' === $bucket ? $event : $event . '.' . $bucket;
		$counters = $this->get_counters();
		return isset( $counters[ $ckey ] ) ? (int) $counters[ $ckey ] : 0;
	}

	/**
	 * Persist current selection.
	 *
	 * @param string $selection Selection.
	 * @return bool
	 */
	public function set_selection( $selection ) {
		$selection         = sanitize_key( (string) $selection );
		$data              = $this->read();
		$data['selection'] = $selection;
		$this->write( $data );
		return true;
	}

	/**
	 * Get current selection.
	 *
	 * @return string
	 */
	public function get_selection() {
		$data = $this->read();
		return isset( $data['selection'] ) ? (string) $data['selection'] : self::DEFAULT_SELECTION;
	}

	/**
	 * Physically persist the default selection if nothing stored yet.
	 *
	 * @return void
	 */
	public function seed_selection() {
		$stored = get_option( $this->key(), false );
		if ( is_array( $stored ) && isset( $stored['selection'] ) ) {
			return;
		}
		$this->write( $this->read() );
	}

	/**
	 * Reset/clear.
	 *
	 * @return void
	 */
	public function reset() {
		delete_option( $this->key() );
	}

	/**
	 * Read option with safe defaults.
	 *
	 * @return array
	 */
	private function read() {
		$data = get_option( $this->key(), array() );

		if ( ! is_array( $data ) ) {
			$data = array();
		}
		if ( ! isset( $data['counters'] ) || ! is_array( $data['counters'] ) ) {
			$data['counters'] = array();
		}
		if ( ! isset( $data['selection'] ) ) {
			$data['selection'] = self::DEFAULT_SELECTION;
		}
		return $data;
	}

	/**
	 * Write option, non-autoloaded.
	 *
	 * @param array $data Data.
	 * @return void
	 */
	private function write( array $data ) {
		update_option( $this->key(), $data, false );
	}

	/**
	 * Normalize a bucket against the per-event allow-list.
	 *
	 * @param string $event  Event.
	 * @param string $bucket Raw bucket.
	 * @return string
	 */
	private function normalize_bucket( $event, $bucket ) {
		// Event takes no constrained bucket — accept the sanitized value as-is
		// (still bounded by MAX_KEYS) unless an allow-list is defined.
		if ( ! isset( $this->allowed_buckets[ $event ] ) ) {
			return sanitize_key( $bucket );
		}

		$bucket = sanitize_key( $bucket );
		if ( '' === $bucket ) {
			return 'other';
		}

		return in_array( $bucket, $this->allowed_buckets[ $event ], true ) ? $bucket : 'other';
	}
}
