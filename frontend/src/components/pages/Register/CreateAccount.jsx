import { Alert, Button, Input, InputWrapper, Space } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { At, User, Key, AlertTriangle } from "tabler-icons-react";
import config from "../../../config";

export function CreateAccount({ setUser, setActive }) {
	const [alert, setAlert] = useState(false);

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

			<form
				onSubmit={(e) => {
					e.preventDefault();

					setAlert(false);
					if (e.target.password.value !== e.target.confirm.value)
						return setAlert("Passwords don't match!");

					const data = {
						username: e.target.username.value,
						email: e.target.email.value,
						password: e.target.password.value,
					};

					console.log({ data });

					axios
						.post(`${config.apiLocation}/auth/register`, data)
						.then((res) => {
							console.log(res.data);
							setUser(data);
							setActive((p) => p + 1);
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
					id="email"
					required
					label="Email"
					description="Please enter your email id. This will be verified later"
					size="md"
				>
					<Input
						type="email"
						required
						id="email"
						name="email"
						placeholder="Your email id"
						icon={<At />}
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

				<InputWrapper id="confirm" required size="md">
					<Input
						type="password"
						required
						id="confirm"
						name="confirm"
						placeholder="Confirm password"
						icon={<Key />}
					/>
				</InputWrapper>

				<Space h="md" />

				<Input id="submit" type="submit" className="hidden" />

				<Button
					fullWidth
					onClick={() => {
						document.querySelector("#submit").click();
					}}
				>
					Submit
				</Button>
			</form>
		</div>
	);
}
