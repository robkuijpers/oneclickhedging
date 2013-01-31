jQuery ->
    $('#oneClickHedging').click -> 
    	loc = $('#oneClickHedging').data('link');
    	window.location = loc

	$('#login-button').click -> 
    	$('.login-box').hide('fade', {}, 500)
    	return false
