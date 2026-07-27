/**
 * Register: as Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
// //  Import CSS.
// import ".././style.scss"
import "./style.scss"
import v1 from "../deprecated/parent-block-v1.js"
import v2 from "../deprecated/parent-block-v2.js"
import Save from "./save.js"
import attributes from "./attributes.js"
import Edit from "./edit.js"
import { CoolTMIcon } from '../component/icon/insertorIcon.js';
import CtbMigration from './migration.js';
// Components
import { __ } from '@wordpress/i18n';

// Register block controls
const {
	registerBlockType
} = wp.blocks
const { useBlockProps } = wp.blockEditor;
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const { withSelect } = wp.data;
const { compose, createHigherOrderComponent } = wp.compose;

/**
 * Override the default block element to add	wrapper props.
 *
 * @param  {Function} BlockListBlock Original component
 * @return {Function} Wrapped component
 */

const enhance = compose(
	withSelect((select) => {
		return {
			selected: select('core/block-editor').getSelectedBlock(),
		};
	})
);
/**
 * Add custom attributes to selected blocks
 *
 * @param {Function} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withcontentTimeline = createHigherOrderComponent((BlockEdit) => {
	return enhance(({ ...props }) => {
		return (
			<Fragment>
				<BlockEdit {...props} />
			</Fragment>
		);
	});
}, 'withcontentTimeline');

registerBlockType("cp-timeline/content-timeline-block", {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('Timeline Block', 'timeline-block'), // Block title.
	apiVersion: 3,
	description: __("Create an ultimate timeline easily and share your story or roadmap.", 'timeline-block'),
	keywords: [
		__("Content Timeline", 'timeline-block'),
		__("Timeline", 'timeline-block'),
		__("History Timeline", 'timeline-block'),
		__("Roadmap Timeline", 'timeline-block'),
	],
	icon: CoolTMIcon,
	supports: {
		anchor: true,
	},
	attributes,
	deprecated: [v1,v2],
	edit: props => {
		const blockProps = useBlockProps({
			className: 'Cool-Content-Timeline-' + props.attributes.timelineDesign,
		});
		return (
			<div {...blockProps}>
				<Edit {...props} />
			</div>);
	},
	save: props => {
		const blockProps = useBlockProps.save({ className: 'Cool-Content-Timeline' });
		return (
			<div {...blockProps}>
				<Save {...props} />
			</div>);
	},
	providesContext: {
		'cp-timeline/timelineLayout': 'timelineLayout',
		'cp-timeline/timelineDesign': 'timelineDesign',
	},
	example: {
		attributes: {
			backgroundColor: 'green',
			opacity: 1,
			padding: 10,
			radius: 10,
			isPreview: true,
		}
	},
	transforms: CtbMigration,
})
addFilter(
	'editor.BlockEdit',
	'cp-timeline/content-timeline-block',
	withcontentTimeline
);
