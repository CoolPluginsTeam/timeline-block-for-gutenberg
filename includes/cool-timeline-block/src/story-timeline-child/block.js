/**
 * BLOCK: Content Timeline Child
 */
import "./style.scss"
import Save from "./save.js"
import attributes from "./attributes.js"
import v1 from "../deprecated/child-block-v1.js";
import Edit from "./edit.js"
import { CoolStoryIcon } from '../component/icon/insertorIcon.js';
const { useBlockProps } = wp.blockEditor;
import { __ } from '@wordpress/i18n';
const {
	registerBlockType
} = wp.blocks

registerBlockType("cp-timeline/content-timeline-block-child", {
	title: __('Single Story Details', 'timeline-block'), // Block title.
	apiVersion: 3,
	icon: CoolStoryIcon,
	keywords: [
		__("Content Timeline", 'timeline-block'),
		__("Timeline", 'timeline-block'),
	],
	supports: {
		inserter: false,
	},
	attributes,
	deprecated: [v1],
	usesContext: ['cp-timeline/timelineDesign', 'cp-timeline/timelineLayout'],
	edit: props => {
		const chilblockProps = useBlockProps({
			className: 'swiper-slide',
		});
		return (
			<div {...chilblockProps}>
				<Edit {...props} />
			</div>
		)
	},
	save: props => {
		const chilblockProps = useBlockProps.save({ className: 'swiper-slide' });
		return (
			<div {...chilblockProps}>
				<Save {...props} />
			</div>
		)
	}
})