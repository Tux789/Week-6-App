
//Constants for ajax calls to be made
const apiKey = "UP7vKwXDulkCN4DXq2htToKKdk3R9y06"
const numResults = 10;

//initial topics
var topics = ["Science","Videogames","Harry Potter","Microfiche"];
//initial value for iterator for collapse ids
var collapseNum = 0;

//setting up favorites
var favorites = [];
//only pull favorites from sessionStorage if it exists
if(JSON.parse(sessionStorage.getItem("favorites")) !== null){
favorites = JSON.parse(sessionStorage.getItem("favorites"));
}
console.log(favorites);

//dynamically create buttons. 
function createButtons(){
	//empty button container div
	$("#buttonDiv").empty();
	//create "Favorites" button
	var favButton = $("<button>");
	favButton.addClass("btn btn-default favGifsButton");
	favButton.html("<span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span>Favorites");
	$("#buttonDiv").append(favButton);
	//create topic buttons
	for(i=0;i<topics.length;i++){
		var newButton = $("<button>");
		newButton.text(topics[i]);
		newButton.attr("data-query",topics[i]);
		newButton.addClass("topicButton btn btn-default myButton");
		$("#buttonDiv").append(newButton);

	}
}
//take data from AJAX call and dynamically create divs
function createResultDiv(searchTopic,data){
	
	console.log(data);
	/*resulting structure

	<div class= panel>   											newResultsDiv
			<div class= panel-heading> 								newPHeading
					<H4> 											newPH
							<a...>Topic</a>							newPA							
					</H4>
			</div>
			<div class= list-group>									newList
					//repeat for each gif
					<div class =list-group-item>					newListItem
							<p>Rating: </p>							newRating
							<img...>								newImg
							<div class="icon-bar">					newIconBar
									<button class="favButton">		favButton
									<button class="dlButton">		newDLButton
							</div>
					</div>
					//end of each gif
			</div>
	</div>
	*/
	var newResultsDiv = $("<div>");
	newResultsDiv.addClass("topicDiv panel panel-default");

	var newPHeading = $("<div>");
	newPHeading.addClass("panel-heading");

	

	var newPH = $("<H4>");
	newPH.addClass("panel-title");
	//set up link for collapsable panel
	var newPA = $("<a>");
	newPA.attr("data-toggle","collapse");
	newPA.attr("href","#collapse" + collapseNum);
	newPA.text(searchTopic);

	newPH.append(newPA);
	newPHeading.append(newPH);

	 var newList = $("<div>");
	 newList.addClass("list-group panel-collapse collapse in");
	 //use iterating collapseNum to give each list a unique id for collapse link to target
	 newList.attr("id","collapse" + collapseNum);
	for(i=0;i<data.length;i++){
		var newListItem = $("<div>");
		newListItem.addClass("list-group-item");
		var newRating = $("<p>");
		newRating.text("Rating: " + data[i].rating.toUpperCase());
		
		//create img, default animation state to still
		var newImg = $("<img>");
		newImg.addClass("topicImg");
		newImg.attr("src", data[i].images.downsized_still.url);
		newImg.attr("data-still", data[i].images.downsized_still.url);
		newImg.attr("data-animate", data[i].images.downsized_large.url);
		newImg.attr("data-state","still");
		var newIconBar = $("<div>");
		newIconBar.addClass("iconBar");
		var newFavButton = $("<button>");
		newFavButton.addClass("favButton btn btn-default");
		newFavButton.attr("data-id",data[i].id);
		
		//if gif is favorited then give favButton gold star
		if(favorites.indexOf(data[i].id) !== -1){
			newFavButton.html("<span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span>");
			newFavButton.addClass("favorited");
			//newFavButton.addClass("disabled");
		}else{
			newFavButton.html("<span class=\"glyphicon glyphicon-star-empty\" aria-hidden=\"true\"></span>");
			newFavButton.removeClass("favorited");
		}
		newIconBar.append(newFavButton);
		var newDLButton = $("<button>");
		newDLButton.addClass("dlButton btn btn-default");
		//set up html for download link for download button
		newDLButton.html("<a href=\"" + data[i].images.original.url + "\" download><span class=\"glyphicon glyphicon-download-alt\" aria-hidden=\"true\"></span></a>");
		newIconBar.append(newDLButton);
		newListItem.append( newRating, newImg, newIconBar,);
		newList.append(newListItem);
		
	}
	collapseNum++;
	newResultsDiv.append(newPHeading, newList);
	$("#resultsDiv").prepend(newResultsDiv);
}

$("#buttonDiv").on("click",".topicButton",function(){
	 
	 console.log($(this));
	 var searchTopic = $(this).attr("data-query");
	 var queryURL = "https://api.giphy.com/v1/gifs/search?"
	  // var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
   //      searchTopic + "&api_key=" + apiKey + "limit=" + numResults;

	 $.ajax({
	 	url: queryURL,
	 	data: {
	 		q: searchTopic,
	 		api_key: apiKey,
	 		limit: numResults
	 	},
	 	method: "GET",
	 }).then(function(response){
	 	console.log(response);
	 	createResultDiv(searchTopic,response.data);
	 });
	 
});
$()

$("#addTerm").on("click",function(){
	event.preventDefault();
	topics.push($("#searchTerm").val().trim());
	$("#searchTerm").val("");
	createButtons();
});
$("#resultsDiv").on("click",".topicImg",function(){
	var currentState = $(this).attr("data-state");
	if(currentState == "still"){
		$(this).attr("src",$(this).attr("data-animate"));
		$(this).attr("data-state","animate");
	}else{
		$(this).attr("src",$(this).attr("data-still"));
		$(this).attr("data-state","still");
	}
});
$("#buttonDiv").on("click",".favGifsButton",function(){
	var queryURL = "https://api.giphy.com/v1/gifs?"
	var gifIDs = '';
	for(i=0;i<favorites.length;i++){
		gifIDs += favorites[i] + ','; 
	}
	if(favorites.length > 0){
$.ajax({
	 	url: queryURL,
	 	data: {
	 		api_key: apiKey,
	 		ids: gifIDs,
	 	},
	 	method: "GET",
	 }).then(function(response){
	 	console.log(response);
	 	createResultDiv("Favorites",response.data);
	 });
	}

});
$("#resultsDiv").on("click",".favButton",function(){

	if(favorites.indexOf($(this).attr("data-id")) === -1){
		favorites.push($(this).attr("data-id"));
		sessionStorage.setItem("favorites",JSON.stringify(favorites));
		$(this).html("<span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span>");
		$(this).addClass("favorited");
		console.log(favorites);
			}else{
				var removeIndex = favorites.indexOf($(this).attr("data-id"));
				favorites.splice(removeIndex,1);
				sessionStorage.setItem("favorites",JSON.stringify(favorites));
				$(this).html("<span class=\"glyphicon glyphicon-star-empty\" aria-hidden=\"true\"></span>");
				$(this).removeClass("favorited");
			}
});
createButtons();
