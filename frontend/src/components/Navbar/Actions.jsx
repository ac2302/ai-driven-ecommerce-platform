import { Button } from "@mantine/core";

import React from "react";
import {
	Forms,
	Login,
	Logout,
	ShoppingCart,
	AddressBook,
} from "tabler-icons-react";
export function Actions() {
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
					<Button
						leftIcon={<AddressBook />}
						onClick={() => {
							window.location = "/address";
						}}
					>
						Address
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
				</>
			)}
		</>
	);
}
