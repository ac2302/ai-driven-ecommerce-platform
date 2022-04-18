const router = require("express").Router();
const User = require("../models/User");
const authOnlyMiddleware = require("../middlewares/authOnly");
const filterData = require("../utils/filterData");
const config = require("../config");
const { getProductStock, setProductStock } = require("../utils/productStock");

// get cart
router.get("/", authOnlyMiddleware([]), async (req, res) => {
	res.json(req.auth.user.orders);
});

// order
router.post("/", authOnlyMiddleware([]), async (req, res) => {
	const address = req.body.address || req.auth.user.defaultAddress;

	if (!address)
		return res
			.status(400)
			.json({ msg: "no address provided and no default address" });

	if (!(address.address && address.pincode))
		return res.status(400).json({ msg: "incomplete address" });

	if (req.auth.user.cart.length === 0)
		return res.status(400).json({ msg: "cannot checkout an empty cart" });

	// ckecking if items are in stock
	for (let i = 0; i < req.auth.user.cart.length; i++) {
		const product = req.auth.user.cart[i];
		const stock = await getProductStock(product.id);
		if (stock < product.quantity)
			return res.status(400).json({ msg: "out of stock" });
	}

	// ordering items
	for (let i = 0; i < req.auth.user.cart.length; i++) {
		const product = req.auth.user.cart[i];
		const stock = await getProductStock(product.id);
		await setProductStock(product.id, stock - product.quantity);
		req.auth.user.orders.push({
			id: product.id,
			quantity: product.quantity,
			address: address,
		});
	}
	
	req.auth.user.cart = [];

	req.auth.user.save();

	res.json(req.auth.user.orders);
});

module.exports = router;
