import { __ } from '@wordpress/i18n';
import { IconPicker } from '../Icons/index.js';
import StorySidePicker from '../sidePicker/StorySidePicker.js';
import { ProLock, ProBadge, ProOptionButton } from '../ProFeature.js';

const { Button, ButtonGroup, TextControl, ToggleControl } = wp.components;
const { useSelect } = wp.data;

const TIMELINE_BLOCK = 'cp-timeline/content-timeline-block';

/**
 * Fields of the "Story settings" panel. Pro-only options are shown locked.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes    Attributes of the story block.
 * @param {Function} props.setAttributes Updates the story block attributes.
 * @param {string}   props.clientId      Client ID of the story block.
 */
const StorySettingsFields = ({ attributes, setAttributes, clientId }) => {
	// Story side only applies to a vertical, both-sides timeline (stories alternate).
	const parentAttrs = useSelect(
		(sel) => {
			const editor = sel('core/block-editor');
			const parents = editor.getBlockParentsByBlockName(clientId, TIMELINE_BLOCK);
			const parentId = parents[parents.length - 1];
			return parentId ? editor.getBlockAttributes(parentId) : null;
		},
		[clientId]
	);
	const showStorySide = !!parentAttrs && 'vertical' === parentAttrs.timelineLayout && 'both-sided' === parentAttrs.timelineDesign;

	return (
		<>
			<TextControl
				label={__('Date or step label', 'timeline-block')}
				placeholder={__('Date/Steps', 'timeline-block')}
				value={attributes.t_date === 'ctl_date_undefined' ? '' : (attributes.t_date || '')}
				onChange={(value) => {
					const date = '' === value ? 'ctl_date_undefined' : value;
					setAttributes({ t_date: date });
				}}
				help={__("Use a date, year, or step, like 'Step 1'.", 'timeline-block')}
				__nextHasNoMarginBottom={true}
			/>
			<div className="ctlb-pro-field-header">
				<span className="timeline-block-settings-labels">{__('Year marker', 'timeline-block')}</span>
				<ProBadge />
			</div>
			<ProLock hideBadge compact>
				<div className="ctlb-field">
					<div className="cp-timeline-block-style-settings ctlb-row">
						<label className="timeline-block-settings-labels">
							{__('Show year marker', 'timeline-block')}
						</label>
						<ToggleControl
							className="timeline-block-Orientation_checkbox"
							checked={false}
							onChange={() => {}}
							__nextHasNoMarginBottom={true}
						/>
					</div>
					<span className="ctlb-field-help">{__('Adds a year badge above this story.', 'timeline-block')}</span>
				</div>
				<TextControl
					label={__('Year marker text', 'timeline-block')}
					placeholder="2020"
					value=""
					onChange={() => {}}
					__nextHasNoMarginBottom={true}
				/>
			</ProLock>
			<hr className="ctlb-section-divider"></hr>
			<div className="ctlb-row ctlb-row--stack">
				<div className="timeline-block-settings-labels">{__('Story icon', 'timeline-block')}</div>
				<ButtonGroup className="ctlb_icon_buttons_control ctlb-segmented">
					<Button
						isSmall
						onClick={() => setAttributes({ iconToggle: 'false' })}
						className={`ctlb-segmented-btn${['false', 'dot'].includes(attributes.iconToggle) ? ' is-active' : ''}`}
					>
						{__('Dot', 'timeline-block')}
					</Button>
					<Button
						isSmall
						onClick={() => setAttributes({ iconToggle: 'true' })}
						className={`ctlb-segmented-btn${['true', 'icon'].includes(attributes.iconToggle) ? ' is-active' : ''}`}
					>
						{__('Icon', 'timeline-block')}
					</Button>
					<ProOptionButton>{__('Image', 'timeline-block')}</ProOptionButton>
					<ProOptionButton>{__('Text', 'timeline-block')}</ProOptionButton>
				</ButtonGroup>
			</div>
			{['true', 'icon'].includes(attributes.iconToggle) ? (
				<div className="timeline-block-iconpicker">
					<IconPicker icon={attributes.icon} onChange={(v) => setAttributes({ icon: v })} />
				</div>
			) : null}
			<hr className="ctlb-section-divider"></hr>
			<div className="ctlb-pro-field-header">
				<span className="timeline-block-settings-labels">{__('Media type', 'timeline-block')}</span>
				<ProBadge />
			</div>
			<ProLock hideBadge compact>
				<ButtonGroup className="ctl_media_control ctlb-segmented">
					<Button isSmall className="ctlb-segmented-btn is-active">
						<span className="dashicons dashicons-format-image"></span>
						<span className="ctlb-segmented-btn-label">{__('Image', 'timeline-block')}</span>
					</Button>
					<Button isSmall className="ctlb-segmented-btn">
						<span className="dashicons dashicons-video-alt3"></span>
						<span className="ctlb-segmented-btn-label">{__('Video', 'timeline-block')}</span>
					</Button>
					<Button isSmall className="ctlb-segmented-btn">
						<span className="dashicons dashicons-images-alt2"></span>
						<span className="ctlb-segmented-btn-label">{__('Gallery', 'timeline-block')}</span>
					</Button>
				</ButtonGroup>
			</ProLock>
			{showStorySide && (
				<>
					<hr className="ctlb-section-divider"></hr>
					<StorySidePicker
						compact
						single
						label={__('Story side', 'timeline-block')}
						helpText={__('Overrides the timeline layout for this story.', 'timeline-block')}
						value={attributes.blockPosition}
						onChange={(side) => setAttributes({ blockPosition: side, block_position_active: true })}
					/>
				</>
			)}
		</>
	);
};

export default StorySettingsFields;
