import { __ } from '@wordpress/i18n';

const { Button } = wp.components;

export const PRO_UPGRADE_URL =
	'https://cooltimeline.com/plugin/timeline-block-pro/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=upgrade&utm_content=timeline_block';

export const openProUpgrade = () => {
	window.open(PRO_UPGRADE_URL, '_blank', 'noopener,noreferrer');
};

export const ProBadge = ({ className = '' }) => (
	<span className={`ctlb-pro-badge ${className}`.trim()}>{__('Pro', 'timeline-block')}</span>
);

export const ProOptionButton = ({ children, className = '', isActive = false }) => (
	<Button
		isSmall
		className={`ctlb-segmented-btn ctlb-segmented-btn--pro${isActive ? ' is-active' : ''} ${className}`.trim()}
		onClick={(event) => {
			event.preventDefault();
			openProUpgrade();
		}}
	>
		<span className="ctlb-segmented-btn-label">{children}</span>
		<span className="ctlb-segmented-btn-pro-mark" aria-hidden="true">
			<ProBadge />
		</span>
	</Button>
);

export const ProLock = ({ children, hideBadge = false, compact = false, className = '' }) => (
	<div
		className={`ctlb-pro-lock${compact ? ' ctlb-pro-lock--compact' : ''} ${className}`.trim()}
		onClick={(event) => {
			event.preventDefault();
			event.stopPropagation();
			openProUpgrade();
		}}
		onKeyDown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openProUpgrade();
			}
		}}
		role="link"
		tabIndex={0}
		aria-label={__('Upgrade to Timeline Block Pro', 'timeline-block')}
	>
		{!hideBadge && (
			<span className="ctlb-pro-lock__badge">
				<ProBadge />
			</span>
		)}
		<div className="ctlb-pro-lock__controls">{children}</div>
		<span className="ctlb-pro-lock__hint">{__('Upgrade to Pro', 'timeline-block')}</span>
	</div>
);

export const ProUpgradeLink = () => (
	<a
		className="ctlb-pro-upgrade"
		href={PRO_UPGRADE_URL}
		target="_blank"
		rel="noopener noreferrer"
	>
		{__('Upgrade to Timeline Block Pro', 'timeline-block')}
	</a>
);
