/**
 * BLOCK: Timeline - Save Block
 */
import contentTimelineStyle from "./styling.js"

const {
	InnerBlocks,
} = wp.blockEditor

export default function Save(props) {
	const {
		block_id,
		timelineLayout,
		Orientation,
		timelineDesign,
	} = props.attributes

	return (
		<div className={`cool-timeline-block-${String(block_id ?? '').replace(/[^a-zA-Z0-9_-]/g, '')}`}>
			{'' !== contentTimelineStyle( props ) &&
			<style dangerouslySetInnerHTML={{ __html: contentTimelineStyle( props ) }}/>
			}
			<div className={`cool-${['vertical', 'horizontal'].includes(timelineLayout) ? timelineLayout : 'vertical'}-timeline-body ctlb-wrapper ${['both-sided', 'one-sided'].includes(timelineDesign) ? timelineDesign : 'both-sided'} ${['left', 'right'].includes(Orientation) ? Orientation : 'left'}`}>
		 		<div className="cool-timeline-block-list">
				 <InnerBlocks.Content />
		 		</div>
		 	</div> 
		</div>
	)
}
