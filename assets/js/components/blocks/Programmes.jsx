import React, { useEffect, useState } from "react";
import generalConfigurationAPI from "../../services/generalConfigurationAPI";
import moment from "moment";
import "moment-timezone";

const Programmes = (props) => {

	const [chapters, setChapters] = useState([]);

	const fetchChapters = async () => {
		try {
			const dataConfig = await generalConfigurationAPI.findConfig();
			setChapters(dataConfig.event.chapters);
		} catch (error) {
			console.log(error.response);
		}
	};

	useEffect(() => {
		fetchChapters();
	}, []);

	moment.locale('fr');
	const formatDate = (str) => moment.utc(str).format("H:mm");

	return (
		<>
		{chapters.map((chapter) => (
				<div key={chapter.id} className="chapters-wrapper-event">
					<div className="h4-wrapper">
						<h4 className="">
							<span>{chapter.name}</span>
						</h4>
						<div className="after-h4"></div>
					</div>

					<div className="description-wrapper">
						{chapter.showTime == 0 && chapter.dateStart && chapter.dateEnd && (
							<div className="date">
								{formatDate(chapter.dateStart)
									? formatDate(chapter.dateStart)
									: ""}{" "}
								à{" "}
								{formatDate(chapter.dateEnd) ? formatDate(chapter.dateEnd) : ""}
							</div>
						)}
						<div dangerouslySetInnerHTML={{ __html: chapter.description }} />
					</div>
					<div className="chapter-main-wrapper">
						{chapter.showTime == 1 && chapter.dateStart && chapter.dateEnd && (
							<div className="chapter-date-wrapper">
								<span className="chapter-date-start">
									{formatDate(chapter.dateStart)
										? formatDate(chapter.dateStart)
										: ""}
								</span>
								<span>-</span>
								<span className="chapter-date-end">
									{formatDate(chapter.dateEnd)
										? formatDate(chapter.dateEnd)
										: ""}
								</span>
							</div>
						)}
						<div className="chapter-programmes">
							{chapter.programmes.map((programme, index) => (
								<div
									key={index}
									id={programme.id}
									className="col col-12 programme-wrapper"
								>
									{(programme.type == 0 && (
										<div className="info-wrapper">
											{programme.image && (
												<div className="programme-img-wrapper">
													<img src={"/uploads/programme/" + programme.image} />
												</div>
											)}
											<div className="content">
												<h5 className="">{programme.name}</h5>
												<div
													dangerouslySetInnerHTML={{
														__html: programme.description,
													}}
												/>
											</div>
										</div>
									)) || (
										<div className="info-wrapper-image">
											{programme.image && (
												<div className="programme-img-wrapper">
													<img src={"/uploads/programme/" + programme.image} />
												</div>
											)}
										</div>
									)}
									{programme.dateStart && (
										<div className="date-wrapper">
											<span className="conf-date-start">{formatDate(programme.dateStart)}</span>
											<span>-</span>
											<span className="conf-date-end">{formatDate(programme.dateEnd)}</span>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			))
		}
		</>
	);
};

export default Programmes;
