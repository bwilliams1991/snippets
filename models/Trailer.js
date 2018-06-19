
const mongoose = require("mongoose");
var moment = require("moment");

// Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const TrailerSchema = new Schema({
  // `headline` is required and of type String
  headline: {
    type: String,
    // required: true
	},
	// `summary` 
	summary: {
    type: String,
    // required: true
  },
  // `url` is required and of type String
  url: {
    type: String,
    // required: true
	},
	// `updated` when scrap was last run.
	updated: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm A')
	},
	  // relationship to Comment model
		comments: [{
			type: Schema.Types.ObjectId,
			ref: 'comment'
		}]
});

const Trailer = mongoose.model("Trailer", TrailerSchema);

// Export Trailer model
module.exports = Trailer;
