import { Container, Input, Space, Text } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Send } from "tabler-icons-react";
import config from "../../../config";
import "./styles.css";

function Chatbot() {
	const [display, setDisplay] = useState([]);

	useEffect(() => {
		console.log({ display });
	}, [display]);

	return (
		<div>
			<Container size="md">
				<div className="chatbot-container">
					<Space h="lg" />
					<div className="display">
						{display.map((line) => (
							<div key={Math.random()}>
								<Text size="xl">{line} </Text>
								<br />
							</div>
						))}
					</div>
					<Input
						autoFocus
						placeholder="Message"
						size="lg"
						radius="lg"
						icon={<Send />}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setDisplay((ps) => [...ps, `You: ${e.target.value}`]);
								axios
									.post(`${config.aiApiLocation}/chatbot`, {
										msg: e.target.value,
									})
									.then((res) => {
										console.log(res.data);
										setDisplay((ps) => [...ps, `Chatbot: ${res.data}`]);
										e.target.value = "";
										window.scrollTo(
											0,
											document.querySelector(".scrollingContainer").scrollHeight
										);
									});
							}
						}}
					/>
				</div>
			</Container>
		</div>
	);
}

export default Chatbot;
