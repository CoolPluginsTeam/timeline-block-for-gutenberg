import "../story-timeline/style.scss"
import attributes from "../story-timeline/attributes.js"
import { __ } from '@wordpress/i18n';

import deprContentTimelineStyle from "./styling-v1.js"
const { useBlockProps,InnerBlocks } = wp.blockEditor;

export default {
		attributes,
		save: props => {
			const Save = (props) => {
				const {
                    block_id,
                    timelineLayout,
                    Orientation,
                    timelineDesign,
                    slidePerView
                } = props.attributes
                const InnerBlocksLength = () => {
                    return wp.data.select("core/block-editor").getBlockCount(block_id);
                }
                return (
                    <div className = {"cool-timeline-block-"+block_id+""}>
                        <style dangerouslySetInnerHTML={{ __html: deprContentTimelineStyle( props ) }} scoped="true"/>
                        <div className={"cool-"+timelineLayout+"-timeline-body " +timelineDesign+" "+Orientation+""}>
                             <div className="cool-timeline-block-list" >
                                    <InnerBlocks.Content />
                             </div>
                         </div> 
                    </div>
                )
			}
            const blockProps = useBlockProps.save({className: 'Cool-Content-Timeline'});
            return(
            <div {...blockProps}>
            <Save { ...props } />
            </div> );
		}
	}