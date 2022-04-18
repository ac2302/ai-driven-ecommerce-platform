import {
	Button,
	Container,
	NumberInput,
	Space,
	Text,
	Textarea,
	Title,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Edit } from "tabler-icons-react";
import config from "../../../config";

function AddressPage() {
	const [user, setUser] = useState(false);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		axios
			.get(`${config.apiLocation}/user/self`, {
				headers: { token: localStorage.token },
			})
			.then((res) => {
				console.log(res.data);
				setUser(res.data);
			});
	}, []);

	return (
		<div className="address-page">
			{user ? (
				<Container size="sm">
					<Space h="md" />
					{user.defaultAddress && !edit ? (
						<div className="show-address">
							<Title order={3}>Address</Title>
							<Text size="lg">{user.defaultAddress.address}</Text>
							<Text size="lg">Pincode: {user.defaultAddress.pincode}</Text>
							<Space h="md" />
							<Button
								fullWidth
								leftIcon={<Edit />}
								onClick={() => {
									console.log("edit");
									setEdit(true);
								}}
							>
								Edit
							</Button>
						</div>
					) : (
						<div className="set-address">
							<Textarea
								placeholder="Address"
								label="Your Address"
								size="md"
								autosize
								minRows={3}
								radius="md"
								id="address-input"
							/>
							<Space h="md" />
							<NumberInput
								placeholder="xxxxxx"
								label="Pincode"
								radius="md"
								size="md"
								hideControls
								id="pincode-input"
							/>
							<Space h="md" />
							<Button
								fullWidth
								onClick={() => {
									const address =
										document.getElementById("address-input").value;
									const pincode =
										document.getElementById("pincode-input").value;

									if (address && pincode) {
										if (!isNaN(pincode)) {
											axios
												.post(
													`${config.apiLocation}/user/self/address`,
													{
														address,
														pincode,
													},
													{
														headers: {
															token: localStorage.token,
														},
													}
												)
												.then((res) => {
													console.log(res.data);
													window.location = window.location;
												});
										}
									}
								}}
							>
								Set Address
							</Button>
						</div>
					)}
				</Container>
			) : null}
		</div>
	);
}

export default AddressPage;
