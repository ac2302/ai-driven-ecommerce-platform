import { Button } from "@mantine/core";

import React from "react";
export function Actions() {
	return (
		<>
			{localStorage.token == undefined || localStorage.token == "" ? (
				<>
					{" "}
					<Button color="red" onClick={() => (window.location = "/register")}>
						Sign Up
					</Button>
					<Button onClick={() => (window.location = "/login")}>Sign In</Button>
				</>
			) : (
				<>
					<Button
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
