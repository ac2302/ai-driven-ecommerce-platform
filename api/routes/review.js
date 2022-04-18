const router = require("express").Router();
const authOnlyMiddleware = require("../middlewares/authOnly");
const ProductReviewSection = require("../models/ProductReviewSection");

// get reviews
router.get("/:product", authOnlyMiddleware([]), async (req, res) => {
	const found = await ProductReviewSection.findOne({
		product: req.params.product,
	});

	if (found) return res.json(found);

	const reviewSection = new ProductReviewSection({
		product: req.params.product,
	});

	res.json(await reviewSection.save());
});

// post reviews
router.post("/:product", authOnlyMiddleware([]), async (req, res) => {
	if (!(req.body.username && req.body.text))
		return res.status(400).json({ msg: "missing username or text" });

	const reviewSection = await ProductReviewSection.findOne({
		product: req.params.product,
	});

	reviewSection.reviews.push(req.body);

	res.json(await reviewSection.save());
});

module.exports = router;
