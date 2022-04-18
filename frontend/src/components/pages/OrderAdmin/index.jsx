import {
	Alert,
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
import { AlertTriangle, Check, Eye, Trash, TrashX } from "tabler-icons-react";
import config from "../../../config";

import "./styles.css";

function OrderAdminPage() {
	const [alert, setAlert] = useState(false);
	const [orders, setOrders] = useState([]);
	const [orderedProducts, setOrderedProducts] = useState([]);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		axios
			.get(`${config.apiLocation}/order/all`, {
				headers: { token: localStorage.token },
			})
			.then((res) => {
				setOrders(res.data);
			});
	}, []);

	useEffect(() => {
		const f = async () => {
			const populated = [];
			let cost = 0;
			for (let i = 0; i < orders.length; i++) {
				const res = await axios.get(
					`${config.cmsLocation}/api/products/${orders[i].id}?populate=*`
				);
				const product = res.data.data;
				product.quantity = orders[i].quantity;
				product.delivered = orders[i].delivered;
				product.user = orders[i].user;
				product.address = orders[i].address;
				product._id = orders[i]._id;
				cost += product.attributes.price * product.quantity;
				populated.push(product);
			}
			setOrderedProducts(populated);
			setTotal(cost);
			console.log(populated);
		};
		f();
	}, [orders]);

	return (
		<div className="order-admin-page">
			<Container size="sm">
				<Title order={1}>Orders</Title>
				{alert ? (
					<>
						<Space h="md" />
						<Alert
							icon={<AlertTriangle />}
							color="red"
							radius="md"
							withCloseButton
							variant="filled"
						>
							{alert}
						</Alert>
					</>
				) : null}
				{orderedProducts.length !== 0 ? (
					<>
						<Title order={2}>Pending Orders</Title>
						<Space h="xs" />
						{orderedProducts
							.filter((product) => !product.delivered)
							.map((product) => (
								<>
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

											<Title order={3}>Address</Title>
											<Text>{product.address.address}</Text>
											<Text>pincode: {product.address.pincode}</Text>

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
												View Product
											</Button>
											<Button
												className="btn-tick"
												radius="xl"
												size="md"
												color="green"
												onClick={() => {
													axios
														.post(
															`${config.apiLocation}/order/deliver`,
															{
																user: product.user,
																_id: product._id,
															},
															{
																headers: { token: localStorage.token },
															}
														)
														.then((res) => {
															console.log(res);
															window.location = window.location;
														});
												}}
											>
												<Check />
											</Button>
											<Button
												className="btn-del"
												radius="xl"
												size="md"
												color="red"
												onClick={() => {
													axios
														.delete(`${config.apiLocation}/order`, {
															headers: { token: localStorage.token },
															data: {
																user: product.user,
																_id: product._id,
															},
														})
														.then((res) => {
															console.log(res);
															window.location = window.location;
														});
												}}
											>
												<TrashX />
											</Button>
										</div>
									</div>
									<Space h="md" />
								</>
							))}

						<Title order={2}>Delivered Orders</Title>
						<Space h="xs" />
						{orderedProducts
							.filter((product) => product.delivered)
							.map((product) => (
								<>
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

											<Title order={3}>Address</Title>
											<Text>{product.address.address}</Text>
											<Text>pincode: {product.address.pincode}</Text>

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
										</div>
									</div>
									<Space h="md" />
								</>
							))}

						<Space h="xl" />
						<Space h="xl" />
					</>
				) : (
					<Title order={2}>No Orders</Title>
				)}
			</Container>
		</div>
	);
}

export default OrderAdminPage;
