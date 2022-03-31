import { CreateAccount } from "./CreateAccount";
import { Center, Container, Stepper, Text } from "@mantine/core";
import React, { useState } from "react";

import "./styles.css";

function Register() {
	const [active, setActive] = useState(0);
	const [user, setUser] = useState(false);

	return (
		<div className="registerPage">
			<Container className="container" size="xs">
				<Stepper active={active} onStepClick={setActive} breakpoint="sm">
					<Stepper.Step
						allowStepSelect={false}
						label="First step"
						description="Create an account"
					>
						<CreateAccount setUser={setUser} setActive={setActive} />
					</Stepper.Step>
					<Stepper.Step
						allowStepSelect={false}
						label="Second step"
						description="Verify email"
					>
						Step 2 content: Verify email
					</Stepper.Step>
					<Stepper.Completed>
						<div className="step">
							<Center>
								<Text size="xl">
									Completed, You can now sign into your account
								</Text>
							</Center>
						</div>
					</Stepper.Completed>
				</Stepper>
			</Container>
		</div>
	);
}

export default Register;
