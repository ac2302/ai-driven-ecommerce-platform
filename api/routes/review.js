const router = require("express").Router();
const { default: axios } = require("axios");
const config = require("../config");
const authOnlyMiddleware = require("../middlewares/authOnly");
const ProductReviewSection = require("../models/ProductReviewSection");

// get reviews
router.get("/:product", async (req, res) => {
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

	// spam filtering
	try {
		const response = await axios.post(`${config.aiApi}/spam-filter`, {
			review: req.body.text,
		});
		console.log(response.data);
		if (response.data.spam) {
			return res
				.status(400)
				.json({ msg: "failed to post review. flagged as spam" });
		}
	} catch (err) {
		return res
			.status(500)
			.json({ msg: "error connecting to spam filtering api" });
		console.error({ err });
	}

	const reviewSection = await ProductReviewSection.findOne({
		product: req.params.product,
	});

	reviewSection.reviews.push(req.body);

	res.json(await reviewSection.save());
});

module.exports = router;
