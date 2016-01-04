var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Parse = require('parse').Parse;


/* 
* Required configs
*/

Parse.initialize('cHRcHDzH7O44qFoePp4e1BSfBgaj4iFBmLYUq8rs','hn3O4ETRtIAukY2CvOZ3jay2IVhMVz261TkMZgca');
//Parse.Cloud.useMasterKey(); //just in case

var limit = 10; //per page limit 


/*
* End required configs
*/


router.get('/', function(req, res, next) {

  
  res.status(400).send({_status : false , _message : 'No Content'});


});


var getter = Parse.Object.extend("feeds");


//get all news 
router.get('/all/:page*?' , function(req , res , next){
	

if(typeof req.params.page === "undefined"){
	res.status(400).send({_status : false , _message : 'Page number missing from request'});
	return false;
}
	
	var query = new Parse.Query(getter);

	query.limit(limit);

	page = ( parseInt(req.params.page) === NaN ) ?  1 : parseInt(req.params.page);

	query.skip( limit * page );
	console.log('Page ' + page);
	console.log('Clogging ' + limit * page);
	query.find({

		success : function(data){
			console.log(data.length);
			if(data.length < 1){
			console.log('NO POWER HERE');
			res.status(400).send({_status : false , _message : 'No more pages to show'});	
			}else{

			res.status(200).send({_status : true , _message : data});

			}

		},

		error : function(err){
		
			try{
				//res.status(400);
			}catch(e){
				console.log('PHEW');
			}

		}
	})

})

//get news by topic

.get('/topic/:topic/:page*?/', function(req , res, next){



	

if(typeof req.params.page === "undefined"){
	res.status(400).send({_status : false , _message : 'Page number missing from request'});
	return false;
}
	
	var query = new Parse.Query(getter);

	query.limit(limit);

	query.equalTo("type" , req.params.topic);

	page = ( parseInt(req.params.page) === NaN ) ?  1 : parseInt(req.params.page);

	query.skip( limit * page );
	console.log('Page ' + page);
	console.log('Clogging ' + limit * page);
	query.find({

		success : function(data){
			console.log(data.length);
			if(data.length < 1){
			res.status(400).send({_status : false , _message : 'No more pages to show'});	
			}else{

			res.status(200).send({_status : true , _message : data});

			}

		},

		error : function(err){
		
			try{
				res.status(400).send({_status : false , _message : err.message});
			}catch(e){
				console.log('PHEW');
			}

		}
	})

		

})


// get news on the basis of newsID
.get('/single/:id*?/', function(req , res, next){


	

if(typeof req.params.id === "undefined"){
	res.status(400).send({_status : false , _message : 'News ID Missing from request'});
	return false;
}
	
	var query = new Parse.Query(getter);

	
	query.find({

		success : function(data){
			console.log(data.length);
			if(data.length < 1){
			console.log('NO POWER HERE');
			res.status(400).send({_status : false , _message : 'No news found'});	
			}else{

			res.status(200).send({_status : true , _message : data});

			}

		},

		error : function(err){
		
			try{
				res.status(400).send({_status : false , _message : err.message});
			}catch(e){
				console.log('PHEW');
			}

		}
	})

})

.get('/categories' , function(req, res, next){

	
	
	var query = new Parse.Query(getter);

	query.descending("type");
	query.addAscending("type");
	query.select(["type"]);
	query.find({

		success : function(data){
			console.log(data.length);
			if(data.length < 1){
			console.log('NO POWER HERE');
			res.status(400).send({_status : false , _message : 'No categories found'});	
			}else{

			res.status(200).send({_status : true , _message : data});

			}

		},

		error : function(err){
		
			try{
				res.status(400).send({_status : false , _message : err.message});
			}catch(e){
				console.log('PHEW');
			}

		}
	})

});


module.exports = router;
