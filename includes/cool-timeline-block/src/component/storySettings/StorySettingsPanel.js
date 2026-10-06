import { __ } from '@wordpress/i18n';
import StorySettingsFields from './StorySettingsFields.js';

const { PanelBody } = wp.components;

/**
 * "Story settings" panel for the selected Timeline Story's sidebar.
 * `collapsible={false}` renders a plain heading instead of the toggle panel.
 * Other props are passed straight through to StorySettingsFields.
 */
const StorySettingsPanel = ({ collapsible = true, ...fieldProps }) => {
	const title = (
		<span className="ctlb-panel-title">
			<span className="ctlb-panel-title-badge">
				<span className="dashicons dashicons-admin-generic"></span>
			</span>
			{__('Story settings', 'timeline-block')}
		</span>
	);

	return (
		<div id="ctlb-story-setting-panel">
			{collapsible ? (
				<PanelBody initialOpen={true} title={title}>
					<StorySettingsFields {...fieldProps} />
				</PanelBody>
			) : (
				<div className="ctlb-static-panel">
					<div className="ctlb-static-panel-title">{title}</div>
					<StorySettingsFields {...fieldProps} />
				</div>
			)}
		</div>
	);
};

export default StorySettingsPanel;
