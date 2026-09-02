<?php
/**
 * Shared onboarding page view.
 *
 * Rendered for every plugin/edition. Reads everything from $config; contains
 * no plugin-specific copy, slugs or URLs. CSS classes use the shared `cpo-`
 * prefix; brand colors are injected as CSS variables by the framework.
 *
 * Available vars:
 *   @var \CoolPlugins\Onboarding\Config         $config
 *   @var \CoolPlugins\Onboarding\Telemetry|null $telemetry
 *
 * @package CoolPlugins\Onboarding
 */

namespace CoolPlugins\Onboarding;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.WP.I18n.TextDomainMismatch, WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound, WordPress.NamingConventions.PrefixAllGlobals.DynamicHooknameFound

$cpo_methods = $config->visible_methods();
$cpo_first   = $config->default_method_key( $cpo_methods );
$cpo_links   = $config->links();
$cpo_mode    = isset( $mode ) ? $mode : 'dashboard';
$cpo_td      = $config->text_domain();

// Allowed HTML for a method's raw `content` field (post context strips <button>).
$cpo_content_allowed = array(
	'div'    => array( 'class' => true ),
	'h2'     => array( 'class' => true ),
	'h3'     => array( 'class' => true ),
	'p'      => array( 'class' => true ),
	'span'   => array( 'class' => true ),
	'strong' => array(),
	'em'     => array(),
	'ul'     => array( 'class' => true ),
	'ol'     => array( 'class' => true ),
	'li'     => array( 'class' => true ),
	'a'      => array( 'href' => true, 'target' => true, 'rel' => true, 'class' => true ),
	'button' => array( 'type' => true, 'class' => true ),
	'svg'    => array(
		'xmlns'       => true,
		'viewbox'     => true,
		'width'       => true,
		'height'      => true,
		'aria-hidden' => true,
		'focusable'   => true,
	),
	'path'   => array( 'd' => true ),
);

// Resolve cross-sell addons once (drops condition-failing addons) and index by slug,
// so a method can surface its own addon control inside its content tab.
$cpo_addons         = Addons::resolve( $config->addons(), $config );
$cpo_addons_by_group = array();

foreach ( $cpo_addons as $cpo_a ) {

	$cpo_group = ! empty( $cpo_a['group'] ) ? $cpo_a['group'] : '';
	if ( '' !== $cpo_group ) {
		if ( ! isset( $cpo_addons_by_group[ $cpo_group ] ) ) {
			$cpo_addons_by_group[ $cpo_group ] = array();
		}
		$cpo_addons_by_group[ $cpo_group ][] = $cpo_a;
	}
}
$cpo_addons_in_content = array(); // Groups shown inside a content tab → skipped in the bottom section.

/**
 * Pick one addon card per method group (sequential flow).
 *
 * 1. Free plugin install/activate while it is not active.
 * 2. After free is active, Pro activate when Pro is installed but inactive.
 * 3. After free is active, Buy Pro when Pro is not installed.
 *
 * @param string $group Method type key (e.g. 'elementor-based').
 * @return array|null
 */
$cpo_pick_addon_for_group = function ( $group ) use ( $cpo_addons_by_group ) {
	if ( '' === $group || ! isset( $cpo_addons_by_group[ $group ] ) ) {
		return null;
	}

	$free_plugin  = null;
	$pro_activate = null;
	$pro_buy      = null;

	foreach ( $cpo_addons_by_group[ $group ] as $cpo_addon ) {
		$slug = isset( $cpo_addon['slug'] ) ? $cpo_addon['slug'] : '';
		$is_pro_slug = in_array(
			$slug,
			array(
				'timeline-widget-addon-for-elementor-pro',
				'cp-timeline-module-pro-for-divi',
			),
			true
		);

		if ( ! empty( $cpo_addon['type'] ) && 'pro' === $cpo_addon['type'] ) {
			$pro_buy = $cpo_addon;
		} elseif ( $is_pro_slug ) {
			$pro_activate = $cpo_addon;
		} else {
			$free_plugin = $cpo_addon;
		}
	}

	if ( $free_plugin && 'activated' !== $free_plugin['state'] ) {
		return $free_plugin;
	}

	if ( $pro_activate && 'activated' !== $pro_activate['state'] ) {
		return $pro_activate;
	}

	if ( $pro_buy ) {
		return $pro_buy;
	}

	return null;
};

/**
 * Render an addon's action buttons (install/activate, setup guide, learn more).
 *
 * Shared by the in-content control and the bottom cross-sell section.
 *
 * @param array $cpo_addon Resolved addon data from Addons::resolve().
 * @return void
 */
$cpo_addon_actions = function ( $cpo_addon ) {
	?>
	<?php if ( ! empty( $cpo_addon['type'] ) && 'pro' === $cpo_addon['type'] ) : ?>
		<?php // Pro promotion: external upgrade link only (no install/activate/setup). ?>
		<?php if ( ! empty( $cpo_addon['upgrade_url'] ) ) : ?>
			<a class="cpo-button cpo-button-primary cpo-upgrade"
				href="<?php echo esc_url( $cpo_addon['upgrade_url'] ); ?>"
				target="_blank" rel="noopener noreferrer"><?php echo esc_html( $cpo_addon['label'] ); ?></a>
		<?php endif; ?>
		<?php if ( ! empty( $cpo_addon['learn_more'] ) ) : ?>
			<a class="cpo-button cpo-button-secondary" href="<?php echo esc_url( $cpo_addon['learn_more'] ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html__( 'Learn More', $cpo_td ); ?></a>
		<?php endif; ?>
		<?php return; ?>
	<?php endif; ?>
	<?php if ( 'default' === $cpo_addon['install_method'] && 'activated' !== $cpo_addon['state'] && ! empty( $cpo_addon['search_url'] ) ) : ?>
		<?php // WordPress plugin-search method: a plain link to the native install screen (no inline AJAX). ?>
		<a class="cpo-button cpo-button-primary cpo-search-plugin"
			href="<?php echo esc_url( $cpo_addon['search_url'] ); ?>"
			data-slug="<?php echo esc_attr( $cpo_addon['slug'] ); ?>"><?php echo esc_html( $cpo_addon['label'] ); ?></a>
	<?php else : ?>
		<?php // 'manually' method (custom AJAX inline install) and the 'activated' state for both methods. ?>
		<button type="button"
			class="cpo-button cpo-button-primary cpo-install-plugin <?php echo ( 'activated' === $cpo_addon['state'] ) ? 'is-activated' : ''; ?>"
			data-slug="<?php echo esc_attr( $cpo_addon['slug'] ); ?>"
			data-nonce="<?php echo esc_attr( $cpo_addon['nonce'] ); ?>"
			data-state="<?php echo esc_attr( $cpo_addon['state'] ); ?>"
			data-setup-url="<?php echo esc_url( $cpo_addon['setup_url'] ); ?>"
			<?php disabled( 'activated', $cpo_addon['state'] ); ?>>
			<span class="cpo-install-label"><?php echo esc_html( $cpo_addon['label'] ); ?></span>
			<span class="spinner" aria-hidden="true"></span>
		</button>
	<?php endif; ?>
	<?php if ( 'activated' === $cpo_addon['state'] && ! empty( $cpo_addon['setup_url'] ) ) : ?>
		<a class="cpo-button cpo-button-secondary cpo-setup-guide" href="<?php echo esc_url( $cpo_addon['setup_url'] ); ?>"><?php echo esc_html__( 'Check Setup Guide', $cpo_td ); ?></a>
	<?php endif; ?>
	<?php if ( ! empty( $cpo_addon['learn_more'] ) ) : ?>
		<a class="cpo-button cpo-button-secondary" href="<?php echo esc_url( $cpo_addon['learn_more'] ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html__( 'Explore Layouts', $cpo_td ); ?><span class="dashicons dashicons-arrow-right-alt2 cpo-button-chevron" aria-hidden="true"></span></a>
	<?php endif; ?>
	<?php
};

/**
 * Render a single addon card (icon, copy, actions).
 *
 * @param array $cpo_addon Resolved addon data.
 * @return void
 */
$cpo_render_addon_card = function ( $cpo_addon ) use ( $cpo_addon_actions ) {
	?>
	<?php if ( ! empty( $cpo_addon['label_text'] ) ) : ?>
		<p class="cpo-addon-section-label"><?php echo esc_html( $cpo_addon['label_text'] ); ?></p>
	<?php endif; ?>
	<div class="cpo-addon-card<?php echo ( ! empty( $cpo_addon['type'] ) && 'pro' === $cpo_addon['type'] ) ? ' cpo-addon-card--pro' : ''; ?>">
		<?php if ( ! empty( $cpo_addon['icon'] ) ) : ?>
		<div class="cpo-addon-icon" aria-hidden="true">
			<img width="48" height="48" src="<?php echo esc_url( $cpo_addon['icon'] ); ?>" alt="">
		</div>
		<?php endif; ?>
		<div class="cpo-addon-body">
			<h4><?php echo esc_html( $cpo_addon['title'] ); ?></h4>
			<?php if ( ! empty( $cpo_addon['description'] ) ) : ?>
				<p><?php echo esc_html( $cpo_addon['description'] ); ?></p>
			<?php endif; ?>
		</div>
		<div class="cpo-addon-actions">
			<?php $cpo_addon_actions( $cpo_addon ); ?>
		</div>
	</div>
	<?php
};
?>
<div class="wrap cpo-onboarding-page" data-js-global="<?php echo esc_attr( $config->js_global() ); ?>" data-mode="<?php echo esc_attr( $cpo_mode ); ?>">
	<div class="cpo-onboarding-wrapper">
<?php
// Per-mode body override: a plugin can replace the whole body (e.g. real dashboard
// content later) by returning a non-null string. Default keeps the shared markup.
$cpo_body = apply_filters( $config->prefix() . '_onboarding_body_' . $cpo_mode, null, $config, $cpo_mode );
if ( null !== $cpo_body ) :
	echo wp_kses_post( $cpo_body );
else :
?>

		<div class="cpo-header">
			<h1><?php echo esc_html( $config->page( 'heading' ) ); ?></h1>
			<?php if ( $config->page( 'subheading' ) ) : ?>
				<p><?php echo esc_html( $config->page( 'subheading' ) ); ?></p>
			<?php endif; ?>
		</div>

		<?php if ( $config->show_chooser() ) : ?>
		<div class="cpo-box cpo-method-selection">
			<?php if ( $config->page( 'chooser' ) ) : ?>
				<h2><?php echo esc_html( $config->page( 'chooser' ) ); ?></h2>
			<?php endif; ?>

			<div class="cpo-method-tabs" role="radiogroup" aria-label="<?php echo esc_attr( $config->page( 'chooser' ) ); ?>">
				<?php foreach ( $cpo_methods as $cpo_key => $cpo_method ) : ?>
					<?php $cpo_active = ( $cpo_key === $cpo_first );
					
					?>
					<button type="button"
						class="cpo-method-card<?php echo $cpo_active ? ' active' : ''; ?><?php echo ! empty( $cpo_method['_locked'] ) ? ' is-locked' : ''; ?>"
						data-type="<?php echo esc_attr( $cpo_method['type'] ); ?>"
						data-panel="<?php echo esc_attr( $cpo_key ); ?>"
						role="radio"
						aria-checked="<?php echo $cpo_active ? 'true' : 'false'; ?>">
						<div class="cpo-method-top">
							<h3><?php echo esc_html( $cpo_method['title'] ); ?></h3>
							<?php if ( ! empty( $cpo_method['_locked'] ) ) : ?>
								<span class="cpo-badge cpo-badge-pro"><?php echo esc_html__( 'Pro', $cpo_td ); ?></span>
							<?php elseif ( ! empty( $cpo_method['badge'] ) ) : ?>
								<span class="cpo-badge"><?php echo esc_html( $cpo_method['badge'] ); ?></span>
							<?php endif; ?>
						</div>
						<?php if ( ! empty( $cpo_method['description'] ) ) : ?>
							<p class="cpo-method-desc"><?php echo esc_html( $cpo_method['description'] ); ?></p>
						<?php endif; ?>
						<?php if ( ! empty( $cpo_method['best_for'] ) ) : ?>
							<p class="cpo-best-for"><strong><?php echo esc_html__( 'Best for', $cpo_td ); ?>:</strong> <?php echo esc_html( $cpo_method['best_for'] ); ?></p>
						<?php endif; ?>
					</button>
				<?php endforeach; ?>
			</div>
		</div>
		<?php endif; ?>

		<?php foreach ( $cpo_methods as $cpo_key => $cpo_method ) : ?>
			<?php $cpo_active = ( $cpo_key === $cpo_first ); ?>
			<div class="cpo-box cpo-panel<?php echo $cpo_active ? ' active' : ''; ?>" id="cpo-panel-<?php echo esc_attr( $cpo_key ); ?>" data-panel-id="<?php echo esc_attr( $cpo_key ); ?>">

				<?php if ( ! empty( $cpo_method['content'] ) ) : ?>
					<div class="cpo-content-container">
						<div class="cpo-content-inner-left">
					<?php echo wp_kses( $cpo_method['content'], $cpo_content_allowed ); ?>
					</div>
					<div class="cpo-content-inner-right">
					<?php
					// Surface this method's own addon control inside its content tab (full edition only).
					// Method-level visibility (the `condition` callable) is handled in Config::visible_methods(),
					// so a method that reaches this branch has already passed its condition.
					$cpo_method_group = ! empty( $cpo_method['type'] ) ? $cpo_method['type'] : '';
					$cpo_picked_addon = $cpo_pick_addon_for_group( $cpo_method_group );
					if ( 'full' === $config->edition() && $cpo_picked_addon ) :
						$cpo_addons_in_content[ $cpo_method_group ] = true;
						?>
						<div class="cpo-content-addon">
							<div class="cpo-cta-bar">
								<?php $cpo_addon_actions( $cpo_picked_addon ); ?>
							</div>
							<div class="cpo-inline-notice" role="alert" hidden></div>
						</div>
					<?php endif; ?>
					</div>
					</div>
				<?php else : ?>

				<div class="cpo-content-header">
					<h2><?php echo esc_html( $cpo_method['description'] ); ?></h2>
					<?php if ( ! empty( $cpo_method['content_badge'] ) ) : ?>
						<span class="cpo-content-badge"><?php echo esc_html( $cpo_method['content_badge'] ); ?></span>
					<?php endif; ?>
				</div>

				<div class="cpo-content-grid">

					<?php if ( ! empty( $cpo_method['video']['id'] ) ) : ?>
					<div class="cpo-video">
						<?php if ( ! empty( $cpo_method['video']['title'] ) ) : ?>
							<h3><?php echo esc_html__( 'Watch how it works', $cpo_td ); ?></h3>
						<?php endif; ?>
						<button type="button"
							class="cpo-video-box"
							data-type="<?php echo esc_attr( $cpo_method['type'] ); ?>"
							data-video-id="<?php echo esc_attr( $cpo_method['video']['id'] ); ?>"
							<?php if ( ! empty( $cpo_method['video']['start'] ) ) : ?>data-start="<?php echo (int) $cpo_method['video']['start']; ?>"<?php endif; ?>
							aria-label="<?php echo esc_attr( ! empty( $cpo_method['video']['title'] ) ? $cpo_method['video']['title'] : $cpo_method['title'] ); ?>">
							<img class="cpo-video-thumb"
								src="<?php
								$cpo_video_thumb = ! empty( $cpo_method['video']['thumb'] )
									? $cpo_method['video']['thumb']
									: 'https://img.youtube.com/vi/' . rawurlencode( $cpo_method['video']['id'] ) . '/hqdefault.jpg';
								$cpo_video_thumb_fallback = 'https://img.youtube.com/vi/' . rawurlencode( $cpo_method['video']['id'] ) . '/hqdefault.jpg';
								echo esc_url( $cpo_video_thumb );
								?>"
								onerror="this.onerror=null;this.src='<?php echo esc_js( $cpo_video_thumb_fallback ); ?>';"
								alt="<?php echo esc_attr( $cpo_method['title'] ); ?>">
							<span class="cpo-video-overlay">
								<span class="cpo-play" aria-hidden="true">
									<svg viewBox="0 0 68 48" focusable="false" aria-hidden="true">
										<path class="cpo-play-bg" d="M66.52 7.74a8.07 8.07 0 0 0-5.68-5.7C55.81.7 34 .7 34 .7s-21.81 0-26.84 1.34a8.07 8.07 0 0 0-5.68 5.7A85.4 85.4 0 0 0 .16 24a85.4 85.4 0 0 0 1.32 16.26 8.07 8.07 0 0 0 5.68 5.7C12.19 47.3 34 47.3 34 47.3s21.81 0 26.84-1.34a8.07 8.07 0 0 0 5.68-5.7A85.4 85.4 0 0 0 67.84 24a85.4 85.4 0 0 0-1.32-16.26z" fill="#ff0000"/>
										<path d="M27.2 33.6 45.12 24 27.2 14.4v19.2z" fill="#fff"/>
									</svg>
								</span>
								<?php if ( ! empty( $cpo_method['video']['title'] ) ) : ?>
									<span class="cpo-video-title"><?php echo esc_html( $cpo_method['video']['title'] ); ?></span>
								<?php endif; ?>
							</span>
							<?php if ( ! empty( $cpo_method['video']['duration'] ) ) : ?>
								<span class="cpo-video-duration"><?php echo esc_html( $cpo_method['video']['duration'] ); ?></span>
							<?php endif; ?>
						</button>
					</div>
					<?php endif; ?>

					<div class="cpo-guide">
						<?php if ( ! empty( $cpo_method['steps'] ) ) : ?>
							<div class="cpo-guide-heading">
								<h3><?php echo esc_html__( 'Quick Setup Guide', $cpo_td ); ?></h3>
								<?php if ( ! empty( $cpo_method['time_estimate'] ) ) : ?>
									<span class="cpo-time-badge">⏱ <?php echo esc_html( $cpo_method['time_estimate'] ); ?></span>
								<?php endif; ?>
							</div>

							<?php foreach ( $cpo_method['steps'] as $cpo_i => $cpo_step ) : ?>
								<div class="cpo-step">
									<div class="cpo-step-number" aria-hidden="true"><?php echo (int) ( $cpo_i + 1 ); ?></div>
									<div class="cpo-step-content">
										<strong><?php echo esc_html( $cpo_step['title'] ); ?></strong>
										<?php if ( ! empty( $cpo_step['desc'] ) ) : ?>
											<p><?php echo wp_kses( $cpo_step['desc'], $cpo_content_allowed ); ?></p>
										<?php endif; ?>
									</div>
								</div>
							<?php endforeach; ?>
						<?php endif; ?>

						<div class="cpo-cta-bar">
							<?php if ( ! empty( $cpo_method['_locked'] ) && ! empty( $cpo_method['upgrade_url'] ) ) : ?>
								<a class="button button-primary cpo-button-large cpo-upgrade"
									href="<?php echo esc_url( $cpo_method['upgrade_url'] ); ?>"
									target="_blank" rel="noopener noreferrer">
									<?php echo esc_html( ! empty( $cpo_method['upgrade_label'] ) ? $cpo_method['upgrade_label'] : __( 'Unlock in Pro →', $cpo_td ) ); ?>
								</a>
							<?php elseif ( ! empty( $cpo_method['cta']['label'] ) ) : ?>
								<button type="button" class="cpo-button cpo-button-primary cpo-button-large cpo-create" data-method-type="<?php echo esc_attr( $cpo_method['type'] ); ?>">
									<span class="cpo-btn-label"><?php echo esc_html( $cpo_method['cta']['label'] ); ?></span>
									<span class="spinner" aria-hidden="true"></span>
								</button>
							<?php endif; ?>

							<?php if ( ! empty( $cpo_method['secondary']['url'] ) ) : ?>
								<a class="cpo-button cpo-button-secondary" target="_blank" rel="noopener noreferrer" href="<?php echo esc_url( $cpo_method['secondary']['url'] ); ?>">
									<?php echo esc_html( $cpo_method['secondary']['label'] ); ?>
									<span class="dashicons dashicons-arrow-right-alt2 cpo-button-chevron" aria-hidden="true"></span>
								</a>
							<?php endif; ?>
						</div>
						<div class="cpo-inline-notice" role="alert" hidden></div>
					</div>

				</div>

				<?php endif; ?>
			</div>
		<?php endforeach; ?>

		<?php
		// --- Cross-sell addon cards (per-method, switches with active editor selection) ---
		// Addons already surfaced inside a content tab are skipped here to avoid duplication.
		if ( ! empty( $cpo_methods ) ) :
			foreach ( $cpo_methods as $cpo_key => $cpo_method ) :
				$cpo_method_group = ! empty( $cpo_method['type'] ) ? $cpo_method['type'] : '';
				if ( isset( $cpo_addons_in_content[ $cpo_method_group ] ) ) {
					continue;
				}
				$cpo_picked_addon = $cpo_pick_addon_for_group( $cpo_method_group );
				if ( ! $cpo_picked_addon ) {
					continue;
				}
				$cpo_active = ( $cpo_key === $cpo_first );
				?>
		<div class="cpo-addon-section cpo-addon-switch<?php echo $cpo_active ? ' active' : ''; ?>" data-addon-for="<?php echo esc_attr( $cpo_key ); ?>">
			<?php $cpo_render_addon_card( $cpo_picked_addon ); ?>
		</div>
				<?php
			endforeach;
		endif;
		?>

		<?php
		// --- Footer link cards (docs / support / tutorials) ---
		// The footer follows the active editor selection: each method may define its
		// own `footer` (same shape as the global `links.footer`); methods without one
		// fall back to the global footer. JS toggles the matching block with the panel.
		$cpo_global_footer = isset( $cpo_links['footer'] ) && is_array( $cpo_links['footer'] ) ? $cpo_links['footer'] : array();

		/**
		 * Render a set of footer cards.
		 *
		 * @param array $cpo_cards Footer card definitions.
		 * @return void
		 */
		$cpo_render_footer_cards = function ( $cpo_cards ) use ( $cpo_content_allowed ) {
			foreach ( $cpo_cards as $cpo_card ) :
				?>
			<div class="cpo-footer-card">
				<?php if ( ! empty( $cpo_card['icon'] ) ) : ?>
					<div class="cpo-footer-icon" aria-hidden="true"><?php echo wp_kses( $cpo_card['icon'], $cpo_content_allowed ); ?></div>
				<?php endif; ?>
				<h3><?php echo esc_html( $cpo_card['title'] ); ?></h3>

				<?php if ( ! empty( $cpo_card['text'] ) ) : ?>
				<?php echo wp_kses( $cpo_card['text'], $cpo_content_allowed ); ?>

				<?php endif; ?>

				<?php if ( ! empty( $cpo_card['links'] ) && is_array( $cpo_card['links'] ) ) : ?>
					<div class="cpo-footer-links-container">
					<?php foreach ( $cpo_card['links'] as $cpo_link ) :
						$cls = isset( $cpo_link['class'] ) ? $cpo_link['class'] : '';
						$show_chevron = false !== strpos( $cls, 'cpo-button' );
						?>
						<a class="<?php echo esc_attr( $cls ); ?>" href="<?php echo esc_url( $cpo_link['url'] ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html( $cpo_link['label'] ); ?><?php if ( $show_chevron ) : ?><span class="dashicons dashicons-arrow-right-alt2 cpo-button-chevron" aria-hidden="true"></span><?php endif; ?></a>
					<?php endforeach; ?>
					</div>
				<?php endif; ?>
			</div>
				<?php
			endforeach;
		};

		if ( ! empty( $cpo_methods ) ) :
			foreach ( $cpo_methods as $cpo_key => $cpo_method ) :
				$cpo_method_footer = ( ! empty( $cpo_method['footer'] ) && is_array( $cpo_method['footer'] ) )
					? $cpo_method['footer']
					: $cpo_global_footer;
				if ( empty( $cpo_method_footer ) ) {
					continue;
				}
				$cpo_active = ( $cpo_key === $cpo_first );
				?>
		<footer class="cpo-footer<?php echo $cpo_active ? ' active' : ''; ?>" data-footer-for="<?php echo esc_attr( $cpo_key ); ?>">
			<?php $cpo_render_footer_cards( $cpo_method_footer ); ?>
		</footer>
				<?php
			endforeach;
		elseif ( ! empty( $cpo_global_footer ) ) :
			// No methods at all: render the global footer once.
			?>
		<footer class="cpo-footer active">
			<?php $cpo_render_footer_cards( $cpo_global_footer ); ?>
		</footer>
		<?php endif; ?>

<?php endif; // End per-mode body override. ?>
	</div>
</div>
