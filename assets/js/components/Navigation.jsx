import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import AuthAPI from "../services/authAPI";
import appUserAPI from "../services/appUserAPI";
import generalConfigurationAPI from "../services/generalConfigurationAPI";
import { toast } from "react-toastify";

const Navigation = ({ history }) => {

	const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
	
	const [generalConfiguration, setGeneralConfiguration] = useState([{}]);

	const fetchConfiguration = async () => {
		try {
			const dataConfig = await generalConfigurationAPI.findConfig();
			setGeneralConfiguration(dataConfig);
		} catch (error) {
			console.log(error.response);
		}
	};

	useEffect(() => {
		fetchConfiguration();
	}, []);

	const handleLogout = () => {
		AuthAPI.logout();
		setIsAuthenticated(false);
		toast.info("Vous êtes désormais déconnecté.");
	};

	return (
		<header>
			<div className="container">
				<div className="row">
					<div className="col header-wrapper">
						<div className="event-host">
							<div className="logo-wrapper">
								<img
									className="custom-logo"
									src="img/default/yourlogo.svg"
									alt=""
								/>
							</div>
							<h1 className="host-infos">
								<span className="site-title">{generalConfiguration.title}</span>
								<span className="site-subtitle">
									{generalConfiguration.tagline}
								</span>
							</h1>
						</div>
						<nav>
							<ul>
								<li>
									<NavLink to="/" title="">
										Accueil
									</NavLink>
								</li>

								{(!isAuthenticated && (
									<>
										<li>
											<NavLink
												to="/login"
												className="btn btn-primary text-light"
											>
												Connexion
											</NavLink>
										</li>
										<li>
											<NavLink to="/register" className="btn btn-secondary text-light">
												Inscription
											</NavLink>
										</li>
									</>
								)) || (
									<>
										{/* <li>Bienvenue {appUser.firstname} {appUser.lastname.slice(0, 1) + "."}</li> */}
										<li className="nav-item">
											<button
												className="btn btn-danger text-light"
												onClick={handleLogout}
											>
												Déconnexion
											</button>
										</li>
									</>
								)}
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navigation;
