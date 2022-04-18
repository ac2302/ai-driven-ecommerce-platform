const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
	username: { type: String },
	text: { type: String },
});

const productReviewSectionSchema = mongoose.Schema(
	{
		product: {
			type: String,
			required: true,
		},
		reviews: {
			type: [reviewSchema],
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model(
	"ProductReviewSection",
	productReviewSectionSchema
);
