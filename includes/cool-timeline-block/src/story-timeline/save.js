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
		<div className = {"cool-timeline-block-"+block_id+""}>
			{'' !== contentTimelineStyle( props ) &&
			<style dangerouslySetInnerHTML={{ __html: contentTimelineStyle( props ) }}/>
			}
			<div className={`cool-${timelineLayout}-timeline-body ctlb-wrapper ${timelineDesign} ${Orientation}`}>
		 		<div className="cool-timeline-block-list">
				 <InnerBlocks.Content />
		 		</div>
		 	</div> 
		</div>
	)
}
