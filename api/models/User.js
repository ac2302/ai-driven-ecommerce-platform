const mongoose = require("mongoose");
const config = require("../config");

const addressSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	pinCode: {
		type: Number,
		required: true,
	},
});

const wishlistItemSchema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
	},
	dateAdded: {
		type: Date,
		default: Date.now(),
	},
});

const cartItemSchema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		default: 1,
	},
});

const orderItemSchema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		default: 1,
	},
	address: {
		type: addressSchema,
		required: true,
	},
	delivered: {
		type: Boolean,
		default: false,
	},
});

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: config.auth.roles.default,
			enum: config.auth.roles.list,
		},
		verified: {
			type: Boolean,
			default: false,
		},

		dafaultAddress: {
			type: addressSchema,
		},
		wishlist: {
			type: [wishlistItemSchema],
			default: [],
		},
		cart: {
			type: [cartItemSchema],
			default: [],
		},
		orders: {
			type: [orderItemSchema],
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
