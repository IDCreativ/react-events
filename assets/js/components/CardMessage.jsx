import React from "react";

const CardMessage = ({ 
    myMessage,
    allClasses,
    display
}) => {
	return (
		<div className={allClasses}>
			<div
				id={"question-" + myMessage.id}
				data-user-id={myMessage.user.id}
				className="question"
                style={{display: display}}
			>
				<h4>{myMessage.user.firstname} {myMessage.user.lastname}</h4>
				<span>{myMessage.question}</span>
				<div id={"js-answers-" + myMessage.id }>
					{myMessage.answers.map((answer, index) => {
						return (
							<div
								key={index}
								className="answer"
								id={"answer-" + answer.id}
							>
								<span>{answer.answer}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default CardMessage;
