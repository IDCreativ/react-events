import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, withRouter } from "react-router-dom";
import AuthAPI from "./services/authAPI";
import AuthContext from "./contexts/AuthContext";
import { io } from "socket.io-client";

// Import des components
import Navigation from "./components/Navigation";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Import des pages
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Notifications
import { ToastContainer, toast } from "react-toastify";

console.log("Lancement de react.js");

AuthAPI.setUp();

const App = () => {
	
    // Websocket
	const socket = io("https://ws-digitalevents.blue-com.fr", {
		withCredentials: false,
		transportationOptions: {
			polling: {
				extraHeaders: {
					"my-custom-header": "abcd",
				},
			},
		},
	});

	const [isAuthenticated, setIsAuthenticated] = useState(
		AuthAPI.isAuthenticated()
	);

	const NavbarWithRouter = withRouter(Navigation);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: isAuthenticated,
				setIsAuthenticated: setIsAuthenticated,
			}}
		>
			<HashRouter>
				<NavbarWithRouter />
				<>
					<Switch>
						<Route path="/login" component={LoginPage} />
						<Route path="/register" component={RegisterPage} />
						<Route path="/" component={HomePage} />
					</Switch>
				</>
			</HashRouter>
			<ToastContainer
				position="bottom-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</AuthContext.Provider>
	);
};

const rootElement = document.querySelector("#App");
ReactDOM.render(<App />, rootElement);
