import "../story-timeline/style.scss"
import attributes from "../story-timeline/attributes.js"
import { __ } from '@wordpress/i18n';

import deprContentTimelineStyle from "./styling-v2.js"
const { useBlockProps,InnerBlocks } = wp.blockEditor;
export default {
		attributes:{...attributes,subHeadLineHeightType: {
            type: "string",
            default: "em",
        }},
		save: props => {
			const Save = (props) => {
				const {
                    block_id,
                    timelineLayout,
                    Orientation,
                    timelineDesign,
                    slidePerView
                } = props.attributes
                return (
                    <div className={"cool-timeline-block-" + String(block_id ?? "").replace(/[^a-zA-Z0-9_-]/g, "") + ""}>
                        <style dangerouslySetInnerHTML={{ __html: deprContentTimelineStyle(props) }} />
                        <div className={"cool-" + (['vertical', 'horizontal'].includes(timelineLayout) ? timelineLayout : 'vertical') + "-timeline-body " + (['both-sided', 'one-sided'].includes(timelineDesign) ? timelineDesign : 'both-sided') + " " + (['left', 'right'].includes(Orientation) ? Orientation : 'left') + ""}>
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