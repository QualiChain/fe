// reload twitter
function auto_loadT(){
	"use strict";
	$.ajax({
		url: "https://qualichain-project.eu/quali-data/themes/qualichain/assets/includes/twitter.php",
		cache: false,
		success: function(data){
			$("#reloadTwitter").html(data);
			$("#reloadTwitterMobile").html(data);
		}
	});
}
$(document).ready(function(){
	"use strict";
	auto_loadT(); //Call auto_load() function when DOM is Ready
}); 
//Refresh auto_load() function after 10000 milliseconds
setInterval(auto_loadT,60000);