import { Button } from "@mantine/core";
import React from "react";

export function Links({ links }) {
	return (
		<>
			{links.map((link) => (
				<Button
				key={Math.random()}
					variant="outline"
					radius="lg"
					onClick={() => (window.location = link.link)}
				>
					{link.label}
				</Button>
			))}
		</>
	);
}
