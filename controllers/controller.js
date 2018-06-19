const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const path = require('path');

// Import models
// const models = require('../models');
var Comment = require('../models/Comment.js');
var Trailer = require('../models/Trailer.js');

// Index Page Render (at first visit)
router.get('/', function (req, res) {

	// Scrape data
	res.redirect('/scrape');
});

router.get("/scrape", function (req, res) {

	const options = {
		url: "https://www.imdb.com/trailers",
		method: 'GET',
		limit: 5 // limit call to scape only 10 trailers
	};
	// First, we grab the body of the html with request
	request(options, function (error, response, html) {

		// Then, we load that into cheerio and save it to $ for a shorthand selector
		const $ = cheerio.load(html);
		const resultsArray = [];

		$("div.trailer-image a.video-link").each(function (index, element) {

			// Save an empty result object
			const result = {};

			// Add the text and href of every link, and save them as properties of the result object
			result.url = "https://www.imdb.com" + $(element).attr("href");

			result.title = $(element)
				.children("img.image-overlay")
				.attr("src");

			result.summary = $(element)
				.children("img.image-overlay")
				.attr("title");

			// console.log("result", result);
			// console.log("resultsArray", resultsArray);

			const newEntry = new Trailer(result);

			// Save to MongoDB
			newEntry.save(function (err, doc) {
				// log any errors
				if (err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});
			
			// Prevent empty scrapes
			if (result.title !== "") {

				// Prevent duplicates
				if (resultsArray.indexOf(result.title) == -1) {


					resultsArray.push(result.title);

					Trailer.count({
						title: result.title
					}, 
					function (err, test) {

						if (test == 0) {
							const newEntry = new Trailer(result);

							// Save to MongoDB
							newEntry.save(function (err, data) {
								// log any errors
								if (err) {
									console.log(err);
								}else {
									console.log(data);
								}
							});
						}else {
							console.log('Content already exists.')
						}
					});
				}else {
					console.log('Content already exists.')
				}
			}else {
				console.log('Empty dataset')
			}

		});
	});
	res.redirect("/trailers");
});

// Page Render
router.get('/trailers', function (req, res) {

	// Query MongoDB for all records
	Trailer
		.find({})
		.sort({
			_id: -1
		})
		.populate('comments')
		.exec(function (err, data) {
			// log any errors
			if (err) {
				console.log(err);
			} else {
				var hbsObject = {
					trailer: data
				}
				res.render('index', hbsObject);
			}
		});
});




// Post Comment Route 
router.post('/add/comment/:id', function (req, res) {

	const trailerId = req.params.id;
	const commentAuthor = req.body.name;
	const commentContent = req.body.comment;
	const result = {
		author: commentAuthor,
		content: commentContent
	};
	const newEntry = new Comment(result);

	// Save to database
	newEntry.save(function (err, data) {
		if (err) {
			console.log(err);
		} else {
			Trailer.findOneAndUpdate({
					'_id': trailerId
				}, {
					$push: {
						'comments': data._id
					}
				}, {
					new: true
				})
				// execute the above query
				.exec(function (err, doc) {
					// log any errors
					if (err) {
						console.log(err);
					} else {
						// Send Success Header
						res.sendStatus(200);
					}
				});
		}
	});

});




// Delete a Comment Route
router.post('/remove/comment/:id', function (req, res) {

	// Collect comment id
	const commentId = req.params.id;

	// Find and Delete the Comment using the Id
	Comment.findByIdAndRemove(commentId, function (err, data) {

		if (err) {
			console.log(err);
		} else {
			// Send Success Header
			res.sendStatus(200);
		}

	});

});


// Export Router to Server.js
module.exports = router;