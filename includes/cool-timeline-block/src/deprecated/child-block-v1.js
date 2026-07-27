import renderSVG from "../component/icon/renderIcon.js"
import {__} from '@wordpress/i18n';
import attributes from "../story-timeline-child/attributes.js";
const {useBlockProps} = wp.blockEditor;
const {RichText} = wp.blockEditor;

export default {
		attributes:{...attributes,
			t_date : {
				type: "string",
				default: '1/1/2019',
			},
			time_heading:{
				type: "string",
				default:__( "Timeline Heading ",'timeline-block' ),
			},
			time_desc:{
				type: "string",
				default:__( "This is Timeline description, you can change me anytime click here ",'timeline-block' ),
			},
			timeLineImage:{
                type:"string",
                default:"none",
            },
		},
		save: props => {
			const Save = (props) => {
				const {
					icon,
					t_date,
					time_heading,
					time_desc,
					iconToggle,
					iconColor,
					blockPosition,
					timeLineImage,
					imageAlt
				} = props.attributes

				const StoryDetail = () => (
					<div className="story-details">
						{timeLineImage !== "none" ?
							<div className={`story-image`}>
								<img src={timeLineImage} alt={imageAlt} />
							</div>
							:
							null}
						<div className="story-content">
							<RichText.Content
								tagName="h3"
								value={time_heading}
							/>
							<RichText.Content
								tagName="p"
								value={time_desc}
							/>
						</div>
					</div>
				)
				const StoryTime = () => (
					<RichText.Content
						tagName="p"
						value={t_date}
					/>
				)
				const icon_div = <div className="timeline-block-icon">
					{icon !== "" && iconToggle == "true" ? <span className="timeline-block-render-icon" style={{fill: iconColor}}>{renderSVG(icon)}</span> : null}
				</div>

				return (
					<div className={"timeline-content icon-" + iconToggle + " "}>
						<div className={" timeline-block-timeline ctl-row  position-" + blockPosition + ""}>
							<div className="ctl-6 timeline-block-time">
								<div className="story-time">
									{StoryTime()}
								</div>
							</div>
							{icon_div}
							<div className="ctl-6 timeline-block-detail">
								{StoryDetail()}
							</div>
						</div>
					</div>
				)
			}

			const chilblockProps = useBlockProps.save({className: 'swiper-slide'});

			return (
				<div {...chilblockProps}>
					<Save {...props} />
				</div>
			)
		}
	};
