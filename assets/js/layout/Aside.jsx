import React from "react";
import Programmes from "../components/blocks/Programmes";
import Questions from "../components/blocks/Questions";
import Sondages from "../components/blocks/Sondages";

const Aside = (props) => {

	return (
		<>
			<div className="sidebar">
				<nav>
					<div className="nav nav-tabs" id="nav-tab" role="tablist">
						<a
							className="col nav-block active px-0"
							id="nav-programme-tab"
							data-bs-toggle="tab"
							data-bs-target="#nav-programme"
							role="tab"
							aria-controls="nav-programme"
							aria-selected="false"
						>
							<img src="img/list-light.svg" alt="" />
							<span>Programme</span>
						</a>
						<a
							className="col nav-block px-0"
							id="nav-questions-reponses-tab"
							data-bs-toggle="tab"
							data-bs-target="#nav-questions-reponses"
							role="tab"
							aria-controls="nav-questions-reponses"
							aria-selected="true"
						>
							<img src="img/qa.svg" alt="" />
							<span>Questions / Réponses</span>
						</a>
						<a
							className="col nav-block px-0"
							id="nav-sondages-tab"
							data-bs-toggle="tab"
							data-bs-target="#nav-sondages"
							role="tab"
							aria-controls="nav-sondages"
							aria-selected="true"
						>
							<img src="img/poll.svg" alt="" />
							<span>Sondages</span>
						</a>
					</div>
				</nav>
				<div className="tab-content" id="nav-tabContent">
					<div
						className="tab-pane fade show active"
						id="nav-programme"
						role="tabpanel"
						aria-labelledby="nav-programme-tab"
					>
						<div className="tab-content-wrapper-program">
							<Programmes />
						</div>
					</div>

					<div
						className="tab-pane fade"
						id="nav-sondages"
						role="tabpanel"
						aria-labelledby="nav-sondages-tab"
					>
						<div className="tab-content-wrapper-poll">
							<Sondages />
						</div>
					</div>

					<div
						className="tab-pane fade"
						id="nav-questions-reponses"
						role="tabpanel"
						aria-labelledby="nav-questions-reponses-tab"
					>
						<div id="js-questions" className="tab-content-wrapper">
							<Questions />
						</div>
						<div className="ask-question">
							<div className="qa-form">
								<form action="" className="form-inline">
									<fieldset id="fieldset-qr">
										<div className="input-group">
											<input
												type="text"
												className="form-control"
												name="message"
												id="js-message"
												placeholder="Écrivez votre question ici"
												aria-label="Posez votre question ici"
												aria-describedby="js-send-question"
											/>
											<button
												id="js-send-question"
												className="btn send-question"
												type="submit"
											>
												<span>Envoyer</span>
												<i className="fal fa-arrow-right"></i>
											</button>
										</div>
									</fieldset>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Aside;
