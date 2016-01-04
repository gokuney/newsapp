//If a channel already exists in the database, then delete that object
Parse.Cloud.beforeSave("channels", function(request, response){
 
    var query = new Parse.Query("channels");
    query.equalTo("name", request.object.get("name"));
    query.find({
        success: function(ret){


                Parse.Object.destroyAll(ret,{
                    success : function(){

                response.success();
                
                    },
                    error : function(){
                response.success();
                    }
                });

        },
        error: function(error){
           response.error(error);
        }
    });
});


//If a feed already exists in the database, then delete that object
Parse.Cloud.beforeSave("feeds", function(request, response){
 
    var query = new Parse.Query("feeds");
    query.equalTo("link", request.object.get("link"));
    query.find({
        success: function(ret){

                Parse.Object.destroyAll(ret,{
                    success : function(){

                response.success();
                
                    },
                    error : function(){
                response.success();
                    }
                });

        },
        error: function(error){
           response.error(error);
        }
    });
});