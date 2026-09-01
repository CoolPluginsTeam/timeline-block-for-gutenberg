/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const {
	Button,
} = wp.components

const { useSelect } = wp.data;

/**
 * Compact Font size / Line height row (number + unit + reset).
 */
export default function RangeTypographyControl ( props ) {
	const deviceType = useSelect( ( select ) => {
		const editor = select( 'core/editor' );
		if ( editor && typeof editor.getDeviceType === 'function' ) {
			return editor.getDeviceType();
		}
		return 'Desktop';
	}, [] );

	let sizeTypes

	if( "sizeTypes" in props ) {
		sizeTypes = props.sizeTypes
	} else {
		sizeTypes = [
			{ key: "px", name: __( "px",'timeline-block' ) },
			{ key: "em", name: __( "em",'timeline-block' ) },
		]
	}

	const sizeRow = ( { label, value, valueLabel, type, typeLabel, steps } ) => (
		<div className="ctlb-typo-size-row">
			<span className="ctlb-typo-size-label">{ label }</span>
			<div className="ctlb-typo-size-controls">
				<input
					type="number"
					className="ctlb-typo-size-input"
					value={ value.value ?? "" }
					step={ steps }
					onChange={ ( e ) => props.setAttributes( { [ valueLabel ]: e.target.value === "" ? undefined : Number( e.target.value ) } ) }
				/>
				<div className="ctlb-segmented ctlb-typo-unit-toggle">
					{ sizeTypes.map( ( { name, key } ) => (
						<Button
							key={ key }
							className={ `ctlb-segmented-btn${ type.value === key ? ' is-active' : '' }` }
							onClick={ () => props.setAttributes( { [ typeLabel ]: key } ) }
						>
							{ name }
						</Button>
					) ) }
				</div>
				<Button
					className="ctlb-typo-size-reset"
					onClick={ () => props.setAttributes( { [ valueLabel ]: undefined, [ typeLabel ]: "px" } ) }
				>
					{ __( "Reset", "timeline-block" ) }
				</Button>
			</div>
		</div>
	)

	const output = {};
	output.Desktop = sizeRow( {
		label: props.sizeText,
		value: props.size,
		valueLabel: props.sizeLabel,
		type: props.type,
		typeLabel: props.typeLabel,
		steps: props.steps,
	} );
	output.Tablet = sizeRow( {
		label: props.sizeTabletText,
		value: props.sizeTablet,
		valueLabel: props.sizeTabletLabel,
		type: props.type,
		typeLabel: props.typeLabel,
		steps: props.steps,
	} );
	output.Mobile = sizeRow( {
		label: props.sizeMobileText,
		value: props.sizeMobile,
		valueLabel: props.sizeMobileLabel,
		type: props.type,
		typeLabel: props.typeLabel,
		steps: props.steps,
	} );

	return (
		<div className={ 'timeline-block-typography-range-options' }>
			<div className="timeline-block-size-type-field-tabs">
				<div className="timeline-block-responsive-control-inner">
				{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
				</div>
			</div>
		</div>
	);
}
