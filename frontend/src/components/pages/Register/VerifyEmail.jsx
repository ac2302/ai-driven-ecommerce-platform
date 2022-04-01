import {
	Alert,
	Button,
	Input,
	Space,
	Text,
	Title,
	Loader,
	Center,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AlertTriangle } from "tabler-icons-react";
import config from "../../../config";

export function VerifyEmail({ user, setActive }) {
	const [alert, setAlert] = useState(false);
	const [loading, setLoading] = useState(true);
	const [verifyLoading, setVerifyLoading] = useState(false);

	useEffect(() => {
		axios
			.post(`${config.apiLocation}/auth/generate-otp`, { email: user.email })
			.then((res) => {
				console.log(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				if (err.response.data.msg) setAlert(err.response.data.msg);
				else setAlert("Something went wrong! Please try again.");
				setLoading(false);
			});
	}, []);

	return (
		<div className="step">
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

			<Title order={2}>Hello {user.username}</Title>

			<Space h="md" />

			{loading ? (
				<>
					<Text size="lg">Sending OTP to {user.email}</Text>
					<Space h="xl" />
					<Center>
						<Loader size="xl" variant="bars" />
					</Center>
				</>
			) : (
				<>
					{/* loaded */}
					<Text size="lg">Sent OTP to {user.email}.</Text>
					<Text size="lg"> Please check your email.</Text>
					<Space h="md" />
					<Input type="text" placeholder="Enter the OTP" id="otp-input" />
					<Space h="md" />
					<Button
						fullWidth
						loading={verifyLoading}
						onClick={() => {
							const otp = document.getElementById("otp-input").value;
							const email = user.email;

							console.log({ email, otp });

							if (!otp) setAlert("OTP should not be blank");

							setVerifyLoading(true);

							axios
								.post(`${config.apiLocation}/auth/verify`, { email, otp })
								.then((res) => {
									console.log(res.data);
									setVerifyLoading(false);
									setActive((p) => p + 1);
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
			)}
		</div>
	);
}
