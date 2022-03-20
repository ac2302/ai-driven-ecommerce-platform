const router = require("express").Router();
const User = require("../models/User");
const authOnlyMiddleware = require("../middlewares/authOnly");
const filterData = require("../utils/filterData");
const config = require("../config");

// get cart
router.get("/", authOnlyMiddleware([]), async (req, res) => {
	res.json(req.auth.user.cart);
});

// add item to cart
router.post("/", authOnlyMiddleware([]), async (req, res) => {
	const itemId = req.body.id;
	let quantity = req.body.quantity;

	if (!itemId)
		return res.status(400).json({ msg: "missing item id not provided" });
	if (!quantity || isNaN(quantity)) quantity = 1;

	// checking if item is already in cart
	for (let i = 0; i < req.auth.user.cart.length; i++) {
		if (req.auth.user.cart[i].id === itemId) {
			req.auth.user.cart[i].quantity = quantity;
			await req.auth.user.save();
			return res.json(req.auth.user.cart);
		}
	}

	req.auth.user.cart.push({
		id: itemId,
		quantity: quantity,
	});
	await req.auth.user.save();

	res.json(req.auth.user.cart);
});

// delete item from cart
router.delete("/", authOnlyMiddleware([]), async (req, res) => {
	const itemId = req.body.id;

	if (!itemId)
		return res.status(400).json({ msg: "missing item id not provided" });

	req.auth.user.cart = req.auth.user.cart.filter(
		(item) => item.id !== itemId
	);

	await req.auth.user.save();

	res.json(req.auth.user.cart);
});

module.exports = router;
