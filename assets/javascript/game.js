//Gif Search Game
    $(document).ready(function(){
        // Define global variables
        //Set container visibility to hidden initially until a button is clicked.
        $(".container").css("visibility", "hidden");
        $(".footer").css("visibility", "visible");
        var i=0;
        // We are setting an array to start with. More items (buttons) can be added to the array.
        var buttonArray = ['Cat', 'Deer', 'Dog', 'Elephant', 'Giraffe', 'Leopard', 'Tiger', 'Wolf' ];
        var imageArray = ['img1', 'img2', 'img3'];

        // Initial Load function creates buttons from the array.
        initialButtonLoad();

        // Following function loads items from the array. Creates buttons and sets attributes.
        function initialButtonLoad(){
            for (var i=0; i < buttonArray.length; i++){
                var buttonString = buttonArray[i];
                console.log("Existing Button = " + buttonString);
                var bt  = $('<input id="buttonGif" name="searchstring" value="' + buttonString + '" type="text" class="btn btn-lg btn-primary pull-left"  />').on("click", giffSearch);
                $("#button-gifs").append(bt);
                $("#stsearchinput").val("");
            }
        };

        console.log("Initial Button Array = " + buttonArray);

        // Function to Create buttons based on the strings passed. Normaly this comes whan a new button is added for a string that is not in the array.
        function createButtons(buttonString){
            i++;
            console.log("Button Value Passed = " + buttonString);
            console.log("Clicked....");
            var searchstring = $("#stsearchinput").val();
            searchstring = searchstring.charAt(0).toUpperCase() + searchstring.slice(1).toLowerCase();
            var compareArray = buttonArray;
            //Let us search for duplicates or empty search string.
            if (buttonDuplicate(searchstring) || searchstring.trim() === ""){
                console.log("Found Duplicate Search Value for " + searchstring);
                $("#stsearchinput").val("");
            }
            else{
                compareArray.push(searchstring);
                compareArray.sort();
                buttonArray = compareArray;

                // Whan a new button is added, button array will be emptied, sorted and loaded again from the array. This will keep the buttons sorted
                $(".buttongifs").empty();
                initialButtonLoad();
                console.log("Sorted Array = " + compareArray);
                console.log("Search String=" + searchstring);
            }
        }

        // Check if added button is a duplicate. If duplicate, button will not be added
        function buttonDuplicate(searchstring){
            var compareArray = buttonArray;
            if (compareArray.length > 1){
                console.log("First Search = " + searchstring );
                for (var i=0; i < compareArray.length; i++){
                    if(compareArray[i] === searchstring){
                        return true;
                    }
                }
                return false;
            }
        }

        // Every button click searches the Giff, using supplied parameters such as api-key, query string, limit (10, 20, 30 etc..), rating(g, pg etc..)
        // After retrieving the Gifs, load the bumber of images retrieved on to an array. Use this array by another function (Load function) to populate a table.
        function giffSearch(){
            $(".container").css("visibility", "visible");
            var giffSearchString = (this.value).trim();
            console.log("My Button Clicked..." + giffSearchString);
            event.preventDefault();
            $("imageGif").empty();
            //
            //var queryURL = "https://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=9pIwujkIFU4WrleQvfm1A1483eNzt5a3&limit=1";
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + giffSearchString + "&api_key=9pIwujkIFU4WrleQvfm1A1483eNzt5a3&rating=g&limit=10";
            console.log(queryURL);

            $.ajax({
                url: queryURL,
                method: "GET"
            })
              .then(function(response) {
              // Following code fetches the response from the query
              console.log("Initial array length1=" + imageArray.length);
              imageArray.length = 0;
              imageArray = new Array();
              console.log("Initial array length2=" + imageArray.length);
              console.log(response.data);
              console.log("Array Length= " + response.data.length);
              //console.log(response.data[0].images.fixed_width.url);
              // In order to animate we have to gather three urls. First one for image and next two for image state. Also fourth one is the rating.
              for (var j=0; j < response.data.length; j++){
                  var imageItem = response.data[j].images.fixed_height_still.url;
                  imageArray.push(imageItem);
                  imageItem = response.data[j].images.fixed_height_still.url;
                  imageArray.push(imageItem);
                  imageItem = response.data[j].images.fixed_height.url;
                  imageArray.push(imageItem);
                  imageItem = (response.data[j].title).toUpperCase();
                  imageArray.push(imageItem);
                  imageItem = (response.data[j].rating).toUpperCase();
                  imageArray.push(imageItem);
              };
              console.log("Image Array = " + imageArray[0]);

            $(this).parents('div').eq(1).remove();
            var result = imageArray;  
            
            // Following variable is to create unique image div id.
            var k = 1;     

            //Clearing the array before loading a new search result,only if "More topic?" is not checked
            var moretopic = $("#moretopic").is(':checked');
            console.log("More Topic= " + moretopic);
            if(moretopic == false){
                $(".imageGiff").empty();
            }

            //Loading all images to the div
            for (var j=0; j < result.length; j=j+5){
                var itm = "item" + k;
                k++;
                var giffy = $("<div class='imgitm' id='" + itm + "'>");
                
                $(".imageGiff").append(giffy);

                console.log("Result Image=  " + result[j]);
                //Create Image Tag dynamically
                var personImage = $("<img>");
                
                // Setting the image attributes
                personImage.attr("src" , result[j]);
                personImage.attr({"data-still": result[j+1] });
                personImage.attr({"data-animate": result[j+2] });
                personImage.attr({"class": "gif" });
                personImage.attr({"data-state": "still" });
                var pt = $("<p>").text("Title: " + result[j+3].replace("GIF", ""));
                var pr = $("<p>").text("Rating: " + result[j+4]);
                $("#title").text("Rating: " + result[j+3]);
                $(giffy).html(pt);
                $(giffy).append(pr);
                $(giffy).append(personImage);
            }
            });
        }

        // Button click logic
        $("#btnSearch").on("click", createButtons);

        // Image animation logic based on current state
        $(document).on("click", ".gif", function(){
            var  state = $(this).attr("data-state");
            console.log("Image State= " + state );
            if (state === "still"){
                $(this).attr("src" , $(this).attr("data-animate")); 
                $(this).attr("data-state", "animate");
            }
            if (state === "animate"){
                $(this).attr("src" , $(this).attr("data-still")); 
                $(this).attr("data-state", "still");
            }
        })
    })












