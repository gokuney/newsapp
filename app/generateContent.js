var express = require('express');
var router = express.Router();
var _ = require('underscore');

var Parse = require('parse').Parse;

Parse.initialize('cHRcHDzH7O44qFoePp4e1BSfBgaj4iFBmLYUq8rs','hn3O4ETRtIAukY2CvOZ3jay2IVhMVz261TkMZgca' , 'aeSX36FPF28ybUelLELDXMhYZnjf2l9f47eaeMzn');

Parse.Cloud.useMasterKey();


var feed = require('feed-read');


/*===========================================
=            FEED CONFIGURATIONS            =
===========================================*/
/*
*NOTES 
** 
1. Type is case sensitive 

2. If channel from here is delete, the categories will be synced and affected   
*/

var channels  = [
 {
 	type : "international",
 	rss : ["http://www.thehindu.com/news/international/?service=rss"]
 },

 {
 	type : "sports",
 	rss : ["http://www.thehindu.com/sport/?service=rss"]
 },

 {
 	type : "technology",
 	rss : ["http://www.thehindu.com/sci-tech/technology/?service=rss"]
 },
 {
 	type : "national",
 	rss : ["http://www.thehindu.com/news/national/?service=rss"]
 }
];

/*=====  End of FEED CONFIGURATIONS  ======*/



router.get('/', function(req, res, next) {

  
			var init = 0;
			var allNews = [];
  
	//Add channels builder

	var channelsBuilder = Parse.Object.extend('channels');
	
	
	var _ques = [];
	_.each(channels , function(channel){
		var aQue = new channelsBuilder();
		aQue.set("name"  , channel.type);
		_ques.push(aQue);
	});

	Parse.Object.saveAll(_ques , {
		success : function(){
			res.send('GENERATED');
		},

		error : function(err){
			console.log(err);
			res.send('FATAL ERROR IN INSERTING CHANNELS, CAN NOT PROCEED');

			
		}
	});


				/*============== START NEWS DUMP =====================*/	




  		//Iterate throught the URLs to fetch feeds

	  		var feedFetcher = function(channels , init, initTopics, allNews){

	  			var urls = channels[initTopics].rss;
	  			
	  			feed(urls[init], function(err, articles) {
	  				console.log('FETCHING NEWS FOR URL ' + urls[init])
				  if(err){
				  	console.log('====================');
				  	console.log(err);
				  	console.log('====================');
				  	return false;
				  }
				  _.each(articles , function(article){
				  	article.newsType = channels[initTopics].type;
				  	allNews.push(article);
				  });

				  /*console.log('=========NEWS FOR=========== '+ channels[initTopics].type +' ==========NEWS FOR=======')
				  console.log('==================== '+ articles.length +' =================')
				  console.log('=====================================================================================')
				  	*/
								  
				  init = init + 1;
				  console.log('INCEREASE COUNTER NEW : '+init);
				  if( _.has(urls , init) ){
				  	
				  	console.log('HAS URL');

				  	feedFetcher(channels , init , initTopics, allNews);

				  }else{
				  	//move to next topic

				  			initTopics = initTopics + 1;

				  			if( _.has(channels , initTopics) ){
				  					init = 0;
									feedFetcher(channels , init , initTopics, allNews);				  				
				  			}else{

				  				//FINALLY, PUSH TO DATABASE !
				  				var _feedRows = [];

				  				
				  				_.each( allNews, function(fd){

				  					//console.log('HELLO WORLD ' + fd.title);

				  				var _feeds = Parse.Object.extend("feeds");

				  				var _feed = new _feeds();

				//  				console.log(fd);

				  				_feed.set("title" , fd.title);
				  				_feed.set("author" , fd.author);
				  				_feed.set("link" , fd.link);
				  				_feed.set("content" , fd.content);
				  				_feed.set("published_there" , fd.published.toString());
				  				_feed.set("thumbnail" , '');
				  				_feed.set("type" , fd.newsType);

				  				_feedRows.push(_feed);

				  				});
				  				console.log('ENDING HERE');
				  				Parse.Object.saveAll(_feedRows , {
								success : function(objs){
										console.log('ALL DATA ADDED !');
										res.send(allNews);
										//res.redirect('/dashboard');
									},
								error : function(err){
										console.log('error! : ');
										console.log(err);
										//res.redirect('/dashboard');
									}
								});






				  			}

				  }


				});
	  		};
	  		feedFetcher(channels, init , 0, allNews);


	 


			/*============== END NEWS DUMP =====================*/	


});


router.get('/parse' , function(req , res , next){
	var channels = Parse.Object.extend('channels');
	var che = new channels();
	che.set("name" , "DUMMY");
	che.save(null , {
		success : function(resp){
			console.log('SAVED');
			console.log(resp);
			res.send('SAEVD');
		},
		error : function(err){
			console.log('FAILED');
			res.send(err);
		}
	})
});

module.exports = router;
