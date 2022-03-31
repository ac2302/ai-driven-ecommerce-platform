import { MantineProvider, ScrollArea } from "@mantine/core";
import "./App.css";
import { MyNavbar } from "./components/Navbar";
import config from "./config";

function App() {
	return (
		<div className="App">
			<MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles>
				<MyNavbar links={config.navLinks} />
				<ScrollArea className="main">main</ScrollArea>
			</MantineProvider>
		</div>
	);
}

export default App;
