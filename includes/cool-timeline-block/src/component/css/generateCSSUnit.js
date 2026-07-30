import { withUnit } from "./sanitizeCSS.js";
function generateCSSUnit ( value, unit ) {

	var css = ""

	if( typeof value != "undefined" ) {
		const safeValue = withUnit( value, unit, { min: -1000, max: 1000, allowFloat: true } );
		css += safeValue
	}
	
	return css
}
export const isSafeUrl = ( url ) => {
	if ( typeof url !== 'string' || ! url.trim() ) {
		return false;
	}

	try {
		const parsedUrl = new URL( url, window.location.origin );

		return [ 'http:', 'https:', 'mailto:', 'tel:' ].includes(
			parsedUrl.protocol
		);
	} catch ( error ) {
		return false;
	}
};

export default generateCSSUnit
