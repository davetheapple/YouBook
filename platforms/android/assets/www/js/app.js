
var API_KEY = "AIzaSyA_GJoRzPL1RrR7YCxzXTKFCYgVVSCXJKk";
var clientLoaded = false;

function ytClientLoadCallback() {
	console.log("hello");
	gapi.client.setApiKey(API_KEY);
	gapi.client.load('youtube', 'v3', function() {
		
    	setTimeout(function(){
    		
            $.mobile.loading('hide');
        },1);  
	});
	
}

function gather(genre) {
	
	  var q = genre+" audio books";//$('#query').val();
	  var request = gapi.client.youtube.search.list({
	    q: q,
	    part: 'snippet',
	    maxResults: 10
	  });
	
	  request.execute(function(response) {
	  	console.debug(response);
	    //var str = JSON.stringify(response.result);
	    $.each(response.items, function(idx, itm){
		    process(itm);
	    });
	    setTimeout(function(){
            $.mobile.loading('hide');
        },1);
	    //var chName = response.items[0].id.playlistId;
	    //var list = requestVideoPlaylist(chName);
	    //$('.container').html('<iframe src="https://www.youtube.com/embed/videoseries?list='+chName+'" width="480" height="400"></iframe>');
	  });
	
}


function process(item) {
	if(typeof item.id != undefined) {
		switch(item.id.kind) {
			case "youtube#playlist":
				console.log("playlist");
				var pid = item.id.playlistId;
				requestVideoPlaylist(pid);
				
				break;
			case "youtube#video":
				console.log("video");
				var vid = item.id.videoId;
				var title = item.snippet.title.split(" by ");
				var author = title[1] == undefined ? "" : title[1];
				title = title[0];
				 
			    display({id: vid, title: title, author: author});
			    
				break;
		}
	}
	
}

function display(options) {
	if(options.title.trim() != "Deleted video" && options.title.trim() != "Private video") {
		$("#resultlistdata").append($(
										'<li class="video-item">'+
											'<img src="http://img.youtube.com/vi/'+options.id+'/default.jpg">'+
											'<h3 data-yt-id="'+options.id+'">'+options.title+'</h3>'+
											'<h5>'+options.author+'</h5></li>'+

	 										'<iframe class="video" id="video_'+options.id+'" style="display:none;" src="https://www.youtube.com/embed/'+options.id+'" height="100" seamless></iframe>'+
	 									'</li>'
 									));

		$('#resultlistdata').listview().listview('refresh');
	}
}


// Retrieve the list of videos in the specified playlist.
function requestVideoPlaylist(playlistId) {
  
  var requestOptions = {
    playlistId: playlistId,
    part: 'snippet',
    maxResults: 10
  };

  var request = gapi.client.youtube.playlistItems.list(requestOptions);
  request.execute(function(response) {
    
	console.debug(response);
	var list = response.result.items;
	$.each(list, function(index, itm) {
		//process(itm);
		console.debug(itm);
		var title = itm.snippet.title.split(" by ");
		var author = title[1] == undefined ? "" : title[1];
		title = title[0];
		var id = itm.snippet.resourceId.videoId;
		
		display({id: id, title: title, author: author});
	});
  });
}

$(document).ready(function() {
	
	setTimeout(function(){
		
        $.mobile.loading('show');
    },1); 
	
	$("#mainpage li").on("click", function() {
		$("#resultlistdata").html('');
		setTimeout(function(){
	        $.mobile.loading('show');
	    },1); 
		gather($(this).text());
		
	});
	
	$(document).on("click", ".video-item", function() {
		$(".video").hide();
		$(this).next(".video").slideDown();
	});
	

});
