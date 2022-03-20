const router = require("express").Router();
const User = require("../models/User");
const authOnlyMiddleware = require("../middlewares/authOnly");
const filterData = require("../utils/filterData");
const config = require("../config");

// get wishlist
router.get("/", authOnlyMiddleware([]), async (req, res) => {
	res.json(req.auth.user.wishlist);
});

// add item to wishlist
router.post("/", authOnlyMiddleware([]), async (req, res) => {
	const itemId = req.body.id;

	if (!itemId)
		return res.status(400).json({ msg: "missing item id not provided" });

	// checking if item is already in wishlist
	for (let i = 0; i < req.auth.user.wishlist.length; i++) {
		if (req.auth.user.wishlist[i].id === itemId)
			return res.json(req.auth.user.wishlist);
	}

	req.auth.user.wishlist.push({
		id: itemId,
	});
	await req.auth.user.save();

	res.json(req.auth.user.wishlist);
});

// delete item from wishlist
router.delete("/", authOnlyMiddleware([]), async (req, res) => {
	const itemId = req.body.id;

	if (!itemId)
		return res.status(400).json({ msg: "missing item id not provided" });

	req.auth.user.wishlist = req.auth.user.wishlist.filter(
		(item) => item.id !== itemId
	);

	await req.auth.user.save();

	res.json(req.auth.user.wishlist);
});

module.exports = router;
