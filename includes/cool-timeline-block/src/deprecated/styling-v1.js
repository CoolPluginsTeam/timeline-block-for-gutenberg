/**
 * Returns Dynamic Generated CSS
 */

import generateCSS from "./generateCss-v1.js"
import generateCSSUnit from "../component/css/generateCSSUnit.js"

const addAlpha = (color, opacity) => {
    // coerce values so ti is between 0 and 1.
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}; // returns 'FF0000FF'

function deprContentTimelineStyle( props ) {
   const {
        itemSpacing,
        itemSpacingType,
        contentAlignment,
       iconColor,
       dateFontsizeType,
       dateFontsize,
       dateFontsizeTablet,
       dateFontsizeMobile,
       dateFontFamily,
       dateFontWeight,
       dateLineHeightType,
       dateLineHeight,
       dateColor,
       iconSize,
       iconFocus,
       iconBgFocus,
       block_id,
       headFontSizeType,
       headFontSize,
       headFontSizeTablet,
       headFontSizeMobile,
       headFontFamily,
       headFontWeight,
       headLineHeightType,
       headLineHeight,
       headLineHeightTablet,
       headLineHeightMobile,
       align,
       headingColor,
       headSpace,
       titileBtSpacing,
       titileBtSpacingType,
       descBtSpacing,
       descBtSpacingType,
       subHeadFontSizeType,
       subHeadFontSize,
       subHeadFontFamily,
       subHeadFontWeight,
       subHeadLineHeightType,
       subHeadLineHeight,
       subHeadLineHeightTablet,
       subHeadLineHeightMobile,
       subHeadingColor,
       LineColor,
       iconBg,
       storyBorderColor,
       iconSizeType,
       iconBoxSize,
       iconBoxSizeType,
       middleLineSize,
       middleLineSizeType,
       containerTopPadding,
       containerRightPadding,
       containerBottomPadding,
       containerLeftPadding,
       desktopConatinerPaddingType,
   } = props.attributes
   let arrow_position=(iconBoxSize != '' && iconBoxSize > 20) ? "calc("+Math.round(iconBoxSize / 2)+"px)" : '';
   let middleline_position = '';
   if(arrow_position != ''){
      middleline_position = "calc( 30.6% + "+generateCSSUnit(Math.round(iconBoxSize / 2),iconBoxSizeType)+")";
   };
   let border_color = addAlpha(LineColor != '' ? LineColor : "#D91B3E",0)
   var resp_selectors = "left"

   var selectors = {
    " .cool-vertical-timeline-body .timeline-block-vertical-timeline" : {
        "margin-bottom" : itemSpacing != '' ? generateCSSUnit(itemSpacing, itemSpacingType) : '',
        "text-align" : contentAlignment != '' ? contentAlignment : '',
    },
    " .cool-vertical-timeline-body .timeline-block-timeline" : {
        "margin-bottom" : itemSpacing != '' ? generateCSSUnit(itemSpacing, itemSpacingType) : '',
        "text-align" : contentAlignment != '' ? contentAlignment : '',
    },
    " .cool-vertical-timeline-body .story-details h3" : {
        "font-size" : generateCSSUnit( headFontSize, headFontSizeType ),
        "font-family": headFontFamily,
        "font-weight": headFontWeight,
        "line-height": generateCSSUnit( headLineHeight, headLineHeightType ),
        "color": headingColor,
        "margin-bottom": titileBtSpacing != '' ? generateCSSUnit(titileBtSpacing , titileBtSpacingType) : '',
    },
    " .cool-horizontal-timeline-body .story-details h3" : {
        "font-size" : generateCSSUnit( headFontSize, headFontSizeType ),
        "font-family": headFontFamily,
        "font-weight": headFontWeight,
        "line-height": generateCSSUnit( headLineHeight, headLineHeightType ),
        "color": headingColor,
    },
    " .cool-vertical-timeline-body .story-time p" : {
        "color": dateColor != '' ? dateColor : '#333',
        "font-size" : generateCSSUnit( dateFontsize, dateFontsizeType ),
        "font-family": dateFontFamily,
        "font-weight": dateFontWeight,
        "line-height": generateCSSUnit( dateLineHeight, dateLineHeightType ),
    },
    " .cool-horizontal-timeline-body .story-time p" : {
        "color": dateColor != '' ? dateColor : '#333',
        "font-size" : generateCSSUnit( dateFontsize, dateFontsizeType ),
        "font-family": dateFontFamily,
        "font-weight": dateFontWeight,
        "line-height": generateCSSUnit( dateLineHeight, dateLineHeightType ),
    },
    " .cool-vertical-timeline-body .story-details p" : {
        "font-size" : generateCSSUnit( subHeadFontSize, subHeadFontSizeType ),
        "font-family": subHeadFontFamily,
        "font-weight": subHeadFontWeight,
        "line-height": generateCSSUnit( subHeadLineHeight, subHeadLineHeightType ),
        "color": subHeadingColor,
        "margin-bottom": descBtSpacing != '' ? generateCSSUnit(descBtSpacing , descBtSpacingType) : '',
    },
    " .cool-horizontal-timeline-body .story-details p" : {
        "font-size" : generateCSSUnit( subHeadFontSize, subHeadFontSizeType ),
        "font-family": subHeadFontFamily,
        "font-weight": subHeadFontWeight,
        "line-height": generateCSSUnit( subHeadLineHeight, subHeadLineHeightType ),
        "color": subHeadingColor,
    },
    " .cool-vertical-timeline-body::before" :{
        "background":"linear-gradient(to bottom, rgba(230, 230, 230, 0) 0%, "+`${LineColor != '' ? LineColor : "#D91B3E"}`+" 10%, "+`${LineColor != '' ? LineColor : "#D91B3E"}`+" 90%, rgba(230, 230, 230, 0) 100%)",
        "width": middleLineSize != '' ? generateCSSUnit(middleLineSize, middleLineSizeType) : '',
    },
    " .cool-vertical-timeline-body.one-sided.left::before":{        
        "left": middleline_position != '' ? middleline_position : '',
        "transform": middleline_position != '' ? "translateX(-50%)" : ''
    },
    " .cool-vertical-timeline-body.one-sided.right::before":{        
        "right": middleline_position != '' ? middleline_position : '',
        "transform": middleline_position != '' ? "translateX(50%)" : '',
    },
    " .cool-horizontal-timeline-body .timeline-content::before" :{
        "background":LineColor != '' ? LineColor : "#D91B3E"
    },
    " .cool-horizontal-timeline-body .timeline-content::after" :{
        "background":LineColor != '' ? LineColor : "#D91B3E"
    },
    " .cool-vertical-timeline-body .timeline-content::before" :{
        "background": `${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`
    },
    " .cool-vertical-timeline-body.left .story-details::after" :{
        "background":`${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`
    },
    " .cool-vertical-timeline-body.right .story-time::after" :{
        "background":`${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`
    },
    " .cool-vertical-timeline-body .timeline-content .timeline-block-icon" :{
        "background":`${iconBg != '' ? iconBg : "#D91B3E"} !important`,
        "width": iconBoxSize != '' ? "calc("+generateCSSUnit(iconBoxSize, iconBoxSizeType) +" + "+ generateCSSUnit((iconBoxSize * 0.20), iconBoxSizeType)+")" : '',
        "height": iconBoxSize != '' ? generateCSSUnit(iconBoxSize, iconBoxSizeType) : '',
        "font-size": iconSize != '' ? generateCSSUnit(iconSize, iconSizeType) : '',
    },
    " .cool-vertical-timeline-body.both-sided .timeline-content .timeline-block-icon" :{
        "width": iconBoxSize != '' ? "calc("+generateCSSUnit(iconBoxSize, iconBoxSizeType) +" + "+ generateCSSUnit((iconBoxSize * 0.20), iconBoxSizeType)+" - 6px)" : '',
    },
    " .cool-vertical-timeline-body .timeline-content .timeline-block-icon span.timeline-block-render-icon svg":{
        "width": iconSize != '' ? generateCSSUnit(iconSize, iconSizeType) : '',
        "height": iconSize != '' ? generateCSSUnit(iconSize, iconSizeType) : '',
    },
    " .cool-horizontal-timeline-body .timeline-content .timeline-block-icon":{
        "background":iconBg != '' ? iconBg+" !important" : "#D91B3E"+" !important",
    },
    " .cool-vertical-timeline-body.both-sided .timeline-content .position-right .story-details::before" :{
        "border-right-color": `${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`,
        "margin-top": arrow_position != '' ? arrow_position : '',
        "transform": arrow_position != '' ? "translateY(-50%)" : ''
    },
    " .cool-vertical-timeline-body.both-sided .timeline-content .position-left  .story-details::before" :{
        "border-left-color": `${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`,
        "margin-top": arrow_position != '' ? arrow_position : '',
        "transform": arrow_position != '' ? "translateY(-50%)" : ''
    },
    " .cool-vertical-timeline-body.one-sided.left .timeline-content  .story-details::before" :{
        "border-right-color": `${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`,
        "margin-top": arrow_position != '' ? arrow_position : '',
        "transform": arrow_position != '' ? "translateY(-50%)" : ''
    },
    " .cool-vertical-timeline-body.one-sided.right .timeline-content  .story-details::before" :{
        "border-left-color": `${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`,
        "margin-top": arrow_position != '' ? arrow_position : '',
        "transform": arrow_position != '' ? "translateY(-50%)" : ''
    },
    " .cool-vertical-timeline-body .timeline-content  .story-details" :{
        "border-color": `${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`,
        "padding-top": containerTopPadding != '' ? generateCSSUnit(containerTopPadding, desktopConatinerPaddingType) : '',
        "padding-right": containerRightPadding != '' ? generateCSSUnit(containerRightPadding, desktopConatinerPaddingType) : '',
        "padding-bottom": containerBottomPadding != '' ? generateCSSUnit(containerBottomPadding, desktopConatinerPaddingType) : '',
        "padding-left": containerLeftPadding != '' ? generateCSSUnit(containerLeftPadding, desktopConatinerPaddingType) : '',
    },
    " .cool-horizontal-timeline-body .timeline-content .ctl-row .ctl-6.timeline-block-detail::before":{
        "border-bottom-color":`${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`,
    },
    " .cool-horizontal-timeline-body .ctl-6.timeline-block-detail":{
        "border-top-color":`${storyBorderColor != '' ? storyBorderColor : "#D91B3E"} !important`,
    },
    " .cool-vertical-timeline-body .timeline-content  .timeline-block-icon" :{
        "border-color":border_color+" !important",
    },
    " .cool-horizontal-timeline-body .swiper-button-next" :{
        "color":LineColor != '' ? LineColor : "#D91B3E"
    },
    " .cool-horizontal-timeline-body .swiper-button-prev" :{
        "color":LineColor != '' ? LineColor : "#D91B3E"
    },
    " .cool-horizontal-timeline-body .swiper-pagination-bullet-active":{
        "background":LineColor != '' ? LineColor : "#D91B3E"
    },
    " .icon-true .timeline-block-icon span.timeline-block-render-icon svg" : {
        "fill":iconColor != '' ? iconColor : 'white'
    }  
       }

   var styling_css = ""
   var id = `.cool-timeline-block-${ block_id }`
   styling_css = generateCSS( selectors, id )
   return styling_css
}

export default deprContentTimelineStyle