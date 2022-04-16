import {
	Container,
	Title,
	Space,
	Alert,
	Button,
	Input,
	InputWrapper,
} from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { AlertTriangle, At, Key, User } from "tabler-icons-react";
import config from "../../../config";

function Login() {
	const [alert, setAlert] = useState(false);

	return (
		<Container size="xs">
			<Space h="md" />
			<Title order={2}>Sign In</Title>

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

			<form
				onSubmit={(e) => {
					e.preventDefault();

					setAlert(false);

					const data = {
						username: e.target.username.value,
						password: e.target.password.value,
					};

					console.log({ data });

					axios
						.post(`${config.apiLocation}/auth/login`, data)
						.then((res) => {
							console.log(res.data);
							localStorage.token = res.data.token;
							window.location = "/";
						})
						.catch((err) => {
							console.error(err);
							if (err.response.data.msg) setAlert(err.response.data.msg);
							else setAlert("Something went wrong! Please try again.");
						});
				}}
			>
				<InputWrapper
					id="username"
					required
					label="Username"
					description="Please enter your username. This cannot be changed later"
					size="md"
				>
					<Input
						id="username"
						required
						name="username"
						placeholder="Your username"
						icon={<User />}
					/>
				</InputWrapper>

				<Space h="md" />

				<InputWrapper
					id="password"
					required
					label="Password"
					description="Please choose a secure password"
					size="md"
				>
					<Input
						type="password"
						required
						id="password"
						name="password"
						placeholder="Your password"
						icon={<Key />}
					/>
				</InputWrapper>

				<Space h="md" />

				<input id="submit" type="submit" style={{ display: "none" }} />

				<Button
					fullWidth
					onClick={() => {
						document.querySelector("#submit").click();
					}}
				>
					Submit
				</Button>
			</form>
		</Container>
	);
}

export default Login;
