/**
 * Sidebar footer. Free: "View demos" + "Rate" on top, a solid "Upgrade now" below.
 * Pro: a solid "View demos" + "Rate", no upgrade button.
 */
import { __ } from '@wordpress/i18n';

const DEMOS = {
	vertical: 'https://coolplugins.net/demos/vertical-timeline/',
	horizontal: 'https://coolplugins.net/demos/horizontal-timeline/',
	tabs: 'https://coolplugins.net/demos/tabs-timeline/',
};
const REVIEW_URL = 'https://wordpress.org/support/plugin/timeline-block/reviews/#new-post';
const UPGRADE_URL = 'https://cooltimeline.com/plugin/timeline-block-pro/';

// The block stores the Tabs layout as "modern-vertical".
const getKey = (layout) => {
	const key = 'modern-vertical' === layout ? 'tabs' : layout;
	return DEMOS[key] ? key : 'vertical';
};

const withUtm = (url, button, layout) =>
	`${url}?utm_source=block-editor&utm_medium=sidebar-footer&utm_campaign=timeline&utm_content=${button}-${getKey(layout)}`;

// `external` is the same glyph as in @wordpress/icons (not bundled with this plugin); the crown is a plain path.
const Icon = ({ size, d }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<path d={d} />
	</svg>
);
const EXTERNAL = 'M18.2 17c0 .7-.6 1.2-1.2 1.2H7c-.7 0-1.2-.6-1.2-1.2V7c0-.7.6-1.2 1.2-1.2h3.2V4.2H7C5.5 4.2 4.2 5.5 4.2 7v10c0 1.5 1.2 2.8 2.8 2.8h10c1.5 0 2.8-1.2 2.8-2.8v-3.6h-1.5V17zM14.9 3v1.5h3.7l-6.4 6.4 1.1 1.1 6.4-6.4v3.7h1.5V3h-6.3z';
const CROWN = 'M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z';

const Link = ({ href, className, label, children }) => (
	<a className={`ctl-btn ${className}`} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
		{children}
	</a>
);

const SidebarFooter = ({ layout, isPro }) => (
	<div className="ctl-sidebar-footer">
		<div className="ctl-sidebar-footer__row">
			<Link href={withUtm(DEMOS[getKey(layout)], 'demos', layout)} className={isPro ? 'ctl-btn--solid' : 'ctl-btn--outline'}>
				<Icon size={14} d={EXTERNAL} />
				<span className="ctl-btn__label">{__('View demos', 'timeline-block')}</span>
			</Link>
			<Link href={REVIEW_URL} className="ctl-btn--outline ctl-btn--rate" label={__('Rate Timeline Block on WordPress.org', 'timeline-block')}>
				<span className="ctl-btn__label">{__('Rate', 'timeline-block')}</span>
				<span className="ctl-stars" aria-hidden="true">★★★★★</span>
			</Link>
		</div>
		{!isPro && (
			<Link href={withUtm(UPGRADE_URL, 'upgrade', layout)} className="ctl-btn--solid">
				<Icon size={16} d={CROWN} />
				<span className="ctl-btn__label">{__('Upgrade now', 'timeline-block')}</span>
			</Link>
		)}
	</div>
);

export default SidebarFooter;
