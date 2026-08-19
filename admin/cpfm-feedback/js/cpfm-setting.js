jQuery(document).ready(function($) {
    $('#tecc-cpfm-data-sharing').on('change', function() {
        let isChecked = $(this).is(':checked') ? 'yes' : 'no';
        $.post(ajaxurl, {
            action: 'cpfm_save_usage_data_sharing',
            opt_in: isChecked,
            nonce: cpfm_ajax_obj.nonce
        });
    });
});