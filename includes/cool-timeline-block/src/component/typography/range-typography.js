/**
 * WordPress dependencies
 */
 import { __ } from '@wordpress/i18n';

const {
	RangeControl,
	ButtonGroup,
	Button,
	Dashicon,
} = wp.components

// Extend component
const { Fragment } = wp.element
const { useSelect, useDispatch } = wp.data;
import map from 'lodash/map.js';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function RangeTypographyControl ( props ) {
	const deviceType = useSelect( ( select ) => {
		return select( 'core/editor' ).getDeviceType();
	}, [] );
	const {
		__experimentalSetPreviewDeviceType: setPreviewDeviceType,
	} = useDispatch( 'core/edit-post' );
	const customSetPreviewDeviceType = ( device ) => {
		setPreviewDeviceType( device );
	};
	const devices = [
		{
			name: 'Desktop',
			title: <Dashicon icon="desktop" />,
			itemClass: 'timeline-block-desktop-tab timeline-block-responsive-tabs',
		},
		{
			name: 'Tablet',
			title: <Dashicon icon="tablet" />,
			itemClass: 'timeline-block-tablet-tab timeline-block-responsive-tabs',
		},
		{
			name: 'Mobile',
			key: 'mobile',
			title: <Dashicon icon="smartphone" />,
			itemClass: 'timeline-block-mobile-tab timeline-block-responsive-tabs',
		},
	];
 	let sizeTypes

	if( "sizeTypes" in props ) {
		sizeTypes = props.sizeTypes
	} else {
		sizeTypes = [
			{ key: "px", name: __( "px",'timeline-block' ) },
			{ key: "em", name: __( "em",'timeline-block' ) },
		]
	}

	const sizeTypesControls = (
		<ButtonGroup className="timeline-block-size-type-field" aria-label={ __( "Size Type",'timeline-block' ) }>
			{ map( sizeTypes, ( { name, key } ) => (
				<Button
					key={ key }
					className="timeline-block-size-btn"
					isSmall
					isPrimary={ props.type.value === key }
					aria-pressed={ props.type.value === key }
					onClick={ () => props.setAttributes( { [props.typeLabel]: key } ) }
				>
					{ name }
				</Button>
			) ) }
		</ButtonGroup>
	)
	const output = {};
	output.Desktop = (
		<Fragment>
			{sizeTypesControls}
			<RangeControl
				label={ __( props.sizeText ) }
				value={ props.size.value || "" }
				onChange={ ( value ) => props.setAttributes( { [props.sizeLabel]: value } ) }
				min={ 0 }
				max={ 100 }
				step={ props.steps }
				beforeIcon="editor-textcolor"
				allowReset={true}
				initialPosition={props.initialPosition}
				__next40pxDefaultSize={ true }
			/>
		</Fragment>
	);
	output.Tablet = (
		<Fragment>
			{sizeTypesControls}
			<RangeControl
				label={ __( props.sizeTabletText ) }
				value={ props.sizeTablet.value }
				onChange={ ( value ) => props.setAttributes( { [props.sizeTabletLabel]: value } ) }
				min={ 0 }
				max={ 100 }
				step={ props.steps }
				beforeIcon="editor-textcolor"
				allowReset={true}
				initialPosition={18}
				__next40pxDefaultSize={ true }
			/>
		</Fragment>
	);
	output.Mobile = (
		<Fragment>
			{sizeTypesControls}
			<RangeControl
				label={ __( props.sizeMobileText ) }
				value={ props.sizeMobile.value }
				onChange={ ( value ) => props.setAttributes( { [props.sizeMobileLabel]: value } ) }
				min={ 0 }
				max={ 100 }
				step={ props.steps }
				beforeIcon="editor-textcolor"
				allowReset={true}
				initialPosition={30}
				__next40pxDefaultSize={ true }
			/>
		</Fragment>
	);
	return (
		<div className={ 'timeline-block-typography-range-options' }>
			<div className="timeline-block-size-type-field-tabs">
				{/* <ButtonGroup className="components-tab-panel__tabs" aria-label={ __( 'Device', 'timeline-block' ) }>
					{ map( devices, ( { name, key, title, itemClass } ) => (
						<Button
							key={ key }
							className={ `components-button components-tab-panel__tabs-item ${ itemClass }${ name === deviceType ? ' active-tab' : '' }` }
							aria-pressed={ deviceType === name }
							onClick={ () => customSetPreviewDeviceType( name ) }
						>
							{ title }
						</Button>
					) ) }
				</ButtonGroup> */}
				<div className="timeline-block-responsive-control-inner">
				{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
				</div>
			</div>
		</div>
	);
}