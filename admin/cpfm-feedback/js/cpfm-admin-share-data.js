jQuery(function($) {
    
    const $termsLink         = $('.tecc-see-terms');
    const $termsBox          = $('.tecc-terms-box');

    $termsLink.on('click', function(e) {

        e.preventDefault();
        
        const isVisible = $termsBox.toggle().is(':visible');
        $(this).html(isVisible ? 'Hide Terms' : 'See terms');
    });


});