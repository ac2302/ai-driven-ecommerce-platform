import {
	Badge,
	Blockquote,
	Button,
	Container,
	Image,
	NumberInput,
	Paper,
	Space,
	Textarea,
	Title,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, Send } from "tabler-icons-react";
import config from "../../../config";

import "./styles.css";

function ProductPage() {
	const [product, setProduct] = useState(false);
	const [user, setUser] = useState(false);
	const [reviews, setReviews] = useState([]);
	const clipboard = useClipboard({ timeout: 1000 });

	useEffect(() => {
		axios
			.get(
				`${config.cmsLocation}/api/products/${
					window.location.pathname.split("/").slice(-1)[0]
				}?populate=*`
			)
			.then((res) => {
				setProduct(res.data.data.attributes);
				console.log(res.data.data.attributes);
			});
		axios
			.get(`${config.apiLocation}/user/self`, {
				headers: {
					token: localStorage.token,
				},
			})
			.then((res) => {
				setUser(res.data);
			});
		axios
			.get(
				`${config.apiLocation}/review/${
					window.location.pathname.split("/").slice(-1)[0]
				}`
			)
			.then((res) => {
				setReviews(res.data.reviews);
			});
	}, []);

	return (
		<Container size="lg">
			<Space h="xl" />
			{product ? (
				<div className="product-page">
					<div className="image-bar">
						{product.pictures.data.map((pic) => (
							<>
								<Image
									radius="lg"
									src={`${config.cmsLocation}${pic.attributes.url}`}
								/>
								<Space h="md" />
							</>
						))}
					</div>
					<div className="details-container">
						<Title order={1}>{product.title}</Title>
						<Space h="md" />
						<Badge size="xl" color="green" variant="filled">
							₹{product.price.toFixed(2)}
						</Badge>
						<div className="stock-container">
							<Badge size="lg" variant="outline">
								Only {product.stock} left in stock
							</Badge>
						</div>
						<Space h="md" />
						<Button
							leftIcon={<Link />}
							radius="lg"
							size="sm"
							color={clipboard.copied ? "green" : null}
							onClick={() => {
								clipboard.copy(window.location);
							}}
						>
							{clipboard.copied ? "Link Copied" : "Share"}
						</Button>
						<Space h="md" />
						<div className="order-container">
							<div className="input">
								<NumberInput
									defaultValue={1}
									placeholder="Your age"
									radius="md"
									id="quantity-input"
									min={0}
								/>
							</div>
							<div className="button">
								<Button
									onClick={() => {
										const quantity = Number(
											document.getElementById("quantity-input").value
										);
										const id = Number(
											window.location.pathname.split("/").slice(-1)[0]
										);

										console.log({ id, quantity });

										axios
											.post(
												`${config.apiLocation}/cart`,
												{ id, quantity },
												{ headers: { token: localStorage.token } }
											)
											.then((res) => {
												console.log(res);
												alert("item added to cart succesfully");
											});
									}}
								>
									Add To Cart
								</Button>
							</div>
						</div>
						<Space h="md" />
						{product.description ? (
							<Paper radius="md" p="md" withBorder>
								<ReactMarkdown children={product.description} />
							</Paper>
						) : null}

						{user ? (
							<>
								<Space h="xl" />

								<Textarea
									autosize
									id="review-input"
									label="Your Review"
									placeholder={`this will be publicly visible under ${user.username}`}
									radius="md"
									size="md"
								/>
								<Space h="md" />
								<Button
									fullWidth
									leftIcon={<Send />}
									onClick={() => {
										const text = document.getElementById("review-input").value;

										if (!text) return;

										axios
											.post(
												`${config.apiLocation}/review/${
													window.location.pathname.split("/").slice(-1)[0]
												}`,
												{ text: text, username: user.username },
												{
													headers: {
														token: localStorage.token,
													},
												}
											)
											.then((res) => {
												console.log(res.data);
												setReviews(res.data.reviews);
												document.getElementById("review-input").value = "";
											});
									}}
								>
									Send
								</Button>
							</>
						) : null}

						<Space h="xl" />
						<Title order={3}>Reviews</Title>
						{reviews.map((review) => (
							<>
								<Blockquote cite={`- ${review.username}`}>
									{review.text}
								</Blockquote>
							</>
						))}
					</div>
				</div>
			) : null}
		</Container>
	);
}

export default ProductPage;
