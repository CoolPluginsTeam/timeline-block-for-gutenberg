/**
 * BLOCK: Content timeline child - Save Block
 */

import { IconPickerItem } from "../component/Icons/index.js";
import DOMPurify from "dompurify";
import { __ } from "@wordpress/i18n";
const { InnerBlocks, RichText } = wp.blockEditor;

const filterDate = (data) => {
	return DOMPurify.sanitize(data);
};

export default function Save(props) {
	const {
		icon,
		t_date,
		time_heading,
		time_desc,
		iconToggle,
		iconColor,
		time_image,
		blockPosition,
		timeLineImage,
		imageAlt,
		headingTag,
		wodpressBlock,
	} = props.attributes;
	const timeline_title =
		"undefined" === typeof time_heading
			? __("Timeline Heading ", "timeline-block")
			: time_heading;
	const timeline_desc =
		"undefined" === typeof time_desc
			? __(
					"This is Timeline description, you can change me anytime click here",
					"timeline-block"
			  )
			: time_desc;

	const StoryDetail = () => (
		<div className="story-details">
			{!["none", ""].includes(timeLineImage) && !wodpressBlock ? (
				<div className={`story-image`}>
					<img
						src={/^https?:\/\/[^\s]+$/i.test(String(timeLineImage ?? '')) ? timeLineImage : ''}
						alt={imageAlt}
						className={time_image.id && Number.isInteger(Number(time_image.id)) ? `wp-image-${Number(time_image.id)}` : null}
					/>
				</div>
			) : null}
			<div className="story-content">
				{!wodpressBlock ? (
					<>
						<RichText.Content
							className="timeline-block_title"
							tagName={['h2', 'h3', 'h4', 'h5', 'h6'].includes(headingTag) ? headingTag : 'h3'}
							value={timeline_title}
						/>
						<div className="timeline-block_desc">
							<RichText.Content tagName="p" value={timeline_desc} />
						</div>
					</>
				) : (
					<InnerBlocks.Content />
				)}
			</div>
		</div>
	);

	const StoryTime = () => (
		<RichText.Content
			tagName="p"
			value={
				"ctl_date_undefined" === filterDate(t_date)
					? "1/1/2019"
					: filterDate(t_date)
			}
		/>
	);
	const icon_div = (
		<div className="timeline-block-icon">
			{icon !== "" && iconToggle == "true" ? (
				<span
					className="timeline-block-render-icon"
					style={{ fill: iconColor }}
				>
					<IconPickerItem icon={icon} size={24} color={iconColor} />
				</span>
			) : (
				<svg
					stroke="currentColor"
					fill="currentColor"
					strokeWidth="0"
					viewBox="0 0 512 512"
					height="1em"
					width="1em"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
				</svg>
			)}
		</div>
	);
	return (
		<div className={"timeline-content icon-" + (['true', 'false'].includes(iconToggle) ? iconToggle : 'false') + " "}>
			<div
				className={`timeline-block-timeline ctl-row  position-${['left', 'right'].includes(blockPosition) ? blockPosition : 'left'}${
					t_date == "" ? " ctl_timeFalse" : ""
				}`}
			>
				<div className="ctl-6 timeline-block-time">
					{t_date === "" ||
					("ctl_date_undefined" === t_date && wodpressBlock) ? (
						""
					) : (
						<div className="story-time">{StoryTime()}</div>
					)}
				</div>
				{icon_div}
				<div className="ctl-6 timeline-block-detail">{StoryDetail()}</div>
			</div>
		</div>
	);
}
