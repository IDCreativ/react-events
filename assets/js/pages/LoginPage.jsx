import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../layout/Footer";

const LoginPage = ({ history }) => {
	const { setIsAuthenticated } = useContext(AuthContext);

	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const [error, setError] = useState("");

	// Gestion des champs
	const handleChange = ({ currentTarget }) => {
		const { name, value } = currentTarget;
		setCredentials({ ...credentials, [name]: value });
	};

	// Gestion des submit
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			await AuthAPI.authenticate(credentials);
			setError("");
			setIsAuthenticated(true);

			toast.success("Vous êtes désormais connecté.");
			history.replace("/");
		} catch (error) {
			setError("Identifiants et/ou mot de passe incorrect(s).");
			toast.error("Une erreur est survenue.");
		}
	};

	return (
		<>
			<div
				id="main-container"
				className="global-container py-5"
			>
				<main id="front">
					<div className="row">
						<div className="col-md-6 mx-auto">
							<div className="card shadow-sm">
								<div className="card-header">Connexion à l'application</div>
								<div className="card-body">
									<form onSubmit={handleSubmit}>
										<Field
											// label="Votre e-mail"
											name="username"
											id="username"
											placeholder="email@domain.com"
											icon="fa-at"
											value={credentials.username}
											onChange={handleChange}
											error={error}
										/>
										<Field
											// label="Votre mot de passe"
											type="password"
											name="password"
											id="password"
											placeholder="Votre mot de passe"
											icon="fa-lock"
											value={credentials.password}
											onChange={handleChange}
										/>
										<button
											type="submit"
											className="btn btn-success text-light"
										>
											Connexion
										</button>
									</form>
								</div>

								<div className="card-footer">
									<Link to="/register">
										<i className="fal fa-long-arrow-left me-1"></i>S'enregistrer
									</Link>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
			<Footer />
		</>
	);
};

export default LoginPage;
