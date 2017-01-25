$(document).ready(function(){

	$(".clearSearch").on("click", function(){
		load_counter = 1;
    	$("#searchInput").val('');
	});

	$("#searchInput").keypress(function(e){
		if(e.which == 13){
			load_counter = 1;
			getListItem();
		}
	});

	var $loading = $('#loading-icon').hide();
	$(document)
	.ajaxStart(function () {
    	$loading.show();
  	})
  	.ajaxStop(function () {
    	$loading.hide();
  	});

	getListItem();
});


var load_counter = 1;

function getListItem(){
	$(".result-list li:last").remove();
	var lang = $("#searchInput").val();
	var page = load_counter;
	if(lang == null){
		lang = "";
	}
	var stars = $("#star").text();
	if(stars==null){
		stars = "";
	}
	var url = "https://api.github.com/search/repositories?q=language:"+lang+"&stars:>="+stars+"&page="+page+"&sort=stars&order=desc";
	
	$.ajax({
  			dataType: 'json',
  			url: url,
  			type: "GET",
  			success: function(data, textStatus, jqXHR){
				$("#rate-upper").text(jqXHR.getResponseHeader('X-RateLimit-Limit'));
				$("#rate-lower").text(jqXHR.getResponseHeader('X-RateLimit-Remaining'));
				

				if(load_counter == 1){
					$(".repo-result").html("");
				}

				if(textStatus == "success"){
					load_counter++;	
				}

				createList(data);

				if(lang.length==0){
					$("#searchAlert").text("We have found "+data.total_count+" repositories");
				}
				else{
					$("#searchAlert").text("We have found "+data.total_count+" repository in "+ lang);
				}
  			},
  			error: function(){
  				load_counter = 1;
  				$(".repo-result").html("");
				var list_html = '<li class="list-group-item">No repository found!</li>';
				$(".repo-result").append(list_html);
  			} 
	});
}

function createList(resultList){
	if(resultList.total_count > 0){

		$.each(resultList.items, function(key, value){
			
			var link = (value.html_url == null) ? "" : value.html_url;
			var name = (value.full_name == null) ? "" :  value.full_name ;
			var description = (value.description == null) ? "" :  value.description;
			var language = (value.language == null) ? "" : value.language;
			var list_html = '<li class="list-group-item"><div class="list-row-1"><a href="'+link;
			list_html += '" target="_blank" title="This link will open in a new window" class="list-link">'+name;
			list_html += '</a></div><div class="list-row-2"><label class="list-details">Language: '+language;
			list_html += '<span class="list-bar">|</span><span title="'+description+'">'+description;
			list_html += '</span></label></div></li>';
			$(".repo-result").append(list_html);
		});
		if((load_counter*30) < resultList.total_count){
			var more_data = '<li class="list-group-item"><a class="load-more" onclick="getListItem();"><i class="fa fa-arrow-circle-down"></i></a></li>';
			$(".repo-result").append(more_data);
		}
	}
	else{			
		$(".repo-result").html("");
		var list_html = '<li class="list-group-item">No repository found!</li>';
		$(".repo-result").append(list_html);
	}
}
						

  $( function() {

	    $( "#slider-stars" ).slider({
	        range: "max",
	        min: 0,
	        max: 1000,
	        value: 500,
	        slide: function( event, ui ) {
	            $( "#star" ).text( ui.value );
	        }
	    });
	    $( "#star" ).text( $( "#slider-stars" ).slider( "value" ) );

	    var availableTags = [
	      "ActionScript",
	      "AppleScript",
	      "Asp",
	      "BASIC",
	      "C",
	      "C++",
	      "C#",
	      "Clojure",
	      "COBOL",
	      "ColdFusion",
	      "Erlang",
	      "Fortran",
	      "Groovy",
	      "Go",
	      "Haskell",
	      "Java",
	      "JavaScript",
	      "Lisp",
	      "Perl",
	      "PHP",
	      "Python",
	      "Ruby",
	      "Scala",
	      "Scheme",
	      "Swift"
    	];
    $( "#searchInput" ).autocomplete({
      source: availableTags,
      minLength: 0,
      select: function(event, ui) {
        if(ui.item){
            $('#searchInput').val(ui.item.value);
            load_counter = 1;
            getListItem();
        }

    }
    }).focus(function(){
    	$(this).trigger('keydown');
    });
  });



