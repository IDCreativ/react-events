import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import VideoContainer from "../components/VideoContainer";
import Aside from "../layout/Aside";
import generalConfigurationAPI from "../services/generalConfigurationAPI";
import Footer from "../layout/Footer";

const HomePage = (props) => {

	const asideToggle = useRef(null);
	const [asideOpened, setAsideOpened] = useState(true);

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

	const handleAside = () => {
		if (asideOpened) {
			setAsideOpened(false);
		}
		else {
			setAsideOpened(true);
		}
	};

	return (
		<>
			<div id="main-container" className={asideOpened ? "global-container aside-opened" : "global-container"}>
				<main id="front">
					<section className="live-wrapper">
						<div id="js-live-container" className="live-container">
							<VideoContainer />
						</div>
					</section>
				</main>
				<Footer />
			</div>
			<aside id="sidebar" className={asideOpened ? "aside-opened" : ""}>
				<div
					id="aside-toggle"
					className={asideOpened ? "aside-opened" : ""}
					ref={asideToggle}
					onClick={handleAside}
				>
					<i className="far fa-arrow-from-right"></i>
				</div>
				<Aside />
			</aside>
		</>
	);
};

export default HomePage;
