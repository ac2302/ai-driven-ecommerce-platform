const router = require("express").Router();
const User = require("../models/User");
const authOnlyMiddleware = require("../middlewares/authOnly");
const filterData = require("../utils/filterData");
const config = require("../config");
const { getProductStock, setProductStock } = require("../utils/productStock");
const sendMail = require("../utils/sendMail");

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

// get all orders
router.get("/all", authOnlyMiddleware(["admin"]), async (req, res) => {
	const users = await User.find({});
	let orders = [];

	users.forEach((user) => {
		user.orders.forEach((order) => {
			orders.push({
				...{
					id: order.id,
					_id: order._id,
					quantity: order.quantity,
					address: order.address,
					delivered: order.delivered,
				},
				user: user._id,
			});
		});
	});

	res.send(orders);
});

// mark order as delivered
router.post("/deliver", authOnlyMiddleware(["admin"]), async (req, res) => {
	userId = req.body.user;
	orderId = req.body._id;

	const user = await User.findById(userId);

	for (var i = 0; i < user.orders.length; i++) {
		if (user.orders[i]._id == orderId) {
			user.orders[i].delivered = true;
		}
	}

	res.json(await user.save());
});

// delete order
router.delete("/", authOnlyMiddleware(["admin"]), async (req, res) => {
	userId = req.body.user;
	orderId = req.body._id;

	const user = await User.findById(userId);

	let itemId = 0;
	let quantity = 0;

	for (var i = 0; i < user.orders.length; i++) {
		if (user.orders[i]._id == orderId) {
			console.log("restocking");
			console.log(
				(await getProductStock(user.orders[0].id)) + user.orders[0].quantity
			);
			itemId = user.orders[i].id;
			quantity = user.orders[i].quantity;
			await setProductStock(
				user.orders[0].id,
				(await getProductStock(user.orders[0].id)) + user.orders[0].quantity
			);
		}
	}

	user.orders = user.orders.filter((order) => order._id != orderId);

	sendMail(
		user.email,
		"Order Cancellation",
		`Hello ${user.username}, your order for ${quantity} of item no. ${itemId} has been cancelled.`
	);

	res.json(await user.save());
});

module.exports = router;
