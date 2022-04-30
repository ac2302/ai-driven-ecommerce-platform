import { MantineProvider, ScrollArea } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { MyNavbar } from "./components/Navbar";
import AddressPage from "./components/pages/Address";
import CartPage from "./components/pages/Cart";
import Chatbot from "./components/pages/Chatbot";
import Explore from "./components/pages/Explore";
import Login from "./components/pages/Login";
import OrderAdminPage from "./components/pages/OrderAdmin";
import OrdersPage from "./components/pages/Orders";
import ProductPage from "./components/pages/Product";
import Register from "./components/pages/Register";
import VerifyPage from "./components/pages/Verify";
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
							<Route path="/verify" element={<VerifyPage />} />
							<Route path="/login" element={<Login />} />
							<Route path="/explore" element={<Explore />} />
							<Route path="/product/*" element={<ProductPage />} />
							<Route path="/cart" element={<CartPage />} />{" "}
							<Route path="/orders" element={<OrdersPage />} />
							<Route path="/address" element={<AddressPage />} />
							<Route path="/order-admin" element={<OrderAdminPage />} />
							<Route path="/chatbot" element={<Chatbot />} />
							<Route path="*" element={<h1>404</h1>} />
						</Routes>
					</ScrollArea>
				</MantineProvider>
			</div>
		</BrowserRouter>
	);
}

export default App;
