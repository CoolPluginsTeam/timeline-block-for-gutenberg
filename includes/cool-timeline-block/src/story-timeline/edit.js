import preview from "../component/icon/timeline.png"
// import map from "lodash/map.js";
import times from "lodash/times.js";
import memoize from "memize"

import contentTimelineStyle from "./styling.js";

// Import all of our Text Options requirements.
import TypographyControl from "../component/typography/index.js";
// Import different sides unts controler
import SpacingControl from "../component/customComponents/MultipleUnits.js";

// // Import Web font loader for google fonts.y
import WebfontLoader from "../component/typography/fontloader.js";

const { Component, Fragment } = wp.element

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
	ColorPalette,
	Card,
	CardBody,
	Button,
	ButtonGroup,
	ToggleControl
} = wp.components

const {
	dispatch,
	select
} = wp.data
const ALLOWED_BLOCKS = ["cp-timeline/content-timeline-block-child"]

class Edit extends Component {
	constructor() {
		super();
		this.onUpdateOrientation = this.onUpdateOrientation.bind(this);
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

	// custom color reset option
	resetcolorpalate = (e) => {
		this.props.setAttributes( e )
	};
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
		var element = document.getElementById("cool-vertical-timeline-style-" + this.props.clientId)
		if( element ) {
			element.innerHTML = contentTimelineStyle( this.props )
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
			/>
			</Fragment>:null;
		const general_setting=<CardBody>
		<h2 className="timeline-block-settings-labels">Story Heading</h2>
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
		<div style={{ 'marginTop': 10 + 'px' }}></div>
			<CardBody className="cp-timeline-block-style-settings">
				<div>{__("Text Color", "timeline-block")}</div>
				<div className={`components-button timeline-block-colorpallete-reset is-small ${headingColor != '' && 'timeline-color-setting_apply'}`} onClick={e => this.resetcolorpalate({ headingColor: '' })}><span className="dashicon dashicons dashicons-image-rotate"></span></div>
				<ColorPalette className="cp-timeline-block-color-palates"
					clearable={false}
					colors={
						[
							{ name: 'default', color: headingColor }
						]
					}
					value={headingColor}
					onChange={(colorValue) => setAttributes({ headingColor: colorValue })}
				/>
			</CardBody>
	<div style ={{'marginTop':15 +'px'}}>{__("Bottom Spacing","timeline-block")}</div>
	<RangeControl
	className="cp-timeline-block-range__control"
	value={ titileBtSpacing != '' ? titileBtSpacing : 0 }
	onChange={ (value) => setAttributes({titileBtSpacing: value}) }
	resetFallbackValue={0}
	allowReset={ true }
	min={ 0 }
	max={ 200 }
	/>
	<hr className="timeline-block-editor__separator"></hr>
	<h2 className="timeline-block-settings-labels">Story Description</h2>
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
		<div style={{ 'marginTop': 15 + 'px' }}></div>
			<CardBody className="cp-timeline-block-style-settings">
				<div>{__("Text Color", "timeline-block")}</div>
				<div className={`components-button timeline-block-colorpallete-reset is-small ${subHeadingColor != '' && 'timeline-color-setting_apply'}`} onClick={e => this.resetcolorpalate({ subHeadingColor: '' })}><span className="dashicon dashicons dashicons-image-rotate"></span></div>
				<ColorPalette className="cp-timeline-block-color-palates"
					clearable={false}
					colors={
						[
							{ name: 'default', color: subHeadingColor }
						]
					}
					value={subHeadingColor}
					onChange={(colorValue) => setAttributes({ subHeadingColor: colorValue })}
				/>
			</CardBody>
	<div style ={{'marginTop':15 +'px'}}>{__("Bottom Spacing","timeline-block")}</div>
	<RangeControl
	className="cp-timeline-block-range__control"
	value={descBtSpacing != '' ? descBtSpacing : 0 }
	onChange={ (value) => setAttributes({descBtSpacing: value}) }
	resetFallbackValue = {0}
	allowReset={ true }
	min={ 0 }
	max={ 200 }
	/>
	<hr className="timeline-block-editor__separator"></hr>
	<h2 className="timeline-block-settings-labels">Primary Label(Date/Steps)</h2>
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
	<div style ={{'marginTop':10 +'px'}}></div>
	<div className="cp-timeline-block-style-settings">
	<div>{__("Text Color","timeline-block")}</div>
	<div className={`components-button timeline-block-colorpallete-reset is-small ${dateColor != '' && 'timeline-color-setting_apply'}`} onClick={e => this.resetcolorpalate({dateColor : ''}) }><span className="dashicon dashicons dashicons-image-rotate"></span></div>
	<ColorPalette className="cp-timeline-block-color-palates"
		clearable={false}
		colors={
			[
				{ name: 'default', color: dateColor }
			]
		}
		value={dateColor}
		onChange = {( colorValue ) => setAttributes( { dateColor: colorValue} )}
	/>
	</div>
</CardBody>
		const advanced_setting =
		<CardBody>
		<div className="cp-timeline-block-style-settings">
		<h2>Line Color</h2>
		<div className={`components-button timeline-block-colorpallete-reset is-small ${LineColor != '' && 'timeline-color-setting_apply'}`} onClick={e => this.resetcolorpalate({LineColor : ''}) }><span className="dashicon dashicons dashicons-image-rotate"></span></div>
		<ColorPalette className="cp-timeline-block-color-palates"
		clearable={false}
		colors={
			[
				{ name: 'default', color: LineColor }
			]
		}
		value={LineColor}
		onChange = {( colorValue ) => setAttributes( { LineColor: colorValue} )}
		/>
		</div>
		<div className="cp-timeline-block-style-settings">
		<h2>Icon Color</h2>
		<div className={`components-button timeline-block-colorpallete-reset is-small ${iconColor != '' && 'timeline-color-setting_apply'}`} onClick={e => this.resetcolorpalate({iconColor : ''}) }><span className="dashicon dashicons dashicons-image-rotate"></span></div>
		<ColorPalette className="cp-timeline-block-color-palates"
		clearable={false}
		colors={
			[
				{ name: 'default', color: iconColor }
			]
		}
		value={iconColor}
		onChange = {( colorValue ) => setAttributes( { iconColor: colorValue } )}
		/>
		</div>
		<div className="cp-timeline-block-style-settings">
		<h2>Icon Background</h2>
		<div className={`components-button timeline-block-colorpallete-reset is-small ${iconBg != '' && 'timeline-color-setting_apply'}`} onClick={e => this.resetcolorpalate({iconBg : ''}) }><span className="dashicon dashicons dashicons-image-rotate"></span></div>
		<ColorPalette className="cp-timeline-block-color-palates"
		clearable={false}
		colors={
			[
				{ name: 'default', color: iconBg }
			]
		}
		value={iconBg}
		onChange = {( colorValue ) => setAttributes( { iconBg: colorValue } )}
		/>
		</div>
		<div className="cp-timeline-block-style-settings">
		<h2>Story Border Color</h2>
		<div className={`components-button timeline-block-colorpallete-reset is-small ${storyBorderColor != '' && 'timeline-color-setting_apply'}`} onClick={e => this.resetcolorpalate({storyBorderColor : ''}) }><span className="dashicon dashicons dashicons-image-rotate"></span></div>
		<ColorPalette className="cp-timeline-block-color-palates"
		clearable={false}
		colors={
			[
				{ name: 'default', color: storyBorderColor }
			]
		}
		value={storyBorderColor}
		onChange = {( colorValue ) => setAttributes( { storyBorderColor: colorValue } )}
		/>
		</div>
		{/* Item spacing controller*/}
		{
		timelineLayout == 'vertical' &&
		<Fragment>
		<h2>{__("Item Spacing","timeline-block")}</h2>
		<RangeControl
		className="cp-timeline-block-range__control"
		value={itemSpacing != '' ? itemSpacing : 0 }
		onChange={ (value) => setAttributes({itemSpacing: value}) }
		resetFallbackValue = {0}
		allowReset={ true }
		min={ 0 }
		max={ 200 }
		/>
		</Fragment>
		}
		{/* Icon Box size controller */}
		<h2>{__("Icon Box Size","timeline-block")}</h2>
		<RangeControl
		className="cp-timeline-block-range__control"
		value={iconBoxSize != '' ? iconBoxSize : 0 }
		onChange={ (value) => setAttributes({iconBoxSize: value}) }
		resetFallbackValue = {0}
		allowReset={ true }
		min={ 20 }
		max={ 100 }
		/>
		{/* Icon font size controller */}
		<h2>{__("Icon Size","timeline-block")}</h2>
		<RangeControl
		className="cp-timeline-block-range__control"
		value={iconSize != '' ? iconSize : 0 }
		onChange={ (value) => setAttributes({iconSize: value}) }
		resetFallbackValue = {0}
		allowReset={ true }
		min={ 0 }
		max={ 100 }
		/>
		{/* middle line size controller */}
		<h2>{__("Line Size","timeline-block")}</h2>
		<RangeControl
		className="cp-timeline-block-range__control"
		value={middleLineSize != '' ? middleLineSize : 0 }
		onChange={ (value) => setAttributes({middleLineSize: value}) }
		resetFallbackValue = {0}
		allowReset={ true }
		min={ 0 }
		max={ 10 }
		/>

		{/* contaier box padding controler */}
		<SpacingControl
			{ ...this.props }
			label={ __( 'Container Padding', 'timeline-block' ) }
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
			attributes={ this.props.attributes }
			setAttributes={ setAttributes }
			link={ {
				value: marginLink,
				label: 'marginLink',
			} }
		/>
	</CardBody>
		const rating_box = <PanelBody title={__("Please Share Your Valuable Feedback.", "timeline-block")}>
			<CardBody className={"cool-timeline-gt-block-review-tab"}>{__("We hope you liked our plugin created timelines. Please share your valuable feedback.", "timeline-block")}<br></br><a href="https://wordpress.org/support/plugin/timeline-block/reviews/#new-post" className="components-button is-primary is-small" target="_blank" rel="noopener noreferrer" >Rate Us<span> ★★★★★</span></a>
			</CardBody>
		</PanelBody>
		const timeline_setting = <CardBody>
		<SelectControl
					label={ __( "Timeline Layout",'timeline-block' ) }
					value={ timelineLayout }
					onChange={(value)=>{
						if(value == "vertical"){
						setAttributes({timelineLayout:value, sliderActive:false})
						}
						select('core/block-editor').getBlocksByClientId(this.props.clientId)[0].innerBlocks.forEach(function (block,key) {
							dispatch('core/block-editor').updateBlockAttributes(block.clientId, ({ timelineLayout: value}))
						})
					}
				}
					options={ [
						{ value: "vertical", label: __( "Vertical","timeline-block") },
						// { value: "horizontal", label: __( "Horizontal (PRO)","timeline-block"), disabled: true }
					] }
					__nextHasNoMarginBottom={ true }
					/>
				{timelineLayout == "vertical" ?
				<SelectControl
				label={ __( "Timeline Design","timeline-block" ) }
					value={ timelineDesign }
					onChange={ ( value ) => {setAttributes( { timelineDesign: value } )
					select('core/block-editor').getBlocksByClientId(this.props.clientId)[0].innerBlocks.forEach(function (block,key) {
						dispatch('core/block-editor').updateBlockAttributes(block.clientId, ({ timelineDesign: value }))
					})
				} }
					options={ [
						{ value: "both-sided", label: __( "Both Sided","timeline-block") },
						{ value: "one-sided", label: __( "One Sided","timeline-block") },
						
					] }
					__nextHasNoMarginBottom={ true }
					/>:
					<RangeControl
						label="Slides"
						value={ slidePerView }
						onChange={ ( value ) => {
							setAttributes({slidePerView: value,sliderActive:false})
						}
						}
						min={ 1 }
						max={ 6 }
						step={ 1 }
					/>
				}

				{
					(timelineLayout == "vertical" && timelineDesign == 'both-sided') ? 
					<div className="components-base-control">
					<label className="timeline-block-settings-labels">{__("Alternating Sided","timeline-block")}</label>
					<ToggleControl
					className="timeline-block-Orientation_checkbox"
					checked={ OrientationCheckBox }
					onChange={ (state) => {
						setAttributes({OrientationCheckBox : state}),this.OrientationCheck(state);
					} }
					__nextHasNoMarginBottom={ true }
					/>
					</div>
					: null
				}

				{/* {((timelineDesign == "one-sided" && timelineLayout == "vertical") || (timelineLayout == "vertical" && timelineDesign == 'both-sided' && OrientationCheckBox)) ? orientation_setting : null } */}
				{ ["one-sided",'both-sided'].includes(timelineDesign) && timelineLayout == "vertical" ? orientation_setting : null }
				<div className="timeline-block-settings-labels">{__("Content Alignment","timeline-block")}</div>
				<ButtonGroup className="cool-timeline-content-alignment-buttons">
					<Button onClick={(e) => {setAttributes({contentAlignment: 'left'})}} className={contentAlignment == 'left' ? 'active': ''}><span className="dashicons dashicons-editor-alignleft"></span></Button>
					<Button onClick={(e) => {setAttributes({contentAlignment: 'center'})}} className={contentAlignment == 'center' ? 'active': ''}><span className="dashicons dashicons-editor-aligncenter"></span></Button>
					<Button onClick={(e) => {setAttributes({contentAlignment: 'right'})}} className={contentAlignment == 'right' ? 'active': ''}><span className="dashicons dashicons-editor-alignright"></span></Button>
				</ButtonGroup>
		</CardBody>
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
			{/* demo video link button */}
			<PanelBody title={__("View Timeline Demos","timeline-block")} initialOpen={false}>
				<CardBody className="cp-timeline-block-demo-button">
					<a target="_blank" rel="noopener noreferrer" className="button button-primary" href="https://cooltimeline.com/demo/gutenberg-timeline-block?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=demo&utm_content=timeline_block">View Demos</a>
					<a target="_blank" rel="noopener noreferrer" className="button button-primary" href="https://cooltimeline.com/docs/timeline-block-pro/video-tutorials/free-plugin-video/?utm_source=tbg_plugin&utm_medium=inside&utm_campaign=docs&utm_content=timeline_block">Watch Videos</a>
				</CardBody>
			</PanelBody>
			{rating_box}
		</InspectorControls>
		const getContentTimelineTemplate = memoize((icon_block, tm_content) => {
			return times(icon_block, n => ['cp-timeline/content-timeline-block-child', tm_content[n]])
		})
		let loadHeadGoogleFonts
		let loadSubHeadGoogleFonts
		let loadDateGoogleFonts
		if (headLoadGoogleFonts == true) {
			const headconfig = {
				google: {
					families: [headFontFamily + (headFontWeight ? ":" + headFontWeight : "")],
				},
			}
			loadHeadGoogleFonts = (
				<WebfontLoader config={headconfig}>
				</WebfontLoader>
			)
		}

		if (subHeadLoadGoogleFonts == true) {
			const subHeadconfig = {
				google: {
					families: [subHeadFontFamily + (subHeadFontWeight ? ":" + subHeadFontWeight : "")],
				},
			}
			loadSubHeadGoogleFonts = (
				<WebfontLoader config={subHeadconfig}>
				</WebfontLoader>
			)
		}

		if (dateLoadGoogleFonts == true) {
			const dateconfig = {
				google: {
					families: [dateFontFamily + (dateFontWeight ? ":" + dateFontWeight : "")],
				},
			}
			loadDateGoogleFonts = (
				<WebfontLoader config={dateconfig}>
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
		
			<div className={"cool-timeline-block-" + this.props.clientId + " cool-timeline-block"}>
							<div className={`cool-${timelineLayout}-timeline-body ctlb-wrapper ${timelineDesign} ${Orientation}`}>
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
		const $style = document.createElement( "style" )
		$style.setAttribute( "id", "cool-vertical-timeline-style-" + this.props.clientId )
		document.head.appendChild( $style )
	}
} export default
	(Edit)