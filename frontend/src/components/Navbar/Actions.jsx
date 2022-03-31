import { Button } from "@mantine/core";

import React from "react";
export function Actions() {
	return (
		<Button color="red" onClick={() => (window.location = "/register")}>
			Sign Up
		</Button>
	);
}
