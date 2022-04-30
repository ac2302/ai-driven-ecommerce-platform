import { Actions } from "./Actions";
import { Links } from "./Links";
import React from "react";
import { Header, Button, Container, Group } from "@mantine/core";

import "./styles.css";

export function MyNavbar({ links }) {
	return (
		<Header className="nav">
			<a className="logo" href="/">
				DM Infinity
			</a>

			<span className="right">
				{/* <Container> */}
					<Group spacing="xl">
						<Links links={links} />
						<Actions />
					</Group>
				{/* </Container> */}
			</span>
		</Header>
	);
}
