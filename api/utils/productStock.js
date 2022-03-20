const axios = require("axios");
const config = require("../config");
const https = require("https");
const res = require("express/lib/response");

async function getProductStock(id) {
	try {
		const res = await axios.get(`${config.cms.location}/api/products/${id}`);
		return res.data.data.attributes.stock;
	} catch {
		return -1;
	}
}

async function setProductStock(id, stock) {
	const res = await axios.put(
		`${config.cms.location}/api/products/${id}`,
		{
			data: { stock },
		},
		{
			headers: { Authorization: `bearer ${config.cms.token}` },
		}
	);
}

module.exports = { getProductStock, setProductStock };
