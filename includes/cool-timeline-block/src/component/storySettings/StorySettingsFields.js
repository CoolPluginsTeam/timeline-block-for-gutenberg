import { __ } from '@wordpress/i18n';
import { IconPicker } from '../Icons/index.js';
import { ProLock, ProBadge, ProOptionButton } from '../ProFeature.js';

const { Fragment } = wp.element;
const { Button, ButtonGroup, TextControl, ToggleControl } = wp.components;

/**
 * Fields of the "Story settings" panel. Pro-only options are shown locked.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes     Attributes of the story block.
 * @param {Function} props.setAttributes  Updates the story block attributes.
 * @param {string}   props.timelineLayout Layout of the parent timeline.
 * @param {string}   props.timelineDesign Design of the parent timeline.
 */
const StorySettingsFields = ({ attributes, setAttributes, timelineLayout, timelineDesign }) => (
	<>
		<div className="ctlb-pro-field-header">
			<span className="timeline-block-settings-labels">{__('Year label', 'timeline-block')}</span>
			<ProBadge />
		</div>
		<ProLock hideBadge compact>
			<div className="cp-timeline-block-style-settings ctlb-row">
				<label className="timeline-block-settings-labels">
					{__('Show year label', 'timeline-block')}
				</label>
				<ToggleControl
					className="timeline-block-Orientation_checkbox"
					checked={false}
					onChange={() => {}}
					__nextHasNoMarginBottom={true}
				/>
			</div>
			<TextControl
				label={__('Year label', 'timeline-block')}
				placeholder={__('Year/Label', 'timeline-block')}
				value=""
				onChange={() => {}}
				__nextHasNoMarginBottom={true}
			/>
		</ProLock>
		<TextControl
			label={__('Date or step label', 'timeline-block')}
			placeholder={__('Date/Steps', 'timeline-block')}
			value={attributes.t_date === 'ctl_date_undefined' ? '' : (attributes.t_date || '')}
			onChange={(value) => {
				const date = '' === value ? 'ctl_date_undefined' : value;
				setAttributes({ t_date: date });
			}}
			__nextHasNoMarginBottom={true}
		/>
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
		{timelineLayout == 'vertical' && timelineDesign == 'both-sided' && attributes.storyPositionHide ? (
			<Fragment>
				<hr className="ctlb-section-divider" />
				<div className="timeline-block-settings-labels">{__('Story position', 'timeline-block')}</div>
				<ButtonGroup className="cool-timeline-content-alignment-buttons ctlb-segmented">
					<Button
						isSmall
						onClick={() => setAttributes({ blockPosition: 'left', block_position_active: true })}
						className={`ctlb-segmented-btn${attributes.blockPosition == 'left' ? ' is-active' : ''}`}
					>
						{__('Left', 'timeline-block')}
					</Button>
					<Button
						isSmall
						onClick={() => setAttributes({ blockPosition: 'right', block_position_active: true })}
						className={`ctlb-segmented-btn${attributes.blockPosition == 'right' ? ' is-active' : ''}`}
					>
						{__('Right', 'timeline-block')}
					</Button>
				</ButtonGroup>
			</Fragment>
		) : null}
		<hr className="ctlb-section-divider" />
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
	</>
);

export default StorySettingsFields;
