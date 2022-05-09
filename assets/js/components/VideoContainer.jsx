import React from "react";

const VideoContainer = (props) => {
	return (
		<div className="waiting-block">
			<div
				id="disclaimer"
				className="alert alert-danger text-center"
				role="alert"
			>
				De retour prochainement.
			</div>
			<img src="img/waiting-bg.jpg" alt="" />
		</div>
	);
};

export default VideoContainer;
