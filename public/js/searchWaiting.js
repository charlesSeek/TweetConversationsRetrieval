$(function(){
	$('.btn').click(function(){
		var limits = $('#inputConversations').val();
		console.log(limits);
		if (parseInt(limits)>0 && parseInt(limits)<=10){
			$.blockUI({ 
			  message: '<p><img src="/img/processing.gif"/> waiting some minutes</p>',
			  css: {
			  	border: 'none'
			  }
			}); 
		}
	});
});