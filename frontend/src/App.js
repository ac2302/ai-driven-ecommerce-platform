import { MantineProvider, ScrollArea } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { MyNavbar } from "./components/Navbar";
import Register from "./components/pages/Register";
import config from "./config";

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles>
						<MyNavbar links={config.navLinks} />

						<ScrollArea className="main">
							<Routes>
								<Route path="/" element={<h1>home</h1>} />
								<Route path="/register" element={<Register />} />
								<Route path="*" element={<h1>404</h1>} />
							</Routes>
						</ScrollArea>
				</MantineProvider>
			</div>
		</BrowserRouter>
	);
}

export default App;
