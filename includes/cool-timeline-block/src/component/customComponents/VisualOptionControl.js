import { __ } from '@wordpress/i18n';
import { ProBadge, PRO_UPGRADE_URL } from '../ProFeature.js';

const { BaseControl } = wp.components;

export const LayoutIcons = {
	vertical: (
		<svg viewBox="0 0 56 40" aria-hidden="true" focusable="false">
			<rect x="26.5" y="2" width="3" height="36" rx="1.5" fill="currentColor" opacity="0.35" />
			<circle cx="28" cy="10" r="3" fill="#D91B3E" />
			<circle cx="28" cy="20" r="3" fill="#01c5bd" />
			<circle cx="28" cy="30" r="3" fill="#D91B3E" />
			<rect x="6" y="6" width="16" height="8" rx="1.5" fill="currentColor" opacity="0.18" />
			<rect x="34" y="16" width="16" height="8" rx="1.5" fill="currentColor" opacity="0.18" />
			<rect x="6" y="26" width="16" height="8" rx="1.5" fill="currentColor" opacity="0.18" />
		</svg>
	),
	horizontal: (
		<svg viewBox="0 0 56 40" aria-hidden="true" focusable="false">
			<rect x="4" y="18.5" width="48" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
			<circle cx="14" cy="20" r="3" fill="#D91B3E" />
			<circle cx="28" cy="20" r="3" fill="#01c5bd" />
			<circle cx="42" cy="20" r="3" fill="#D91B3E" />
			<rect x="7" y="4" width="14" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
			<rect x="21" y="26" width="14" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
			<rect x="35" y="4" width="14" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
		</svg>
	),
	'modern-vertical': (
		<svg viewBox="0 0 56 40" aria-hidden="true" focusable="false">
			<rect x="4" y="4" width="18" height="32" rx="2" fill="currentColor" opacity="0.1" />
			<rect x="7" y="8" width="12" height="5" rx="1" fill="#D91B3E" />
			<rect x="7" y="16" width="12" height="5" rx="1" fill="currentColor" opacity="0.2" />
			<rect x="7" y="24" width="12" height="5" rx="1" fill="currentColor" opacity="0.2" />
			<rect x="26" y="4" width="26" height="32" rx="2" fill="currentColor" opacity="0.12" />
			<rect x="30" y="9" width="18" height="3" rx="1" fill="currentColor" opacity="0.28" />
			<rect x="30" y="15" width="14" height="2" rx="1" fill="currentColor" opacity="0.18" />
			<rect x="30" y="20" width="16" height="2" rx="1" fill="currentColor" opacity="0.18" />
		</svg>
	),
	'both-sided': (
		<svg viewBox="0 0 56 40" aria-hidden="true" focusable="false">
			<rect x="26.5" y="3" width="3" height="34" rx="1.5" fill="currentColor" opacity="0.35" />
			<circle cx="28" cy="12" r="2.6" fill="#D91B3E" />
			<circle cx="28" cy="28" r="2.6" fill="#01c5bd" />
			<rect x="5" y="7" width="17" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
			<rect x="34" y="23" width="17" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
		</svg>
	),
	'one-sided': (
		<svg viewBox="0 0 56 40" aria-hidden="true" focusable="false">
			<rect x="10.5" y="3" width="3" height="34" rx="1.5" fill="currentColor" opacity="0.35" />
			<circle cx="12" cy="12" r="2.6" fill="#D91B3E" />
			<circle cx="12" cy="28" r="2.6" fill="#01c5bd" />
			<rect x="20" y="7" width="30" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
			<rect x="20" y="23" width="30" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
		</svg>
	),
	'horizontal-default': (
		<svg viewBox="0 0 56 40" aria-hidden="true" focusable="false">
			<rect x="4" y="18.5" width="48" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
			<circle cx="16" cy="20" r="3" fill="#D91B3E" />
			<circle cx="40" cy="20" r="3" fill="#01c5bd" />
			<rect x="8" y="4" width="16" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
			<rect x="32" y="26" width="16" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
		</svg>
	),
	'horizontal-simple': (
		<svg viewBox="0 0 56 40" aria-hidden="true" focusable="false">
			<rect x="4" y="6" width="48" height="8" rx="2" fill="currentColor" opacity="0.12" />
			<circle cx="16" cy="10" r="2.2" fill="#D91B3E" />
			<circle cx="28" cy="10" r="2.2" fill="#01c5bd" />
			<circle cx="40" cy="10" r="2.2" fill="#D91B3E" />
			<rect x="10" y="20" width="36" height="16" rx="2" fill="currentColor" opacity="0.16" />
		</svg>
	),
};

const VisualOptionControl = ({
	label,
	help,
	value,
	options = [],
	onChange,
	columns,
}) => {
	const columnCount = columns || Math.min(options.length, 3);

	return (
		<BaseControl
			label={label}
			help={help}
			className="ctlb-visual-options"
			__nextHasNoMarginBottom={true}
		>
			<div
				className={`ctlb-visual-options__grid ctlb-visual-options__grid--${columnCount}`}
				role="radiogroup"
				aria-label={label || __('Options', 'timeline-block')}
			>
				{options.map((option) => {
					const isActive = value === option.value;
					return (
						<button
							key={option.value}
							type="button"
							role="radio"
							aria-checked={isActive}
							className={`ctlb-visual-option${isActive ? ' is-active' : ''}${option.pro ? ' is-pro' : ''}`}
							onClick={() => {
								if (option.pro) {
									window.open(PRO_UPGRADE_URL, '_blank', 'noopener,noreferrer');
									return;
								}
								if (option.value !== value) {
									onChange(option.value);
								}
							}}
						>
							{option.icon && (
								<span className="ctlb-visual-option__preview">{option.icon}</span>
							)}
							<span className="ctlb-visual-option__label">
								{option.label}
								{option.pro ? <ProBadge /> : null}
							</span>
						</button>
					);
				})}
			</div>
		</BaseControl>
	);
};

export default VisualOptionControl;
