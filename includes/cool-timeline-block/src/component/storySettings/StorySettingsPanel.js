import { __ } from '@wordpress/i18n';
import StorySettingsFields from './StorySettingsFields.js';
import { PRO_UPGRADE_STORY_URL, ProUpgradeContext } from '../ProFeature.js';

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
		<ProUpgradeContext.Provider value={PRO_UPGRADE_STORY_URL}>
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
		</ProUpgradeContext.Provider>
	);
};

export default StorySettingsPanel;
