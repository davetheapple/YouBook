$(document).ready(function() {
	
	var baseUrl = "https://librivox.org/api/feed/audiobooks/";
	var d = new Date();
	var newest = Math.floor(d.setDate(d.getDate()-7) / 1000); 
	console.log((new Date(newest*1000)).toDateString());
	
	$.get(baseUrl + "?since=" + newest + "&format=json", function(response) {
		console.debug(response);
		var list = $("#newest");
		
		$.each(response.books, function(i, book){
			var item = $("<li></li>");
			var authors = "";
			var bookMp3s = [];
			/*
			$.get("js/test.xml", function(xml) {//book.url_rss, function(res) {
				
				var mp3s = $(xml).find("item"); //$($(xml).find("item").last().html()).last().attr("url") );
				$.each(mp3s, function(i2, mp3){
					console.debug( $( $(mp3).children("media\\:content") ).attr("url") );//$($(xml).find("item").last().html()).last().attr("url") );
					var url = $( $(mp3).children("media\\:content") ).attr("url")
					bookMp3s.push($('<audio controls><source src="'+url+'" type="audio/mpeg"></audio>'));
				});
			});*/
			
			
			$.each(book.authors, function(i, a){ authors += a.first_name + " " + a.last_name + (i == book.authors.length-1 ? "" : ", ") });
			
			var stripTitle = book.title.replace(/\(.*?\)/, "").trim();
			stripTitle = encodeURI(stripTitle);
			console.log(stripTitle);
			var img = $("<img>");
			img.attr("src", "img/default-book.png");
			
			item.append(img);
			item.append($("<a href='#listviewdata' data-rss='"+book.url_rss+"' class='list-opt'><h3 class='.wrap'>"+book.title+"</h3></a>"));
			item.append($("<h5 class='.wrap'>"+authors+"</h5>"));
			//item.children("*").wrap("<a href='#listviewdata' data-rss='"+book.url_rss+"' class='list-opt'></a>");
			list.append(item);
			
		});
		
		list.listview().listview("refresh");
	});
	
	function showDetailView(obj) {
		
		//console.debug($(obj).find(".list-opt").data("rss"));
		var bookMp3s = new Array();
		$.get($(obj).find(".list-opt").data("rss"), function(xml) {//book.url_rss, function(res) {
				
			var mp3s = $(xml).find("item"); //$($(xml).find("item").last().html()).last().attr("url") );
			$.each(mp3s, function(i2, mp3){
				console.debug( $( $(mp3).children("media\\:content") ).attr("url") );//$($(xml).find("item").last().html()).last().attr("url") );
				var url = $( $(mp3).children("media\\:content") ).attr("url");
				bookMp3s.push("<audio controls><source src='"+url+"' type='audio/mpeg'></audio>");
			});
		
		console.debug(bookMp3s);
			var content = $('<div class="book-content"></div>');
			$("#result-data").html('');
		    content.append($(obj).clone());
		    $.each(bookMp3s, function(i3, bmp3) {
		    	console.debug(bmp3);
		    	content.append(bmp3);
		    });
		    $("#result-data").append(content);
		    $.mobile.navigate("#resultlist");
		    //list.listview().listview("refresh");
		    });
	}
	
	$(document).bind( "pagebeforechange", function( e, data ) {
		if(data.options.link != undefined)
			if($(data.options.link.context).attr("class").indexOf("list-opt") > -1) 
				showDetailView($(data.options.link).parent());
	})

	
	
});