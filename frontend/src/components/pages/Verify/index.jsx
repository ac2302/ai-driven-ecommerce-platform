import {
	Alert,
	Button,
	Center,
	Container,
	Input,
	InputWrapper,
	Loader,
	Space,
	Text,
	Title,
} from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { AlertTriangle, At } from "tabler-icons-react";
import config from "../../../config";

function VerifyPage() {
	const [alert, setAlert] = useState(false);
	const [reveal, setReveal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [verifyLoading, setVerifyLoading] = useState(false);

	return (
		<Container size="xs">
			<Space h="md" />
			{alert ? (
				<>
					<Alert
						icon={<AlertTriangle />}
						color="red"
						radius="md"
						withCloseButton
						variant="filled"
					>
						{alert}
					</Alert>

					<Space h="md" />
				</>
			) : null}
			<Title order={2}>Verify Email</Title>
			<Space h="md" />

			<form
				onSubmit={(e) => {
					e.preventDefault();
					const email = e.target.email.value;

					setReveal(true);
					setLoading(true);

					axios
						.post(`${config.apiLocation}/auth/generate-otp`, {
							email: email,
						})
						.then((res) => {
							console.log(res.data);
							setLoading(false);
						})
						.catch((err) => {
							console.error(err);
							setReveal(false);
							if (err.response.data.msg) setAlert(err.response.data.msg);
							else setAlert("Something went wrong! Please try again.");
							setLoading(false);
						});
				}}
			>
				<InputWrapper
					id="email-input"
					required
					label="Email"
					description="Please enter your email address to revieve OTP"
					size="md"
				>
					<Input
						id="email-input"
						placeholder="Your email"
						required
						type="email"
						name="email"
						icon={<At />}
					/>
				</InputWrapper>
				<Space h="md" />

				<input type="submit" id="submit-button" style={{ display: "none" }} />

				<Button
					fullWidth
					loading={loading}
					onClick={() => document.getElementById("submit-button").click()}
				>
					Send OTP
				</Button>
			</form>

			<Space h="md" />

			{reveal ? (
				loading ? (
					<>
						{/* loading */}
						<Text size="lg">
							Sending OTP to {document.getElementById("email-input").value}
						</Text>
						<Space h="xl" />
						<Center>
							<Loader size="xl" variant="bars" />
						</Center>
					</>
				) : (
					<>
						{/* loaded */}
						<Text size="lg">
							Sent OTP to {document.getElementById("email-input").value}.
						</Text>
						<Text size="lg"> Please check your email.</Text>
						<Space h="md" />
						<Input type="text" placeholder="Enter the OTP" id="otp-input" />
						<Space h="md" />
						<Button
							fullWidth
							loading={verifyLoading}
							onClick={() => {
								const otp = document.getElementById("otp-input").value;
								const email = document.getElementById("email-input").value;

								if (!otp) setAlert("OTP should not be blank");

								setVerifyLoading(true);

								axios
									.post(`${config.apiLocation}/auth/verify`, { email, otp })
									.then((res) => {
										console.log(res.data);
										setVerifyLoading(false);
										window.location = "/login";
									})
									.catch((err) => {
										console.error(err);
										if (err.response.data.msg) setAlert(err.response.data.msg);
										else setAlert("Something went wrong! Please try again.");
										setVerifyLoading(false);
									});
							}}
						>
							Verify
						</Button>
					</>
				)
			) : null}
		</Container>
	);
}

export default VerifyPage;
