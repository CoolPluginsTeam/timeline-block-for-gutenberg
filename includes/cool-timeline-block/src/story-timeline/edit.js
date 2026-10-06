import preview from "../component/icon/timeline.png"
// import map from "lodash/map.js";
import times from "lodash/times.js";
import memoize from "memize"

import contentTimelineStyle from "./styling.js";

// Import all of our Text Options requirements.
import TypographyControl from "../component/typography/index.js";
// Import different sides unts controler
import SpacingControl from "../component/customComponents/MultipleUnits.js";
import ColorController from "../component/colorComponent/index.js";
import { IconPicker } from "../component/Icons/index.js";

// // Import Web font loader for google fonts.y
import WebfontLoader from "../component/typography/fontloader.js";
import VisualOptionControl, { LayoutIcons } from "../component/customComponents/VisualOptionControl.js";
import { ProLock, ProBadge, ProOptionButton, openProUpgrade } from "../component/ProFeature.js";
const { Component, Fragment, createRef } = wp.element

import React from 'react';

import { __ } from '@wordpress/i18n';
const {
	BlockControls,
	InspectorControls,
	InnerBlocks,
} = wp.blockEditor

const {
	PanelBody,
	SelectControl,
	RangeControl,
	TabPanel,
	ToolbarDropdownMenu,
	Card,
	CardBody,
	Button,
	ButtonGroup,
	ToggleControl,
	TextControl,
	__experimentalInputControl: InputControl
} = wp.components

const {
	dispatch,
	select
} = wp.data
const ALLOWED_BLOCKS = ["cp-timeline/content-timeline-block-child"]

class Edit extends Component {
	constructor() {
		super();
		this.state = {
			stylePanel: 'heading',
			advancedPanel: null,
		};
		this.onUpdateOrientation = this.onUpdateOrientation.bind(this);
		this.timelineWrpRef = React.createRef();
		this.ref =createRef();
	}

	addBlock(e){
		let position=this.props.attributes.BothsidedOrientation;
		let index = wp.data.select("core/block-editor").getBlockCount(this.props.clientId)
		let timelineDesign= this.props.attributes.timelineDesign
		let timelineLayout= this.props.attributes.timelineLayout
		let name = 'cp-timeline/content-timeline-block-child';
		const oddPosition = position,
		evenPosition = position == 'right' ? 'left' : 'right';
		let insertedBlock = wp.blocks.createBlock(name, {block_position_active:false,
			timelineDesign :timelineDesign,
			timelineLayout:timelineLayout,
			blockPosition:index % 2 ? evenPosition : oddPosition,
			storyPositionHide: !this.props.attributes.OrientationCheckBox,
			headingTag: this.props.attributes.headingTag});
		wp.data.dispatch('core/block-editor').insertBlocks(insertedBlock,index+1,this.props.clientId);
	}

	onUpdateOrientation(newOrientation,position) {
		this.props.attributes.timelineDesign == "both-sided" && this.props.setAttributes({BothsidedOrientation: newOrientation});
		this.props.setAttributes({Orientation: newOrientation});
		if (this.props.attributes.timelineLayout == "vertical" && this.props.attributes.timelineDesign == "both-sided") {
			const blocks = select("core/block-editor").getBlock(this.props.clientId).innerBlocks,
			evenPosition = newOrientation,
			oddPosition = newOrientation === 'left' ? 'right' : 'left';
			blocks.forEach((block, index) => {block.attributes.blockPosition = index % 2 ? oddPosition : evenPosition, block.attributes.storyPositionHide=!position});
		}
	}

	// story position set depends on first story
	OrientationCheck = (e) => {
		const blocks = select("core/block-editor").getBlock(this.props.clientId).innerBlocks
		const position = blocks[0]['attributes']['blockPosition'];
		this.onUpdateOrientation(position,e);
	}

	onUpdateHeadingTag = (e) => {
		this.props.setAttributes({headingTag: e});
		const blocks = select("core/block-editor").getBlock(this.props.clientId).innerBlocks
		blocks.forEach((block, index) => {block.attributes.headingTag=e});
	};
	getDocument(){
		if(this.ref.current && this.ref.current.ownerDocument){
		return this.ref.current.ownerDocument;
		}
		}
	
	render() {
		// Setup the attributes.
		const {
			setAttributes,
			attributes: {
				itemSpacing,
				contentAlignment,
				LineColor,
				timelineLayout,
				tm_content,
				headingColor,
				subHeadingColor,
				titileBtSpacing,
				titileBtSpacingType,
				headFontSizeType,
				headFontSize,
				headFontSizeTablet,
				headFontSizeMobile,
				headFontFamily,
				headFontWeight,
				headFontSubset,
				headLineHeightType,
				headLineHeight,
				headLineHeightTablet,
				headLineHeightMobile,
				headLoadGoogleFonts,
				timelineItem,
				descBtSpacing,
				descBtSpacingType,
				subHeadFontSizeType,
				subHeadFontSize,
				subHeadFontSizeTablet,
				subHeadFontSizeMobile,
				subHeadFontFamily,
				subHeadFontWeight,
				subHeadFontSubset,
				subHeadLineHeightType,
				subHeadLineHeight,
				subHeadLineHeightTablet,
				subHeadLineHeightMobile,
				subHeadLoadGoogleFonts,
				dateColor,
				storyBorderColor,
				dateFontsizeType,
				dateFontsize,
				dateFontsizeTablet,
				dateFontsizeMobile,
				dateFontFamily,
				dateFontWeight,
				dateFontSubset,
				dateLineHeightType,
				dateLineHeight,
				dateLineHeightTablet,
				dateLineHeightMobile,
				dateLoadGoogleFonts,
				iconBg,
				Orientation,
				timelineDesign,
				iconColor,
				iconSize,
				iconBoxSize,
				middleLineSize,
				containerTopPadding,
				containerRightPadding,
				containerBottomPadding,
				containerLeftPadding,
				desktopConatinerPaddingType,
				marginLink,
				isPreview,
				OrientationCheckBox,
				slidePerView,
				timelineNavItems
			},
		} = this.props
		const newDesignClass = this.props.isNewDesign ? 'ctlb-new-design' : '';
		if(this.getDocument()){
			var element = this.getDocument().getElementById("cool-vertical-timeline-style-" + this.props.clientId)
			
			if( element ) {
			element.textContent = contentTimelineStyle( this.props )
		}
		}
		
		const orientation_setting = ((timelineLayout == "vertical" && timelineDesign == 'one-sided') || (timelineLayout == "vertical" && timelineDesign == 'both-sided' && OrientationCheckBox)) ?
			<Fragment><SelectControl
			label={ timelineDesign == "both-sided" ? __("first story Based","timeline-block") : __( "Alignment","timeline-block" ) }
			value={ Orientation }
			onChange={ this.onUpdateOrientation }
			options={ [
				{ value: "right", label: __( "Right Sided","timeline-block") },
				{ value: "left", label: __( "Left Sided","timeline-block") },
			] }
			__nextHasNoMarginBottom={ true }
			__next40pxDefaultSize={ true }
			/>
			</Fragment>:null;
		const panelTitle = (icon, label) => (
			<span className="ctlb-panel-title">
				<span className="ctlb-panel-title-badge">
					<span className={`dashicons dashicons-${icon}`}></span>
				</span>
				{label}
			</span>
		);
		const panelTitlePro = (icon, label) => (
			<span className="ctlb-panel-title">
				<span className="ctlb-panel-title-badge">
					<span className={`dashicons dashicons-${icon}`}></span>
				</span>
				{label}
				<ProBadge />
			</span>
		);
		const openProUpgradeHandler = openProUpgrade;
		const noopSetAttributes = () => {};
		const dummySide = (value = '') => ({ value, label: '_proLock' });
		const dummySpacing = {
			unit: { value: 'px', label: '_proUnit' },
			defaultValue: '',
			attributes: this.props.attributes,
			setAttributes: noopSetAttributes,
			link: { value: true, label: '_proLink' },
		};
		const proNumberInput = (props) => (InputControl
			? <InputControl type="number" onChange={() => {}} {...props} />
			: <TextControl onChange={() => {}} __nextHasNoMarginBottom={true} {...props} />
		);
		const proUnitPills = (active = 'px') => (
			<ButtonGroup className="ctlb-unit-pills">
				{['px', 'em', '%'].map((unit) => (
					<Button key={unit} isSmall isPrimary={active === unit} isSecondary={active !== unit}>{unit}</Button>
				))}
			</ButtonGroup>
		);
		const stylePanelProps = (panelId) => ({
			opened: this.state.stylePanel === panelId,
			onToggle: (willOpen) => {
				this.setState({ stylePanel: willOpen ? panelId : null });
			},
		});
		const advancedPanelProps = (panelId) => ({
			opened: this.state.advancedPanel === panelId,
			onToggle: (willOpen) => {
				this.setState({ advancedPanel: willOpen ? panelId : null });
			},
		});
		const general_setting=<CardBody className="ctlb-panel-stack">
		<PanelBody title={panelTitle("heading", __("Heading", "timeline-block"))} {...stylePanelProps('heading')}>
		<TypographyControl
			label={ __( "Typography",'timeline-block' ) }
			attributes = { this.props.attributes }
			setAttributes = { setAttributes }
			loadGoogleFonts = { { value: headLoadGoogleFonts, label: 'headLoadGoogleFonts' } }
			fontFamily = { { value: headFontFamily, label: 'headFontFamily' } }
			fontWeight = { { value: headFontWeight, label: 'headFontWeight' } }
			fontSubset = { { value: headFontSubset, label: 'headFontSubset' } }
			fontSizeType = { { value: headFontSizeType, label: 'headFontSizeType' } }
			fontSize = { { value: headFontSize, label: 'headFontSize' } }
			fontSizeMobile = { { value: headFontSizeMobile, label: 'headFontSizeMobile' } }
			fontSizeTablet= { { value: headFontSizeTablet, label: 'headFontSizeTablet' } }
			lineHeightType = { { value: headLineHeightType, label: 'headLineHeightType' } }
			lineHeight = { { value: headLineHeight, label: 'headLineHeight' } }
			lineHeightMobile = { { value: headLineHeightMobile, label: 'headLineHeightMobile' } }
			lineHeightTablet= { { value: headLineHeightTablet, label: 'headLineHeightTablet' } }
		/>
		<ColorController
			label={__("Text Color", "timeline-block")}
			attrLabel="headingColor"
			className={headingColor != '' ? 'timeline-color-setting_apply' : ''}
			color={'' === headingColor ? '#333' : headingColor}
			setAttributes={setAttributes}
		/>
		<h2 className="ctlb-label-heading">{__("Bottom Spacing", "timeline-block")}</h2>
		<RangeControl
			className="cp-timeline-block-range__control"
			value={ titileBtSpacing != '' ? titileBtSpacing : 0 }
			onChange={ (value) => setAttributes({titileBtSpacing: value}) }
			resetFallbackValue={0}
			allowReset={ true }
			min={ 0 }
			max={ 200 }
			__nextHasNoMarginBottom={ true }
		/>
		<div className="ctlb-pro-field-header">
			<span className="ctlb-label-heading">{__("Spacing", "timeline-block")}</span>
			<ProBadge />
		</div>
		<ProLock hideBadge compact>
			<SpacingControl
				label={__('Margin', 'timeline-block')}
				valueTop={dummySide()}
				valueRight={dummySide()}
				valueBottom={dummySide()}
				valueLeft={dummySide()}
				{...dummySpacing}
			/>
			<SpacingControl
				label={__('Padding', 'timeline-block')}
				valueTop={dummySide()}
				valueRight={dummySide()}
				valueBottom={dummySide()}
				valueLeft={dummySide()}
				{...dummySpacing}
			/>
		</ProLock>
		</PanelBody>
		<PanelBody title={panelTitle("editor-paragraph", __("Description", "timeline-block"))} {...stylePanelProps('description')}>
	<TypographyControl
		label={ __( "Typography",'timeline-block' ) }
		attributes = { this.props.attributes }
		setAttributes = { setAttributes }
		loadGoogleFonts = { { value: subHeadLoadGoogleFonts, label: 'subHeadLoadGoogleFonts' } }
		fontFamily = { { value: subHeadFontFamily, label: 'subHeadFontFamily' } }
		fontWeight = { { value: subHeadFontWeight, label: 'subHeadFontWeight' } }
		fontSubset = { { value: subHeadFontSubset, label: 'subHeadFontSubset' } }
		fontSizeType = { { value: subHeadFontSizeType, label: 'subHeadFontSizeType' } }
		fontSize = { { value: subHeadFontSize, label: 'subHeadFontSize' } }
		fontSizeMobile = { { value: subHeadFontSizeMobile, label: 'subHeadFontSizeMobile' } }
		fontSizeTablet= { { value: subHeadFontSizeTablet, label: 'subHeadFontSizeTablet' } }
		lineHeightType = { { value: subHeadLineHeightType, label: 'subHeadLineHeightType' } }
		lineHeight = { { value: subHeadLineHeight, label: 'subHeadLineHeight' } }
		lineHeightMobile = { { value: subHeadLineHeightMobile, label: 'subHeadLineHeightMobile' } }
		lineHeightTablet= { { value: subHeadLineHeightTablet, label: 'subHeadLineHeightTablet' } }
	/>
		<ColorController
			label={__("Text Color", "timeline-block")}
			attrLabel="subHeadingColor"
			className={subHeadingColor != '' ? 'timeline-color-setting_apply' : ''}
			color={'' === subHeadingColor ? '#333' : subHeadingColor}
			setAttributes={setAttributes}
		/>
		<h2 className="ctlb-label-heading">{__("Bottom Spacing", "timeline-block")}</h2>
		<RangeControl
			className="cp-timeline-block-range__control"
			value={descBtSpacing != '' ? descBtSpacing : 0 }
			onChange={ (value) => setAttributes({descBtSpacing: value}) }
			resetFallbackValue = {0}
			allowReset={ true }
			min={ 0 }
			max={ 200 }
			__nextHasNoMarginBottom={ true }
		/>
		<div className="ctlb-pro-field-header">
			<span className="ctlb-label-heading">{__("Spacing", "timeline-block")}</span>
			<ProBadge />
		</div>
		<ProLock hideBadge compact>
			<SpacingControl
				label={__('Margin', 'timeline-block')}
				valueTop={dummySide()}
				valueRight={dummySide()}
				valueBottom={dummySide()}
				valueLeft={dummySide()}
				{...dummySpacing}
			/>
			<SpacingControl
				label={__('Padding', 'timeline-block')}
				valueTop={dummySide()}
				valueRight={dummySide()}
				valueBottom={dummySide()}
				valueLeft={dummySide()}
				{...dummySpacing}
			/>
		</ProLock>
		</PanelBody>
		<PanelBody title={panelTitle("calendar-alt", __("Date label", "timeline-block"))} {...stylePanelProps('date-label')}>
		<TypographyControl
		label={ __( "Typography",'timeline-block' ) }
		attributes = { this.props.attributes }
		setAttributes = { setAttributes }
		loadGoogleFonts = { { value: dateLoadGoogleFonts, label: 'dateLoadGoogleFonts' } }
		fontFamily = { { value: dateFontFamily, label: 'dateFontFamily' } }
		fontWeight = { { value: dateFontWeight, label: 'dateFontWeight' } }
		fontSubset = { { value: dateFontSubset, label: 'dateFontSubset' } }
		fontSizeType = { { value: dateFontsizeType, label: 'dateFontsizeType' } }
		fontSize = { { value: dateFontsize, label: 'dateFontsize' } }
		fontSizeMobile = { { value: dateFontsizeMobile, label: 'dateFontsizeMobile' } }
		fontSizeTablet= { { value: dateFontsizeTablet, label: 'dateFontsizeTablet' } }
		lineHeightType = { { value: dateLineHeightType, label: 'dateLineHeightType' } }
		lineHeight = { { value: dateLineHeight, label: 'dateLineHeight' } }
		lineHeightMobile = { { value: dateLineHeightMobile, label: 'dateLineHeightMobile' } }
		lineHeightTablet= { { value: dateLineHeightTablet, label: 'dateLineHeightTablet' } }
	/>
	<ColorController
		label={__("Text Color", "timeline-block")}
		attrLabel="dateColor"
		className={dateColor != '' ? 'timeline-color-setting_apply' : ''}
		color={'' === dateColor ? '#333' : dateColor}
		setAttributes={setAttributes}
	/>
	</PanelBody>
		<PanelBody title={panelTitlePro("calendar", __("Year label", "timeline-block"))} {...stylePanelProps('year-label')}>
	<ProLock hideBadge compact>
		<TypographyControl
			label={ __( "Typography",'timeline-block' ) }
			attributes = { this.props.attributes }
			setAttributes = { noopSetAttributes }
			loadGoogleFonts = { { value: false, label: 'yearLoadGoogleFonts' } }
			fontFamily = { { value: 'Default', label: 'yearFontFamily' } }
			fontWeight = { { value: undefined, label: 'yearFontWeight' } }
			fontSubset = { { value: '', label: 'yearFontSubset' } }
			fontSizeType = { { value: 'px', label: 'yearFontSizeType' } }
			fontSize = { { value: undefined, label: 'yearFontSize' } }
			fontSizeMobile = { { value: undefined, label: 'yearFontSizeMobile' } }
			fontSizeTablet= { { value: undefined, label: 'yearFontSizeTablet' } }
			lineHeightType = { { value: 'px', label: 'yearLineHeightType' } }
			lineHeight = { { value: undefined, label: 'yearLineHeight' } }
			lineHeightMobile = { { value: undefined, label: 'yearLineHeightMobile' } }
			lineHeightTablet= { { value: undefined, label: 'yearLineHeightTablet' } }
		/>
		<ColorController
			label={__("Text Color", "timeline-block")}
			attrLabel="yearLabelTextColor"
			className=""
			color="#fff"
			setAttributes={noopSetAttributes}
		/>
	</ProLock>
		</PanelBody>
</CardBody>
		const advanced_setting =
		<CardBody className="ctlb-panel-stack">
		<PanelBody title={panelTitle("align-wide", __("Center Line", "timeline-block"))} {...advancedPanelProps('center-line')}>
			<div className="ctlb-pro-field-header">
				<h2 className="ctlb-label-heading">{__("Line Filling", "timeline-block")}</h2>
				<ProBadge />
			</div>
			<ProLock hideBadge compact>
				<div className="cp-timeline-block-style-settings">
					<h2 className="ctlb-label-heading">{__("Enable Line Filling", "timeline-block")}</h2>
					<ToggleControl
						className="timeline-block-Orientation_checkbox"
						checked={false}
						onChange={() => {}}
						__nextHasNoMarginBottom={true}
					/>
				</div>
				<p className="ctlb-setting-description">{__("Please note: Line filling change will only be reflected on the frontend.", "timeline-block")}</p>
				<ColorController
					label={__("Line Filling Color", "timeline-block")}
					attrLabel="lineFillingColor"
					className=""
					color="#D91B3E"
					setAttributes={noopSetAttributes}
				/>
			</ProLock>
			<h2 className="ctlb-label-heading">{__("Line Width","timeline-block")}</h2>
			<RangeControl
				className="cp-timeline-block-range__control"
				value={middleLineSize != '' ? middleLineSize : 0 }
				onChange={ (value) => setAttributes({middleLineSize: value}) }
				resetFallbackValue = {0}
				allowReset={ true }
				min={ 0 }
				max={ 10 }
				__nextHasNoMarginBottom={ true }
			/>
			<hr className="ctlb-section-divider" />
			<ColorController
				label={__("Line Color", "timeline-block")}
				attrLabel="LineColor"
				className={LineColor != '' ? 'timeline-color-setting_apply' : ''}
				color={'' === LineColor ? '#D91B3E' : LineColor}
				setAttributes={setAttributes}
			/>
		</PanelBody>
		<PanelBody title={panelTitle("marker", __("Icons", "timeline-block"))} {...advancedPanelProps('icon-settings')}>
			<h2 className="ctlb-label-heading">{__("Box Size","timeline-block")}</h2>
			<RangeControl
				className="cp-timeline-block-range__control"
				value={iconBoxSize != '' ? iconBoxSize : 0 }
				onChange={ (value) => setAttributes({iconBoxSize: value}) }
				resetFallbackValue = {0}
				allowReset={ true }
				min={ 20 }
				max={ 100 }
				__nextHasNoMarginBottom={ true }
			/>
			<h2 className="ctlb-label-heading">{__("Font Size","timeline-block")}</h2>
			<RangeControl
				className="cp-timeline-block-range__control"
				value={iconSize != '' ? iconSize : 0 }
				onChange={ (value) => setAttributes({iconSize: value}) }
				resetFallbackValue = {0}
				allowReset={ true }
				min={ 0 }
				max={ 100 }
				__nextHasNoMarginBottom={ true }
			/>
			<hr className="ctlb-section-divider" />
			<ColorController
				label={__("Background Color", "timeline-block")}
				attrLabel="iconBg"
				className={iconBg != '' ? 'timeline-color-setting_apply' : ''}
				color={'' === iconBg ? '#D91B3E' : iconBg}
				setAttributes={setAttributes}
			/>
			<ColorController
				label={__("Font Color", "timeline-block")}
				attrLabel="iconColor"
				className={iconColor != '' ? 'timeline-color-setting_apply' : ''}
				color={iconColor}
				setAttributes={setAttributes}
			/>
			<div className="ctlb-pro-field-header">
				<span className="ctlb-label-heading">{__("Icon extras", "timeline-block")}</span>
				<ProBadge />
			</div>
			<ProLock hideBadge compact>
				<h2 className="ctlb-label-heading">{__("Box Radius","timeline-block")}</h2>
				<RangeControl
					className="cp-timeline-block-range__control"
					value={50}
					onChange={() => {}}
					resetFallbackValue={50}
					allowReset={true}
					min={0}
					max={50}
					__nextHasNoMarginBottom={true}
				/>
				<h2 className="ctlb-label-heading">{__("Icon/Label Position","timeline-block")}</h2>
				<RangeControl
					className="cp-timeline-block-range__control"
					value={0}
					onChange={() => {}}
					resetFallbackValue={0}
					allowReset={true}
					min={0}
					max={100}
					__nextHasNoMarginBottom={true}
				/>
				<h2 className="ctlb-label-heading">{__("Connector Style", "timeline-block")}</h2>
				<ButtonGroup className="ctl_media_control ctlb-segmented">
					<Button isSmall className="ctlb-segmented-btn is-active">Arrow</Button>
					<Button isSmall className="ctlb-segmented-btn">Line</Button>
					<Button isSmall className="ctlb-segmented-btn">None</Button>
				</ButtonGroup>
			</ProLock>
		</PanelBody>
		<PanelBody title={panelTitlePro("calendar-alt", __("Year / Label", "timeline-block"))} {...advancedPanelProps('year-label-settings')}>
			<ProLock hideBadge compact>
				<div className="ctlb-number-field">
					<span className="ctlb-number-field__label">{__("Box Size", "timeline-block")}</span>
					<div className="ctlb-number-field__controls">
						{proNumberInput({ className: 'ctlb-number-field__input', value: 50 })}
						<Button isSecondary isSmall>{__("Reset", "timeline-block")}</Button>
					</div>
				</div>
				<div className="ctlb-number-field">
					<span className="ctlb-number-field__label">{__("Box Radius", "timeline-block")}</span>
					<div className="ctlb-number-field__controls">
						{proNumberInput({ className: 'ctlb-number-field__input', value: 50 })}
						<Button isSecondary isSmall>{__("Reset", "timeline-block")}</Button>
					</div>
				</div>
				<hr className="ctlb-section-divider" />
				<ColorController
					label={__("Background Color", "timeline-block")}
					attrLabel="yearLabelColor"
					className=""
					color="#D91B3E"
					setAttributes={noopSetAttributes}
				/>
				<div className="cp-timeline-block-style-settings">
					<h2 className="ctlb-label-heading">{__("Year Navigation", "timeline-block")}</h2>
					<ToggleControl
						className="timeline-block-Orientation_checkbox"
						checked={false}
						onChange={() => {}}
						__nextHasNoMarginBottom={true}
					/>
				</div>
				<p className="ctlb-setting-description">{__("Please note: Year navigation change will only be reflected on the frontend.", "timeline-block")}</p>
			</ProLock>
		</PanelBody>
		<PanelBody title={panelTitlePro("format-image", __("Media", "timeline-block"))} {...advancedPanelProps('image-media')}>
			<ProLock hideBadge compact>
				<div className="cp-timeline-block-boxshadow-controller-wrapper">
					<div className="ctlb-unit-field">
						<div className="ctlb-unit-field__header">
							<span className="ctlb-unit-field__label">{__("Width", "timeline-block")}</span>
							{proUnitPills('%')}
						</div>
						{proNumberInput({ className: 'cp-timeline-block-unit_control', placeholder: __("Auto", "timeline-block"), value: 100 })}
					</div>
					<div className="ctlb-unit-field">
						<div className="ctlb-unit-field__header">
							<span className="ctlb-unit-field__label">{__("Height", "timeline-block")}</span>
							{proUnitPills()}
						</div>
						{proNumberInput({ className: 'cp-timeline-block-unit_control', placeholder: __("Auto", "timeline-block"), value: '' })}
					</div>
				</div>
				<SpacingControl
					label={__('Padding', 'timeline-block')}
					valueTop={dummySide()}
					valueRight={dummySide()}
					valueBottom={dummySide()}
					valueLeft={dummySide()}
					{...dummySpacing}
				/>
				<SpacingControl
					label={__('Margin', 'timeline-block')}
					valueTop={dummySide()}
					valueRight={dummySide()}
					valueBottom={dummySide()}
					valueLeft={dummySide()}
					{...dummySpacing}
				/>
				<SpacingControl
					label={__('Border', 'timeline-block')}
					valueTop={dummySide()}
					valueRight={dummySide()}
					valueBottom={dummySide()}
					valueLeft={dummySide()}
					{...dummySpacing}
				/>
				<div className="cp-timeline-block-boxshadow-controller-wrapper">
					<div className="ctlb-unit-field ctlb-unit-field--full">
						<div className="ctlb-unit-field__header">
							<span className="ctlb-unit-field__label">{__("Border Radius", "timeline-block")}</span>
							{proUnitPills()}
						</div>
						{proNumberInput({ className: 'cp-timeline-block-unit_control', placeholder: '0', value: '' })}
					</div>
				</div>
				<ColorController
					label={__("Border Color", "timeline-block")}
					attrLabel="mediaBorderColor"
					className=""
					color="#D91B3E"
					setAttributes={noopSetAttributes}
				/>
			</ProLock>
		</PanelBody>
		<PanelBody title={panelTitle("editor-table", __("Story Box", "timeline-block"))} {...advancedPanelProps('container-box')}>
			{ timelineLayout == 'vertical' &&
			<Fragment>
				<h2 className="ctlb-label-heading">{__("Item Spacing","timeline-block")}</h2>
				<RangeControl
					className="cp-timeline-block-range__control"
					value={itemSpacing != '' ? itemSpacing : 0 }
					onChange={ (value) => setAttributes({itemSpacing: value}) }
					resetFallbackValue = {0}
					allowReset={ true }
					min={ 0 }
					max={ 200 }
					__nextHasNoMarginBottom={ true }
				/>
			</Fragment>
			}
			<SpacingControl
				{ ...this.props }
				label={ __( 'Padding', 'timeline-block' ) }
				valueTop={ {
					value: containerTopPadding,
					label: 'containerTopPadding',
				} }
				valueRight={ {
					value: containerRightPadding,
					label: 'containerRightPadding',
				} }
				valueBottom={ {
					value: containerBottomPadding,
					label: 'containerBottomPadding',
				} }
				valueLeft={ {
					value: containerLeftPadding,
					label: 'containerLeftPadding',
				} }
				unit={ {
					value: desktopConatinerPaddingType,
					label: 'desktopConatinerPaddingType',
				} }
				defaultValue=''
				attributes={ this.props.attributes }
				setAttributes={ setAttributes }
				link={ {
					value: marginLink,
					label: 'marginLink',
				} }
			/>
			<ColorController
				label={__("Border Color", "timeline-block")}
				attrLabel="storyBorderColor"
				className={storyBorderColor != '' ? 'timeline-color-setting_apply' : ''}
				color={'' === storyBorderColor ? '#D91B3E' : storyBorderColor}
				setAttributes={setAttributes}
			/>
			<div className="ctlb-pro-field-header">
				<span className="ctlb-label-heading">{__("Container extras", "timeline-block")}</span>
				<ProBadge />
			</div>
			<ProLock hideBadge compact>
				<SpacingControl
					label={__('Margin', 'timeline-block')}
					valueTop={dummySide()}
					valueRight={dummySide()}
					valueBottom={dummySide()}
					valueLeft={dummySide()}
					{...dummySpacing}
				/>
				<SpacingControl
					label={__('Border Width', 'timeline-block')}
					valueTop={dummySide()}
					valueRight={dummySide()}
					valueBottom={dummySide()}
					valueLeft={dummySide()}
					{...dummySpacing}
				/>
				<SpacingControl
					label={__('Border Radius', 'timeline-block')}
					labels={[
						__('Top-L', 'timeline-block'),
						__('Top-R', 'timeline-block'),
						__('Btm-R', 'timeline-block'),
						__('Btm-L', 'timeline-block'),
					]}
					valueTop={dummySide()}
					valueRight={dummySide()}
					valueBottom={dummySide()}
					valueLeft={dummySide()}
					{...dummySpacing}
				/>
				<ColorController
					label={__("Background Color", "timeline-block")}
					attrLabel="containerColor"
					className=""
					color="#ffffff"
					setAttributes={noopSetAttributes}
				/>
				<div className="timeline-block-box-shadow-options">
					<div className="timeline-block-box-shadow-option-actions">
						<h2>{__("Box Shadow", "timeline-block")}</h2>
						<div className="components-button timeline-block-size-btn timeline-block-box-shadow-reset-btn is-small">
							<span className="dashicons dashicons-image-rotate"></span>
						</div>
						<Button className="timeline-block-size-btn timeline-block-box-shadow-control-btn" isSmall>
							<span className="dashicons dashicons-admin-tools"></span>
						</Button>
					</div>
				</div>
			</ProLock>
		</PanelBody>
		<PanelBody title={panelTitlePro("controls-play", __("Animation", "timeline-block"))} {...advancedPanelProps('timeline-animation')}>
			<ProLock hideBadge compact>
				<SelectControl
					value="none"
					onChange={() => {}}
					options={[
						{ label: "None", value: "none" },
						{ label: "fade", value: "fade" },
						{ label: "slide-up", value: "slide-up" },
						{ label: "zoom-in", value: "zoom-in" },
					]}
					__nextHasNoMarginBottom={true}
					__next40pxDefaultSize={true}
				/>
				<p className="ctlb-setting-description">{__("Please note: This change will only be reflected on the frontend.", "timeline-block")}</p>
			</ProLock>
		</PanelBody>
		</CardBody>
		const footer_links = (
			<div className="ctlb-footer">
				<div className="ctlb-footer-row">
					<div className="ctlb-footer-links-group">
						<a target="_blank" rel="noopener noreferrer" href="https://cooltimeline.com/demo/gutenberg-timeline-block?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=demo&utm_content=timeline_block">{__("View demos", "timeline-block")}</a>
						<span className="ctlb-footer-sep" aria-hidden="true">·</span>
						<a target="_blank" rel="noopener noreferrer" href="https://cooltimeline.com/docs/timeline-block-pro/video-tutorials/free-plugin-video/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=docs&utm_content=timeline_block">{__("Watch videos", "timeline-block")}</a>
					</div>
					<a
						className="ctlb-footer-rate"
						target="_blank"
						rel="noopener noreferrer"
						href="https://wordpress.org/support/plugin/timeline-block/reviews/#new-post"
						title={__("Enjoying the plugin? Rate it on WordPress.org", "timeline-block")}
					>
						{__("Rate", "timeline-block")} <span className="ctlb-footer-star" aria-hidden="true">★</span>
					</a>
				</div>
				<a
					className="ctlb-footer-upgrade"
					target="_blank"
					rel="noopener noreferrer"
					href="https://cooltimeline.com/plugin/timeline-block-pro/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=upgrade&utm_content=timeline_block"
				>
					{__("Upgrade to Pro", "timeline-block")}
				</a>
			</div>
		);
		const verticalDesignOptions = [
			{ value: "both-sided", label: __("Both Sided", "timeline-block") },
			{ value: "one-sided", label: __("One Sided", "timeline-block") },
		];
		const alignmentOptions = [
			{ value: "left", label: __("Left", "timeline-block"), icon: "editor-alignleft" },
			{ value: "center", label: __("Center", "timeline-block"), icon: "editor-aligncenter" },
			{ value: "right", label: __("Right", "timeline-block"), icon: "editor-alignright" },
		];
		const handleLayoutChange = (value) => {
			if (value !== "vertical") {
				openProUpgradeHandler();
				return;
			}
			setAttributes({ timelineLayout: value, sliderActive: false });
			select("core/block-editor").getBlocksByClientId(this.props.clientId)[0].innerBlocks.forEach(function (block) {
				dispatch("core/block-editor").updateBlockAttributes(block.clientId, { timelineLayout: value });
			});
		};
		const handleDesignChange = (value) => {
			setAttributes({ timelineDesign: value });
			select("core/block-editor").getBlocksByClientId(this.props.clientId)[0].innerBlocks.forEach(function (block) {
				dispatch("core/block-editor").updateBlockAttributes(block.clientId, { timelineDesign: value });
			});
		};
		const contentAlignmentHandler = (value) => {
			setAttributes({ contentAlignment: value });
			select("core/block-editor").getBlocksByClientId(this.props.clientId)[0].innerBlocks.forEach(function (block) {
				dispatch("core/block-editor").updateBlockAttributes(block.clientId, { contentAlignment: value });
			});
		};
		const timeline_setting = (
		<CardBody>
			<div className="ctlb-style-element-card ctlb-general-card">
			<VisualOptionControl
				label={__("Layout", "timeline-block")}
				value={timelineLayout}
				onChange={handleLayoutChange}
				options={[
					{ value: "vertical", label: __("Vertical", "timeline-block"), icon: LayoutIcons.vertical },
					{ value: "horizontal", label: __("Horizontal", "timeline-block"), icon: LayoutIcons.horizontal, pro: true },
					{ value: "modern-vertical", label: __("Tabs", "timeline-block"), icon: LayoutIcons['modern-vertical'], pro: true },
				]}
			/>
			{timelineLayout == "vertical" ?
				<div className="ctlb-row ctlb-row--stack">
					<span className="ctlb-row-label">{__("Design", "timeline-block")}</span>
					<div className="ctlb-segmented">
						{verticalDesignOptions.map((opt) => (
							<Button
								key={opt.value}
								onClick={() => handleDesignChange(opt.value)}
								className={`ctlb-segmented-btn${timelineDesign === opt.value ? " is-active" : ""}`}
							>
								<span className="ctlb-segmented-btn-label">{opt.label}</span>
							</Button>
						))}
					</div>
				</div>
				: null
			}
			{(timelineLayout == "vertical" && timelineDesign == "both-sided") ?
				<div className="ctlb-row">
					<span className="ctlb-row-label-group">
						<span className="ctlb-row-label">{__("Alternating sides", "timeline-block")}</span>
						<span className="ctlb-row-hint">{__("Zig-zag entries left and right", "timeline-block")}</span>
					</span>
					<ToggleControl
						className="timeline-block-Orientation_checkbox"
						checked={OrientationCheckBox}
						onChange={(state) => {
							setAttributes({ OrientationCheckBox: state }), this.OrientationCheck(state);
						}}
						__nextHasNoMarginBottom={true}
					/>
				</div>
				: null
			}
			{["one-sided", "both-sided"].includes(timelineDesign) && timelineLayout == "vertical" ? orientation_setting : null}
			<div className="ctlb-row ctlb-row--stack">
				<span className="ctlb-row-label">{__("Content alignment", "timeline-block")}</span>
				<ButtonGroup className="cool-timeline-content-alignment-buttons ctlb-segmented">
					{alignmentOptions.map((opt) => (
						<Button
							key={opt.value}
							title={opt.label}
							onClick={() => contentAlignmentHandler(opt.value)}
							className={`ctlb-segmented-btn${contentAlignment == opt.value ? " is-active" : ""}`}
						>
							<span className={`dashicons dashicons-${opt.icon}`}></span>
						</Button>
					))}
				</ButtonGroup>
			</div>
			</div>
		</CardBody>
		);
		let settingTabs =
		<InspectorControls>
			<TabPanel
				className="cooltimeline-tab-settings"
				activeClass="active-tab"
				tabs={ [
					{
						name: 'timeline_setting',
						title: 'General',
						className: 'ctlb-tabs ctlb-general-tab',
						content: timeline_setting
					},
					{
						name: 'general_setting',
						title: 'Style',
						className: 'ctlb-tabs  ctlb-style-tab',
						content: general_setting
					},
					{
						name: 'advanced_setting',
						title: 'Advanced',
						className: 'ctlb-tabs ctlb-advanced-tab',
						content: advanced_setting
					},
				] }
			>
				{ ( tab ) => <Card>{tab.content}</Card> }
			</TabPanel>
			{footer_links}
		</InspectorControls>
		const getContentTimelineTemplate = memoize((icon_block, tm_content) => {
			return times(icon_block, n => ['cp-timeline/content-timeline-block-child', tm_content[n]])
		})
		let loadHeadGoogleFonts
		let loadSubHeadGoogleFonts
		let loadDateGoogleFonts
		if (headLoadGoogleFonts == true && this.ref.current) {
			const headconfig = {
				google: {
					families: [headFontFamily + (headFontWeight ? ":" + headFontWeight : "")],
				},
			}
			loadHeadGoogleFonts = (
				<WebfontLoader config={headconfig} windowRef={this.ref}>
				</WebfontLoader>
			)
		}

		if (subHeadLoadGoogleFonts == true && this.ref.current) {
			const subHeadconfig = {
				google: {
					families: [subHeadFontFamily + (subHeadFontWeight ? ":" + subHeadFontWeight : "")],
				},
			}
			loadSubHeadGoogleFonts = (
				<WebfontLoader config={subHeadconfig} windowRef={this.ref}>
				</WebfontLoader>
			)
		}

		if (dateLoadGoogleFonts == true && this.ref.current) {
			const dateconfig = {
				google: {
					families: [dateFontFamily + (dateFontWeight ? ":" + dateFontWeight : "")],
				},
			}
			loadDateGoogleFonts = (
				<WebfontLoader config={dateconfig} windowRef={this.ref}>
				</WebfontLoader>
			)
		}

		return (
			isPreview ? <img width='100%' src={ preview } alt=''/>:
			<Fragment>
				  <div>
					  { timelineDesign == "vertical" ?
			  <BlockControls group="block">
				<ToolbarDropdownMenu
					icon="layout"
					label="Layout"
					controls={ [
						{
							title: 'Both Sided',                  
							onClick: () => setAttributes({timelinDesign:"both-sided"}) ,
						},
						{
							title: 'One Sided',
							onClick: () => setAttributes({timelinDesign:"one-sided"}),
						},
					] }
					/>
			</BlockControls>
				:null}
			{ loadHeadGoogleFonts }
			 {loadSubHeadGoogleFonts }
			{settingTabs}
			{loadDateGoogleFonts }
		
			<p className="ctlb-editor-notice" role="note">
				{__("Editor preview may look a little different from the frontend. Your theme styles can be applied on the editor page.", "timeline-block")}
			</p>
			<div className={"cool-timeline-block-" + this.props.clientId + " cool-timeline-block"} ref={this.ref}>
							<div className={`cool-${timelineLayout}-timeline-body ctlb-wrapper ${newDesignClass} ${timelineDesign} ${Orientation}`}>
								<div className="cool-timeline-block-list">
									<InnerBlocks
									allowedBlocks={ALLOWED_BLOCKS}
									orientation="vertical"
									template={ getContentTimelineTemplate( timelineItem, tm_content ) } 
									navItemUpdate={timelineNavItems}
									// template={template}
									/>
							</div>	
						</div><div  className="timeline-block-add-story">
								<button type="button" visible="true" onClick={e => this.addBlock(e)} className="components-button block-editor-button-block-appender is-primary" aria-label="Add Story"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-hidden="true" focusable="false"><path d="M18 11.2h-5.2V6h-1.6v5.2H6v1.6h5.2V18h1.6v-5.2H18z"></path></svg>Add Story</button>
							</div>
							</div>
		</div>
			</Fragment>

	)
	}

	componentDidMount() {
		// //Store client id.
		this.props.setAttributes( { block_id: this.props.clientId } )
		
		// Pushing Style tag for this block css.
		if(this.getDocument()){
			const $style = this.getDocument().createElement( "style");
		$style.setAttribute( "id", "cool-vertical-timeline-style-" + this.props.clientId)
		this.getDocument().head.appendChild( $style )
		}
		 
	}
}
export default Edit;
