import {
	Badge,
	Button,
	Container,
	Image,
	Space,
	Text,
	Title,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../../../config";

import "./styles.css";

function HomePage() {
	const [reccomendations, setReccomendations] = useState([]);
	const [allProducts, setAllProducts] = useState([]);

	useEffect(() => {
		axios
			.get(`${config.apiLocation}/reccomendations`, {
				headers: { token: localStorage.token },
			})
			.then((res) => {
				console.log(res.data);
				setReccomendations(res.data);
			});

		axios.get(`${config.cmsLocation}/api/products?populate=*`).then((res) => {
			console.log(res.data.data);
			setAllProducts(res.data.data);
		});
	}, []);

	return (
		<div className="home-page">
			<Container size="md">
				<Space h="lg" />
				{!localStorage.token ? (
					<h2>Login to use website</h2>
				) : (
					<>
						{/* logged in */}
						{reccomendations.length === 0 ? (
							<h2>No Reccomendations</h2>
						) : (
							<>
								{reccomendations.map((r) => (
									<>
										<Product id={Number(r.id)} />
									</>
								))}
							</>
						)}
					</>
				)}
			</Container>
		</div>
	);
}

function Product({ id }) {
	const [product, setProduct] = useState();

	useEffect(() => {
		axios
			.get(`${config.cmsLocation}/api/products/${id}?populate=*`)
			.then((res) => {
				console.log(res.data.data.attributes);
				setProduct(res.data.data.attributes);
			});
	}, [id]);

	if (product)
		return (
			<div className="card" key={product.id}>
				<div className="image-container">
					<Image
						height="200px"
						width="200px"
						radius="lg"
						src={`${config.cmsLocation}${product.pictures.data[0].attributes.url}`}
					/>
				</div>
				<div className="data-display">
					<Text size="xl">{product.title}</Text>
					<Badge size="lg" variant="dot">
						{product.category}
					</Badge>

					<Space h="lg" />

					<Badge size="xl" color="green" variant="filled">
						₹{product.price.toFixed(2)}
					</Badge>

					<Space h="md" />

					<Badge size="lg" variant="outline">
						Only {product.stock} left in stock
					</Badge>

					<Button
						className="btn"
						radius="xl"
						size="md"
						onClick={() => {
							window.location = `/product/${product.id}`;
						}}
					>
						View
					</Button>
				</div>
			</div>
		);
	else return null;
}

export default HomePage;
