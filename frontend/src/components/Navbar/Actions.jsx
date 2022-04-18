import { Button } from "@mantine/core";
import axios from "axios";

import React, { useEffect, useState } from "react";
import {
	Forms,
	Login,
	Logout,
	ShoppingCart,
	AddressBook,
	Box,
	Key,
} from "tabler-icons-react";
import config from "../../config";
export function Actions() {
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		axios
			.get(`${config.apiLocation}/user/self`, {
				headers: {
					token: localStorage.token,
				},
			})
			.then((res) => {
				setIsAdmin(res.data.role === "admin");
			});
	}, []);

	return (
		<>
			{localStorage.token == undefined || localStorage.token == "" ? (
				<>
					{" "}
					<Button
						leftIcon={<Forms />}
						color="red"
						onClick={() => (window.location = "/register")}
					>
						Sign Up
					</Button>
					<Button
						leftIcon={<Login />}
						onClick={() => (window.location = "/login")}
					>
						Sign In
					</Button>
				</>
			) : (
				<>
					{isAdmin ? (
						<Button
							color="orange"
							leftIcon={<Key />}
							onClick={() => {
								window.location = "/order-admin";
							}}
						>
							Manage Orders
						</Button>
					) : null}
					<Button
						leftIcon={<AddressBook />}
						onClick={() => {
							window.location = "/address";
						}}
					>
						Address
					</Button>
					<Button
						leftIcon={<Box />}
						onClick={() => {
							window.location = "/orders";
						}}
					>
						Orders
					</Button>
					<Button
						leftIcon={<ShoppingCart />}
						color="green"
						onClick={() => {
							window.location = "/cart";
						}}
					>
						Cart
					</Button>
					<Button
						leftIcon={<Logout />}
						color="red"
						onClick={() => {
							localStorage.removeItem("token");
							window.location = "/";
						}}
					>
						Sign Out
					</Button>
				</>
			)}
		</>
	);
}
