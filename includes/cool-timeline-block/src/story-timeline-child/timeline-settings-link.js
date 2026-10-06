import { __ } from '@wordpress/i18n';

const { Button } = wp.components;
const { BlockIcon } = wp.blockEditor;
const { useSelect, useDispatch } = wp.data;

const TIMELINE_BLOCK = 'cp-timeline/content-timeline-block';

// Same glyph as chevronRight in @wordpress/icons (not bundled with this plugin).
const ChevronRight = () => (
	<svg className="ctlb-settings-link__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
		<path d="M10.6 6L9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z" />
	</svg>
);

/**
 * Sidebar row on a selected Timeline Story that jumps to its parent
 * timeline's settings. Renders nothing when there is no parent timeline.
 *
 * @param {Object} props          Component props.
 * @param {string} props.clientId Client ID of the selected story block.
 */
const TimelineSettingsLink = ({ clientId }) => {
	const { parentClientId, blockIcon } = useSelect(
		(select) => {
			const parents = select('core/block-editor').getBlockParentsByBlockName(clientId, TIMELINE_BLOCK);
			return {
				// Ordered root -> closest, so the closest parent is last.
				parentClientId: parents[parents.length - 1],
				blockIcon: wp.blocks.getBlockType(TIMELINE_BLOCK)?.icon,
			};
		},
		[clientId]
	);
	const { selectBlock } = useDispatch('core/block-editor');

	if (!parentClientId) {
		return null;
	}

	return (
		<div className="ctlb-settings-link-wrap">
			<Button
				className="ctlb-settings-link"
				aria-label={__('Open timeline settings', 'timeline-block')}
				onClick={() => selectBlock(parentClientId)}
			>
				<span className="ctlb-settings-link__icon">
					<BlockIcon icon={blockIcon?.src || blockIcon} />
				</span>
				<span className="ctlb-settings-link__text">
					<span className="ctlb-settings-link__title">{__('Timeline settings', 'timeline-block')}</span>
					<span className="ctlb-settings-link__subtitle">{__('Layout, style, animation', 'timeline-block')}</span>
				</span>
				<ChevronRight />
			</Button>
		</div>
	);
};

export default TimelineSettingsLink;
