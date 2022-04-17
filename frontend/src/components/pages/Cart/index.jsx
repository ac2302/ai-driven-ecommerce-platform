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
import { Eye, Trash } from "tabler-icons-react";
import config from "../../../config";

import "./styles.css";

function CartPage() {
	const [cart, setCart] = useState([]);
	const [cartProducts, setCartProducts] = useState([]);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		axios
			.get(`${config.apiLocation}/cart`, {
				headers: { token: localStorage.token },
			})
			.then((res) => {
				setCart(res.data);
			});
	}, []);

	useEffect(() => {
		const f = async () => {
			const populated = [];
			let cost = 0;
			for (let i = 0; i < cart.length; i++) {
				const res = await axios.get(
					`${config.cmsLocation}/api/products/${cart[i].id}?populate=*`
				);
				const product = res.data.data;
				product.quantity = cart[i].quantity;
				cost += product.attributes.price * product.quantity;
				populated.push(product);
			}
			setCartProducts(populated);
			setTotal(cost);
		};
		f();
	}, [cart]);

	return (
		<div className="cart-page">
			<Container size="sm">
				<Title order={1}>Cart</Title>
				{cartProducts.length !== 0 ? (
					<>
						{cartProducts.map((product) => (
							<>
								<Space h="md" />
								<div className="card" key={product.id}>
									<div className="image-container">
										<Image
											height="220px"
											width="220px"
											radius="lg"
											src={`${config.cmsLocation}${product.attributes.pictures.data[0].attributes.url}`}
										/>
									</div>
									<div className="data-display">
										<Text size="xl">{product.attributes.title}</Text>
										<Badge size="lg" variant="dot">
											{product.attributes.category}
										</Badge>

										<Space h="lg" />

										<Badge size="xl" color="green" variant="filled">
											₹{product.attributes.price.toFixed(2)} x{" "}
											{product.quantity}
										</Badge>

										<Space h="md" />

										<Badge size="lg" variant="outline">
											Only {product.attributes.stock} left in stock
										</Badge>

										<Space h="md" />

										<Button
											className="btn-view"
											radius="xl"
											size="md"
											onClick={() => {
												window.location = `/product/${product.id}`;
											}}
											leftIcon={<Eye />}
										>
											View
										</Button>
										<Button
											radius="xl"
											size="md"
											color="red"
											leftIcon={<Trash />}
											onClick={() => {
												console.log(product.id);
												axios
													.delete(`${config.apiLocation}/cart`, {
														data: { id: product.id },
														headers: { token: localStorage.token },
													})
													.then((res) => {
														console.log(res);
														window.location = window.location;
													});
											}}
										>
											Delete
										</Button>
									</div>
								</div>
							</>
						))}
						<Space h="lg" />
						<Title order={2}>Total = ₹{total.toFixed(2)}</Title>
						<Space h="md" />
						<Button fullWidth>Order</Button>
						<Space h="xl" />
						<Space h="xl" />
					</>
				) : (
					<Title order={2}>Cart is empty</Title>
				)}
			</Container>
		</div>
	);
}

export default CartPage;
