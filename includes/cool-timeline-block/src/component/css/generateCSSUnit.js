import { withUnit } from "./sanitizeCSS.js";
function generateCSSUnit ( value, unit ) {

	var css = ""

	if( typeof value != "undefined" ) {
		const safeValue = withUnit( value, unit, { min: 0, max: 1000, allowFloat: true } );
		css += safeValue
	}
	
	return css
}

export default generateCSSUnit
