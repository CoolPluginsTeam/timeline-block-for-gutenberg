import { __ } from '@wordpress/i18n';

const { Button } = wp.components;

// Preview rows: y position of each story box (three for a timeline, one for a single story).
const ROWS = [6, 18, 30];
const SINGLE_ROW = [18];

/**
 * Small preview of the timeline: centre line, story boxes and dots.
 * - alternating: boxes zig-zag starting on `side`; otherwise all sit on `side`.
 * - single: one story box on `side`.
 */
const SidePreview = ({ side, alternating, single }) => {
	return (
		<svg className="ctlb-side-picker__preview" viewBox="0 0 64 44" aria-hidden="true" focusable="false">
			<line className="ctlb-side-picker__line" x1="32" y1="2" x2="32" y2="42" />
			{(single ? SINGLE_ROW : ROWS).map((y, index) => {
				const boxSide = alternating && index % 2 ? (side === 'left' ? 'right' : 'left') : side;
				const x = 'left' === boxSide ? 6 : 38;
				return (
					<g key={y}>
						<rect className="ctlb-side-picker__box" x={x} y={y} width="20" height="9" rx="2" />
						<circle className={`ctlb-side-picker__dot ctlb-side-picker__dot--${index % 2 ? 'even' : 'odd'}`} cx="32" cy={y + 4.5} r="2.5" />
					</g>
				);
			})}
		</svg>
	);
};

/**
 * Visual Left / Right side picker (timeline level and single story).
 *
 * @param {Object}   props
 * @param {string}   props.value       Current value: "left" or "right".
 * @param {Function} props.onChange    Called with the newly picked value.
 * @param {boolean}  props.alternating Timeline: stories alternate sides (zig-zag preview).
 * @param {boolean}  props.single      Story: preview shows one story box.
 * @param {boolean}  props.compact     Smaller cards.
 * @param {string}   props.label       Optional label override (defaults to the timeline wording).
 * @param {string}   props.helpText    Optional help text override.
 * @param {boolean}  props.hideHelp    Hide the help text.
 */
const StorySidePicker = ({
	value,
	onChange,
	alternating = false,
	single = false,
	compact = false,
	label,
	helpText,
	hideHelp = false,
}) => {
	const options = [
		{ value: 'left', label: __('Left', 'timeline-block') },
		{ value: 'right', label: __('Right', 'timeline-block') },
	];
	const heading = label || (alternating ? __('First story starts on', 'timeline-block') : __('Story side', 'timeline-block'));
	const help =
		helpText ||
		(alternating
			? __('Stories then alternate sides.', 'timeline-block')
			: __('All stories appear on this side.', 'timeline-block'));

	return (
		<div className={`ctlb-side-picker${compact ? ' ctlb-side-picker--compact' : ''}`}>
			<span className="ctlb-side-picker__label">{heading}</span>
			<div className={`ctlb-side-picker__grid ctlb-side-picker__grid--${options.length}`}>
				{options.map((option) => (
					<Button
						key={option.value}
						className={`ctlb-side-picker__card${value === option.value ? ' is-selected' : ''}`}
						aria-pressed={value === option.value}
						onClick={() => onChange(option.value)}
					>
						<SidePreview side={option.value} alternating={alternating} single={single} />
						<span className="ctlb-side-picker__card-label">{option.label}</span>
					</Button>
				))}
			</div>
			{!hideHelp && <span className="ctlb-side-picker__help">{help}</span>}
		</div>
	);
};

export default StorySidePicker;
