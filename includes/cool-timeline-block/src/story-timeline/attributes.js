/**
 * BLOCK: Cool Timeline Attributes
 */

import { __ } from '@wordpress/i18n';

const ITEM_COUNT = 3

const item = [];
const date_arr = [];
const example = {
	'data1' : {
		"time_heading": __( "Amazon is born",'timeline-block' ),
		"time_desc": __( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Erat enim res aperta. Ne discipulum abducam, times. Primum quid tu dicis breve? An haec ab eo non dicuntur?",'timeline-block' ),
		"timeLineImage": "https://cooltimeline.com/wp-content/uploads/2025/11/amazon1-16.jpg",
		"t_date": "July 5, 1994",
	},
	'data2' : {
		"time_heading": __( "Amazon Prime debuts",'timeline-block' ),
		"time_desc": __( "Aliter homines, aliter philosophos loqui putas oportere? Sin aliud quid voles, postea. Mihi enim satis est, ipsis non satis. Negat enim summo bono afferre incrementum diem. Quod ea non occurrentia fingunt, vincunt Aristonem., you can change me anytime click here, ",'timeline-block' ),
		"timeLineImage": "https://cooltimeline.com/wp-content/uploads/2025/11/amazon2-15.jpg",
		"t_date": "Feb 2, 2020",
	},
	'data3' : {
		"time_heading": __( "Amazon acquires Audible",'timeline-block' ),
		"time_desc": __( "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",'timeline-block' ),
		"timeLineImage": "https://cooltimeline.com/wp-content/uploads/2025/11/amazon3-15.png",
		"t_date": "Jan 31, 2021",
	},
};
for (var i = 1; i <= ITEM_COUNT; i++) {

	if(i%2==0){
		var class_postion="left"
	}
	else{
		var class_postion="right"
	}
	const data = example['data'+i];
	item.push(
		{
			"time_heading": data.time_heading,
			"time_desc": data.time_desc,
			"timeLineImage": data.timeLineImage,
			"t_date": data.t_date,
			"imageSize": "full",
			"blockPosition":__(class_postion,"timeline-block"),
		}
	)
	var j = i - 1
	var today = new Date( "1/1/2019" )
	var dd = today.getDate()
	var mm = today.getMonth()+1 //January is 0!
	var yyyy = today.getFullYear()-j
	if( dd < 10 ) {
		dd = "0" + dd
	}
	if( mm < 10 ) {
		mm = "0" + mm
	}
	today = mm + "/" + dd + "/" + yyyy
	var p = { "title" : today }
	date_arr.push(
		{
			"title": today,
		}
	)
}

const attributes = {
	content_class: {
		type : "string",
	},
	tm_content: {
		type: "array",
		default : item,
	},
	classMigrate: {
		type: "boolean",
		default: false
	},
	childMigrate: {
		type: "boolean",
		default: false
	},
	itemSpacing:{
		type: "number",
		default: '',
	},
    itemSpacingType:{
		type: "string",
		default: "px",
	},
	contentAlignment:{
		type: "string",
		default: "",
	},
	titileBtSpacing: {
		type: "number",
		default: "",
	},
	titileBtSpacingType: {
		type: "string",
		default: "px",
	},
	descBtSpacing: {
		type: "number",
		default: "",
	},
	descBtSpacingType: {
		type: "string",
		default: "px",
	},
	dateFormat: {
		type: "string",
		default: "F j, Y"
	},
	align : {
		type : "string",
		default : "center",
	},
	headingColor : {
		type : "string",
		default : '',
	},
	subHeadingColor : {
		type : "string",
		default : '',
	},
	separatorBg : {
		type : "string",
		default : "#eee",
	},
	backgroundColor : {
		type : "string",
		default : "#eee",
	},
	separatorColor : {
		type : "string",
		default : "#eee",
	},
	separatorFillColor : {
		type : "string",
		default : "#61ce70",
	},
	separatorBorder : {
		type : "string",
		default : "#eee",
	},
	borderFocus : {
		type : "string",
		default : "#5cb85c",
	},
	isPreview: {
		type: 'boolean',
		default: false,
	},
	headingTag : {
		type : "string",
		default : "h3",
	},
	horizontalSpace : {
		type : "number",
		default : 10,
	},
	verticalSpace : {
		type : "number",
		default : 15,
	},
	headFontSize : {
		type : "number",
	},
	headFontSizeType: {
		type: "string",
		default: "px"
	},
	headFontSizeTablet: {
		type: "number",
	},
	headFontSizeMobile: {
		type: "number",
	},
	headFontFamily: {
		type: "string",
		default: "Default",
	},
	headFontWeight: {
		type: "string",
	},
	headFontSubset: {
		type: "string",
	},
	headLineHeightType: {
		type: "string",
		default: "px"
	},
	headLineHeight: {
		type: "number",
	},
	headLineHeightTablet: {
		type: "number",
	},
	headLineHeightMobile: {
		type: "number",
	},
	headLoadGoogleFonts: {
		type: "boolean",
		default: false
	},
	timelinAlignment : {
		type : "string",
		default : "center",
	},
	arrowlinAlignment : {
		type : "string",
		default : "center",
	},
	subHeadFontSizeType: {
		type: "string",
		default: "px"
	},
	subHeadFontSize: {
		type: "number",
	},
	subHeadFontSizeTablet: {
		type: "number",
	},
	subHeadFontSizeMobile: {
		type: "number",
	},
	subHeadFontFamily: {
		type: "string",
		default: "Default",
	},
	subHeadFontWeight: {
		type: "string",
	},
	subHeadFontSubset: {
		type: "string",
	},
	subHeadLineHeightType: {
		type: "string",
		default: "px",
	},
	subHeadLineHeight: {
		type: "number",
	},
	subHeadLineHeightTablet: {
		type: "number",
	},
	subHeadLineHeightMobile: {
		type: "number",
	},
	subHeadLoadGoogleFonts: {
		type: "boolean",
		default: false
	},
	headSpace : {
		type : "number",
		default : 5,
	},
	separatorwidth : {
		type : "number",
		default : 3,
	},
	borderwidth : {
		type : "number",
		default : 0,
	},
	iconFocus : {
		type : "string",
		default : "#fff",
	},
	iconBgFocus : {
		type : "string",
		default : "#61ce70",
	},
	dateColor : {
		type : "string",
		default : "",
	},
	dateFontsizeType: {
		type: "string",
		default: "px"
	},
	dateFontsize: {
		type: "number",
	},
	dateFontsizeTablet: {
		type: "number",
	},
	dateFontsizeMobile: {
		type: "number",
	},
	dateFontFamily: {
		type: "string",
		default: "Default",
	},
	dateFontWeight: {
		type: "string",
	},
	dateFontSubset: {
		type: "string",
	},
	dateLineHeightType: {
		type: "string",
		default: "px"
	},
	dateLineHeight: {
		type: "number",
	},
	dateLineHeightTablet: {
		type: "number",
	},
	dateLineHeightMobile: {
		type: "number",
	},
	dateLoadGoogleFonts: {
		type: "boolean",
		default: false
	},
	connectorBgsize : {
		type : "number",
		default : 35,
	},
	subHeadSpace : {
		type : "number",
		default : 5,
	},
	dateBottomspace : {
		type : "number",
		default : 5,
	},
	block_id  : {
		type : "string",
		default : "0",
	},
	timelineItem :{
		type : "number",
		default : ITEM_COUNT,
	},
	tm_client_id  : {
		type : "string",
		default : "not_set",
	},
	borderRadius : {
		type : "number",
		default : 2,
	},
	bgPadding : {
		type : "number",
		default : 20,
	},
	iconSize : {
		type : "number",
		default : "",
	},
	icon : {
		type : "string",
		default : "fab fa fa-calendar-alt"
	},
	t_date : {
		type: "array",
		default: date_arr,
	},
	displayPostDate:{
		type: "boolean",
		default: true,
	},
	stack: {
		type: "string",
		default: "tablet"
	},
	timelineLayout:{
		type:"string",
		default:"vertical"
	},
	iconSizeType:{
		type: "string",
		default: "px"
	},
	iconBoxSize:{
		type : "number",
		default : "",
	},
	iconBoxSizeType:{
		type: "string",
		default: "px"
	},
	middleLineSize:{
		type : "number",
		default : "",
	},
	middleLineSizeType:{
		type: "string",
		default: "px"
	},
	Orientation:{
		type:"string",
		default:"left"
	},
	BothsidedOrientation:{
		type:"string",
		default:"right",
	},
	LineColor:{
		type:"string",
		default:""
	},
	iconBg:{
		type:"string",
		default:""
	},
	storyBorderColor:{
		type:"string",
		default:""
	},
	iconToggle: {
		type: "boolean",
		default: false
	},
	timelineDesign: {
		type: "string",
		default: "both-sided"
	},
	sliderActive:{
		type:"boolean",
		default:false
	},
	innerBlockCount:{
		type:"number",
		default:0
	}
	,
	spinnerActive:{
		type:"boolean",
		default:false
	},
	slidePerView:{
		type:"number",
		default:3
	},
	iconColor:{
		type:"string",
		default:""
	},
	containerTopPadding:{
		type:"number",
		default:''
	},
	containerRightPadding:{
		type:"number",
		default:''
	},
	containerBottomPadding:{
		type:"number",
		default:''
	},
	containerLeftPadding:{
		type:"number",
		default:''
	},
	desktopConatinerPaddingType:{
		type:"string",
		default: "px"
	},
	marginLink:{
		type:"boolean",
		default: false
	},
	OrientationCheckBox:{
		type:"boolean",
		default:false,
	},
	ImagePopup:{
		type:"boolean",
		default:false
	},
	hrSliderUpdate:{
		type: 'object',
		default: {
			update: true,
			index: 0,
		}
	}
}

export default attributes
