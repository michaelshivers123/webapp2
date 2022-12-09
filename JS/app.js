//The URIs of the REST endpoint
IUPS = "https://prod-49.northeurope.logic.azure.com:443/workflows/cf551e9037594494a642f8daad29c831/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WRZJ62n24YUnyVlMX0QxAxk5e8nWJMruItIZdXYOy6M";
RAI = "https://prod-38.northeurope.logic.azure.com:443/workflows/ab3da8cce5fb47148a9e77899742b789/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gQ0olubm5XLiRp6HwXUv69sPafi5THIiRavTcjkZ1G4";

DIAURI0 = "https://prod-10.centralus.logic.azure.com/workflows/682eef684ee641cbacb8456b86a72b68/triggers/manual/paths/invoke/rest/v1/assets/";
DIAURI1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=eKpps9UUvNYytqycUQ6JAX7kB4g-qvIudLwJLbpKShs";


BLOB_ACCOUNT = "https://shareb00782603.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
  
  submitData = new FormData();
  
  //Get form variables and append them to the form data object
  submitData.append('FileName', $('#FileName').val());
  submitData.append('userID', $('#userID').val());
  submitData.append('userName', $('#userName').val());
  submitData.append('title', $('#title').val());
  submitData.append('publisher', $('#publisher').val());
  submitData.append('producer', $('#producer').val());
  submitData.append('genre', $('#genre').val());
  submitData.append('ageRating', $('#ageRating').val());
  submitData.append('File', $("#UpFile")[0].files[0]);

  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
  url: IUPS,
  data: submitData,
  cache: false,
  enctype: 'multipart/form-data',
  contentType: false,
  processData: false,
  type: 'POST',
  success: function(data){

    }
 }); 

}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){


  //Replace the current HTML in that div with a loading message
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');


  $.getJSON(RAI, function( data ) {


    //Create an array to hold all the retrieved assets
    var items = [];

    //alert(JSON.stringify(data))
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each( data, function( key, val ) {

        items.push( "<hr />" );
        items.push("<video src='"+ BLOB_ACCOUNT + val["filePath"] +"' width='300' height='210' controls></video><br />")
        items.push("File: " + val["fileName"] + "<br />");
        items.push("Title: " + val["title"] + "<br />")
        items.push("Publisher: " + val["publisher"] + "<br />")
        items.push("Producer: " + val["producer"] + "<br />")
        items.push("Genre: " + val["genre"] + "<br />")
        items.push("Age Rating: " + val["ageRating"] + "<br />")
        items.push("Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br/>");

        items.push('<button type="button" id="subNewForm" class="btn btn-primary" onclick="deleteAsset(\''+val["userID"] +'\')">Delete</button> <br/> <br/>');
        
    });

    //Clear the assetlist div
    $('#ImageList').empty();


    //Append the contents of the items array to the ImageList Div
    $( "<ul/>", {
      "class": "my-new-list",
      html: items.join( "" )
      }).appendTo( "#ImageList" );
    }); 
}

function deleteAsset(id){
  alert(DIAURI0 + id + DIAURI1);
  $.ajax({   

    type: "DELETE",
    url: DIAURI0 + id + DIAURI1

  }).done(function( ) {
    getAssetList();
  });
}
