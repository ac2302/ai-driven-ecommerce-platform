const { default: axios } = require("axios");
const config = require("../config");
const authOnlyMiddleware = require("../middlewares/authOnly");

const router = require("express").Router();

// get rules
let rules = [];
axios
	.get(`${config.aiApi}/reccomendations`)
	.then((res) => {
		rules = res.data;
	})
	.catch((err) => {
		console.log("error getting reccomendations from AI API");
		console.log(`url: ${config.aiApi}/reccomendations`);
		console.error(err);
	});

// get reccomendations
router.get("/", authOnlyMiddleware([]), async (req, res) => {
	const user = req.auth.user;
	const orderedItems = user.orders.map((order) => order.id);

	if (orderedItems.length === 0) return res.json({ reccomendations: [] });

	const reccomendations = [];
	rules.forEach((rule) => {
		if (orderedItems.includes(Number(rule.item1))) {
			reccomendations.push({ id: rule.item2, lift: rule.lift });
		}
	});

	res.send(
		reccomendations.sort(function (a, b) {
			var y = a["lift"];
			var x = b["lift"];
			return x < y ? -1 : x > y ? 1 : 0;
		})
	);
});

module.exports = router;
