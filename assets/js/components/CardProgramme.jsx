import React, { memo } from "react";

const Programme = (
    id,
    name,
    description,
    dateStart,
    dateEnd
) => {
	return (
		<>
			<div id={id} className="programme-wrapper">
				<div className="info-wrapper">
					{/* Si on a une image */}
					<div className="programme-img-wrapper">
						<img src="" />
					</div>
					{/* endif */}
					<div className="content">
						<h5 className="">{name}</h5>
						{description}
					</div>
				</div>
				{/* Si on a une date de début et de fin */}
				<div className="date-wrapper">
					<span className="conf-date-start">12:00</span>
					<span>-</span>
					<span className="conf-date-end">12:30</span>
				</div>
				{/* endif */}
			</div>
		</>
	);
};

export default Programme;
