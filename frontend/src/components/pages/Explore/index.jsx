import {
	Badge,
	Button,
	Container,
	Image,
	Input,
	InputWrapper,
	MultiSelect,
	RangeSlider,
	Space,
	Text,
	Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Search } from "tabler-icons-react";
import config from "../../../config";
import "./styles.css";

function Explore() {
	const categoriesData = config.categories.map((c) => ({ value: c, label: c }));

	const [products, setProducts] = useState([]);
	const [searchedProducts, setSearchedProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);

	const [searchValue, setSearchValue] = useState("");
	const [debouncedSearchValue] = useDebouncedValue(searchValue, 200);

	const [priceFilter, setPriceFilter] = useState([0, 1000000]);
	const [debouncedPriceFilter] = useDebouncedValue(priceFilter, 200);

	const [categoriesFilter, setCategoriesFilter] = useState([]);

	useEffect(() => {
		axios.get(`${config.cmsLocation}/api/products?populate=*`).then((res) => {
			console.log(res.data.data);
			setProducts(res.data.data);
			setSearchedProducts(res.data.data);
			setFilteredProducts(res.data.data);
		});
	}, []);

	useEffect(() => {
		const searchTerm = debouncedSearchValue.toLowerCase();
		console.log(searchTerm);

		setSearchedProducts(
			products.filter((product) =>
				product.attributes.title.toLowerCase().includes(searchTerm)
			)
		);
	}, [debouncedSearchValue, products]);

	useEffect(() => {
		let unfilteredProducts = searchedProducts;

		unfilteredProducts = unfilteredProducts.filter(
			(product) =>
				product.attributes.price >= debouncedPriceFilter[0] &&
				product.attributes.price <= debouncedPriceFilter[1]
		);

		const actualCategoriesFilter =
			categoriesFilter.length === 0 ? config.categories : categoriesFilter;

		unfilteredProducts = unfilteredProducts.filter((product) =>
			actualCategoriesFilter.includes(product.attributes.category)
		);

		setFilteredProducts(unfilteredProducts);
	}, [searchedProducts, debouncedPriceFilter, categoriesFilter]);

	return (
		<>
			<div className="explore">
				<div className="sidebar">
					<Title order={2}>Filters</Title>
					<Space h="md" />
					<InputWrapper
						id="price-input"
						label="Price Filter"
						description="Please enter min and max price for filter"
						size="md"
					>
						<RangeSlider
							id="price-input"
							value={priceFilter}
							onChange={setPriceFilter}
							min={0}
							max={100000}
							marks={[
								{ value: 0, label: "₹0" },
								{ value: 25000, label: "₹25000" },
								{ value: 50000, label: "₹50000" },
								{ value: 75000, label: "₹75000" },
								{ value: 100000, label: "₹100000" },
							]}
						/>
					</InputWrapper>

					<Space h="xl" />
					<Space h="md" />

					<InputWrapper
						id="category-input"
						label="Category Filter"
						description="Please enter the categories of products you want to search"
						size="md"
					>
						<MultiSelect
							data={categoriesData}
							value={categoriesFilter}
							onChange={setCategoriesFilter}
							placeholder="Categories"
						/>
					</InputWrapper>
				</div>
				<div className="main">
					<Container size="xl" py="md">
						<Input
							icon={<Search size={22} />}
							placeholder="Search"
							size="md"
							value={searchValue}
							onChange={(event) => setSearchValue(event.currentTarget.value)}
						/>
					</Container>
					<Container size="md">
						{filteredProducts.map((product) => (
							<div className="card" key={product.id}>
								<div className="image-container">
									<Image
										height="200px"
										width="200px"
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
										₹{product.attributes.price.toFixed(2)}
									</Badge>

									<Space h="md" />

									<Badge size="lg" variant="outline">
										Only {product.attributes.stock} left in stock
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
						))}
					</Container>
				</div>
			</div>
		</>
	);
}

export default Explore;
