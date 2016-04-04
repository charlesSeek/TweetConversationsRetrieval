$(function(){
	console.log('beginning ajax');
	$('.del').click(function(event){
		var target = $(event.target);
		var id = target.data('id');
		var tr = $('.conversation-id-'+id);
		$.ajax({
			type: 'delete',
			url: '/api/couchdb/doc/'+id
		}).success(function(result){
			console.log(result);
			if (result.ok == true){
				tr.remove();
			}
		});
	});
	$('.get').click(function(event){
		$.blockUI({ 
		  message: '<p><img src="/img/processing.gif"/> waiting some minutes</p>',
		  css: {
		  	border: 'none'
		  }
		}); 
		var target = $(event.target);
		var id = target.data('id');
		var tr = $('.conversation-id-'+id);
		var topic = $('#'+id+'-topic').data('topic');
		var screen_name = $('#'+id+'-screen_name').data('screen_name');
		$.ajax({
			type: 'get',
			url: '/api/twitter/replies/'+id+'?topic='+topic+'&screen_name='+screen_name
		}).done(function(results){
			$.unblockUI();
			setTimeout(function(){
				if (results.docs){
					alert("conversation "+id+" retrieving completed");
					tr.remove();
				}else {
					alert("can not find any replies");
				}
			},1000);
		});
	});
	$('.refresh').click(function(event){
		$.blockUI({ 
		  message: '<p><img src="/img/processing.gif"/> waiting some minutes</p>',
		  css: {
		  	border: 'none'
		  }
		}); 
		var target = $(event.target);
		var id = target.data('id');
		var tr = $('.conversation-id-'+id);
		var topic = $('#'+id+'-topic').data('topic');
		var screen_name = $('#'+id+'-screen_name').data('screen_name');
		$.ajax({
			type: 'get',
			url: '/api/twitter/replies/'+id+'?topic='+topic+'&screen_name='+screen_name
		}).done(function(results){
			$.unblockUI();
			setTimeout(function(){
				if (results.docs){
					alert("conversation "+id+" refreshing completed");
				}else {
					alert("can not find any replies");
				}
			},1000);
		});
	});
});