/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FontFamilyControl from "./font-typography.js";
import RangeTypographyControl from "./range-typography.js";
import TypographyStyles from "./inline-styles.js";
import "./editor.scss"

const {
	Button,
	Dashicon
} = wp.components


// Extend component
const { Component, Fragment } = wp.element

// Export for ease of importing in individual blocks.
export {
	TypographyStyles,
}

class TypographyControl extends Component {
	constructor() {
		super( ...arguments )
		this.onAdvancedControlClick  = this.onAdvancedControlClick.bind( this )
		this.onAdvancedControlReset  = this.onAdvancedControlReset.bind( this )
		this.timeline_settings_apply;
	}
	valueupdate(){
		let valueupdates=[
			this.props.fontSize.value,
			this.props.fontFamily.value == 'Default' ? undefined : this.props.fontFamily.value,
			this.props.fontWeight.value,
			this.props.lineHeight.value,
		];
		for(let i = 0; i<valueupdates.length; i++){
			if(valueupdates[i] != undefined){
				this.timeline_settings_apply=' cp-timeline-typography_apply';
				break;
			}
			this.timeline_settings_apply = '';
		};
	}
	onAdvancedControlClick() {

		let control = true
		let label = __( "Hide Advanced",'timeline-block' )

		if( this.state !== null && this.state.showAdvancedControls === true ) {
			control = false
			label = __( "Advanced",'timeline-block' )
		}

		this.setState(
			{
				showAdvancedControls: control,
				showAdvancedControlsLabel: label
			}
		)
	}
	onAdvancedControlReset() {

		const { setAttributes } = this.props

		// Reset Font family to default.
		setAttributes( { [ this.props.fontFamily.label ]: "Default" } )
		setAttributes( { [ this.props.fontWeight.label ]: undefined } )
		setAttributes( { [ this.props.fontSubset.label ]: "" } )

		// Reset Font Size to default.
		setAttributes( { [ this.props.fontSize.label ]: undefined } )
		setAttributes( { [ this.props.fontSizeType.label ]: "px" } )
		setAttributes( { [ this.props.fontSizeMobile.label ]: "" } )
		setAttributes( { [ this.props.fontSizeTablet.label ]: "" } )

		// Reset Line Height to default.
		setAttributes( { [ this.props.lineHeight.label ]: undefined } )
		setAttributes( { [ this.props.lineHeightType.label ]: "px" } )
		setAttributes( { [ this.props.lineHeightMobile.label ]: "" } )
		setAttributes( { [ this.props.lineHeightTablet.label ]: "" } )

		// Reset Google Fonts to default.
		setAttributes( { [ this.props.loadGoogleFonts.label ]: false } )
	}

	render() {
		this.valueupdate();
		let fontSize
		let fontWeight
		let fontFamily
		let fontAdvancedControls
		let fontTypoAdvancedControls
		let showAdvancedFontControls
		let resetFontAdvancedControls

		const {
			disableFontFamily,
			disableFontSize,
			disableLineHeight,
			disableAdvancedOptions = false
		} = this.props

		if( true !== disableFontFamily ) {
			fontFamily = (
				<FontFamilyControl
					{ ...this.props }
				/>
			)
		}

		if( true !== disableLineHeight ) {
			fontWeight = (
				<RangeTypographyControl
					type = { this.props.lineHeightType }
					typeLabel = { this.props.lineHeightType.label }
					sizeMobile = { this.props.lineHeightMobile }
					sizeMobileLabel = { this.props.lineHeightMobile.label }
					sizeTablet = { this.props.lineHeightTablet }
					sizeTabletLabel = { this.props.lineHeightTablet.label }
					size = { this.props.lineHeight }
					sizeLabel = { this.props.lineHeight.label }
					sizeMobileText = { __( "Line Height",'timeline-block' ) }
					sizeTabletText = { __( "Line Height",'timeline-block' ) }
					sizeText = { __( "Line Height",'timeline-block' ) }
					steps = { this.props.lineHeightType.value == 'px' ? 1 : 0.1 }
					initialPosition={0}
					{ ...this.props }
				/>
			)
		}

		if( true !== disableFontSize ) {
			fontSize = (
				<RangeTypographyControl
					type = { this.props.fontSizeType }
					typeLabel = { this.props.fontSizeType.label }
					sizeMobile = { this.props.fontSizeMobile }
					sizeMobileLabel = { this.props.fontSizeMobile.label }
					sizeTablet = { this.props.fontSizeTablet }
					sizeTabletLabel = { this.props.fontSizeTablet.label }
					size = { this.props.fontSize }
					sizeLabel = { this.props.fontSize.label }
					sizeMobileText = { ( ! this.props.fontSizeLabel ) ? __( "Font Size",'timeline-block' ) : this.props.fontSizeLabel }
					sizeTabletText = { ( ! this.props.fontSizeLabel ) ? __( "Font Size",'timeline-block' ) : this.props.fontSizeLabel }
					sizeText = { ( ! this.props.fontSizeLabel ) ? __( "Font Size",'timeline-block' ) : this.props.fontSizeLabel }
					steps = { this.props.fontSizeType.value == 'px' ? 1 : 0.1 }
					initialPosition={this.props.fontSize.label == 'subHeadFontSize' ? 14 : 18}
					{ ...this.props }
				/>
			)
		}
		

		if( true !== disableFontFamily && true !== disableFontSize ) {
			fontAdvancedControls =  (
				<Button
					className="timeline-block-size-btn timeline-block-typography-control-btn"
					isSmall
					aria-pressed={ ( this.state !== null && this.state.showAdvancedControls === true ) }
					onClick={ this.onAdvancedControlClick }
				><Dashicon icon="admin-tools" /></Button>
			)

			resetFontAdvancedControls =  (
				<div
					className="components-button timeline-block-size-btn timeline-block-typography-reset-btn is-small"
					onClick={ this.onAdvancedControlReset }
				><Dashicon icon="image-rotate" /></div>
			)
		}

		showAdvancedFontControls = (
			<Fragment>
				{ fontSize }
				{ fontWeight }
				{ this.state !== null && this.state.showAdvancedControls === true && fontFamily && (
					<div className="timeline-block-typography-advanced">
						{ fontFamily }
					</div>
				) }
			</Fragment>
		)

		if( true !== disableFontFamily && true !== disableFontSize ) {
			fontTypoAdvancedControls =  (
				<div className="timeline-block-typography-option-actions">
					<h2>{ this.props.label }</h2>
					{ resetFontAdvancedControls }
					{ fontAdvancedControls }
				</div>
			)
		}
		return (
			<div className={`timeline-block-typography-options${this.timeline_settings_apply}`}>
				{ !disableAdvancedOptions &&
					<Fragment>
						{ fontTypoAdvancedControls }
						{ showAdvancedFontControls }
					</Fragment>
				}
			</div>
		)
	}
}

export default TypographyControl
