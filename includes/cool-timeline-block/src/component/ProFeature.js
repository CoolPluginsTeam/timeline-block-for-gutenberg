import { __ } from '@wordpress/i18n';

const { Button } = wp.components;
const { createContext, useContext } = wp.element;

export const PRO_UPGRADE_URL =
	'https://cooltimeline.com/plugin/timeline-block-pro-for-gutenberg/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=upgrade&utm_content=timeline_block';

export const PRO_UPGRADE_STYLE_URL =
	'https://cooltimeline.com/plugin/timeline-block-pro-for-gutenberg/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=block_editor_style';

export const PRO_UPGRADE_ADVANCED_URL =
	'https://cooltimeline.com/plugin/timeline-block-pro-for-gutenberg/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=block_editor_advanced';

export const PRO_UPGRADE_STORY_URL =
	'https://cooltimeline.com/plugin/timeline-block-pro-for-gutenberg/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=block_editor_story';

export const PRO_STORY_ICONS_DEMO_URL =
	'https://cooltimeline.com/block/story-icons-text-timeline/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=demo&utm_content=block_editor_story';

export const PRO_STORY_MEDIA_DEMO_URL =
	'https://cooltimeline.com/block/media-slideshow-timeline/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=demo&utm_content=block_editor_story_media';

export const ProUpgradeContext = createContext(PRO_UPGRADE_URL);

export const openProUpgrade = (url) => {
	window.open(url || PRO_UPGRADE_URL, '_blank', 'noopener,noreferrer');
};

export const ProBadge = ({ className = '' }) => (
	<span className={`ctlb-pro-badge ${className}`.trim()}>{__('Pro', 'timeline-block')}</span>
);

export const ProOptionButton = ({ children, className = '', isActive = false, url }) => {
	const contextUrl = useContext(ProUpgradeContext);
	const targetUrl = url || contextUrl || PRO_UPGRADE_URL;

	return (
		<Button
			isSmall
			className={`ctlb-segmented-btn ctlb-segmented-btn--pro${isActive ? ' is-active' : ''} ${className}`.trim()}
			onClick={(event) => {
				event.preventDefault();
				openProUpgrade(targetUrl);
			}}
		>
			<span className="ctlb-segmented-btn-label">{children}</span>
			<span className="ctlb-segmented-btn-pro-mark" aria-hidden="true">
				<ProBadge />
			</span>
		</Button>
	);
};

export const ProLock = ({ children, hideBadge = false, compact = false, className = '', url }) => {
	const contextUrl = useContext(ProUpgradeContext);
	const targetUrl = url || contextUrl || PRO_UPGRADE_URL;

	const handleClick = (event) => {
		event.preventDefault();
		event.stopPropagation();
		openProUpgrade(targetUrl);
	};

	return (
		<div
			className={`ctlb-pro-lock${compact ? ' ctlb-pro-lock--compact' : ''} ${className}`.trim()}
			onClick={handleClick}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					handleClick(event);
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
};

export const ProUpgradeLink = ({ url }) => {
	const contextUrl = useContext(ProUpgradeContext);
	const targetUrl = url || contextUrl || PRO_UPGRADE_URL;

	return (
		<a
			className="ctlb-pro-upgrade"
			href={targetUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			{__('Upgrade to Timeline Block Pro', 'timeline-block')}
		</a>
	);
};
