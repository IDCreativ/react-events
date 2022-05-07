import axios from "axios";
import io from "socket.io-client";

function initializeMyJS() {
    console.log('mainWS loaded');
    scrollToBottom();
}

function scrollToBottom() {
    document.getElementById('js-questions')
    if (document.getElementById('js-questions')) {
        $("#js-questions").scrollTop($("#js-questions")[0].scrollHeight);
    }
}

initializeMyJS();

// Websocket
console.log('webSocket loaded')
var socket = io('https://ws-digitalevents.blue-com.fr', {
    withCredentials: false,
    transportationOptions: {
        polling: {
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        }
    }
});

// Variables de départ
var questionStatus = "none";
var input = document.getElementById("js-message");
var button = document.getElementById("js-send-question");
var questionBlock = document.getElementById('js-questions');


document.querySelectorAll('a.js-vote-send').forEach(function (link) {
    link.addEventListener('click', sendVote);
})

if (input) {
    timeout = null;
    input.addEventListener("keyup", function () {
        var eventTyping = 'on sait que quelqu\'un est en train d\'écrire';
        clearTimeout(timeout);

        // Make a new timeout set to go off in 1000ms (1 second)
        timeout = setTimeout(function () {
            console.log('Input Value:', input.value);
            console.log('la personne a arrêté d\'écrire.')
        }, 1000);
        sendIsWriting(eventTyping);
    })
}

if (button) {
    button.addEventListener("click", function (eventClick) {
        eventClick.preventDefault();
        if (input.value != "") {
            msgObj = JSON.stringify({
                questionSent: input.value,
            })
            recordQuestion(msgObj);
            input.value = "";
        }
    });
}

var send = function (msgObj) {
    socket.emit('chat message',msgObj);
    input.value = "";
}

var sendOneMoreVote = function(totalVotesObj) {
    socket.emit('One more vote', totalVotesObj)
}

var sendIsWriting = function (isWriting) {
    var isWriting = 'On émet ce qui est en train d\'être écrit.';
    socket.emit('is writing', isWriting);
}

// Réception

var receiveTotalVotes = function(totalVotesObj) {
    console.log('receiveTotalVotes');
    totalVotesReceived = JSON.parse(totalVotesObj);
    $("#total-vote-"+totalVotesReceived.pollID).html(totalVotesReceived.totalVotes[1])
}

var receiveIsWriting = function (isWriting) {
    console.log('Quelque chose se passe ? '+isWriting);
}

var receive = function(obj) {
    console.log('receive');
    var questionReceiverFront = document.getElementById('js-questions');
    objReceived = JSON.parse(obj);
    if (questionReceiverFront) {
        questionReceiverFront.innerHTML += "<div class='question' style='display: "+ questionStatus +";' id='question-"+ objReceived.questionId +"'><h4>"+ objReceived.questionPrenom +" "+ objReceived.questionNom.substring(0, 1) +".</h4><span>"+ objReceived.questionSent +"</span><div id='js-answers-"+objReceived.questionId +"'></div>";
        scrollToBottom();
    }
}

var receiveDeleteQuestion = function(questionToDelete) {
    console.log('receiveDeleteQuestion');
    document.getElementById("question-"+questionToDelete).remove();
}

var receiveAnswer = function(answer) {
    console.log('receiveAnswer');
    answerReceived = JSON.parse(answer);
    if (document.getElementById("question-"+answerReceived.answerQuestionId)) {
        document.getElementById("question-"+answerReceived.answerQuestionId).style.display = answerReceived.answerSetStatus;
    }
    if (document.getElementById("js-answers-"+answerReceived.answerQuestionId)) {
        document.getElementById("js-answers-"+answerReceived.answerQuestionId).innerHTML += "<div class='answer' id='anwser-"+ answerReceived.answerId +"'>"+ answerReceived.answerText +"</div>";
    }
    scrollToBottom();
}

var changeStatus = function(status) {
    statusReceived = JSON.parse(status);
    console.log('changeStatus');
    var questionToUpdate = document.getElementById("question-"+statusReceived.questionId);
    if (questionToUpdate) {
        if (statusReceived.questionStatus == true) {
            questionToUpdate.style.display = "block";
        }
        else {
            questionToUpdate.style.display = "none";
        }
    scrollToBottom();
    }
}

var changeModuleStatus = function(status) {
    console.log('changeModuleStatus');
    statusReceived = JSON.parse(status);
    if (document.getElementById("nav-"+statusReceived.moduleSlug+"-tab")) {
        if (statusReceived.moduleStatus == true) {
            tabPanes = document.querySelectorAll('.tab-pane').forEach(function(item) {
                item.classList.remove('show');
                item.classList.remove('active');
            })
            allTabs = document.querySelectorAll('.nav-block').forEach(function(item) {
                item.classList.remove('active');
            })
            document.getElementById("nav-"+statusReceived.moduleSlug+"-tab").style.display = "flex";
            document.getElementById("nav-"+statusReceived.moduleSlug+"-tab").classList.add('active');
            document.getElementById("nav-"+statusReceived.moduleSlug).classList.add('show');
            document.getElementById("nav-"+statusReceived.moduleSlug).classList.add('active');
        }
        else {
            tabPanes = document.querySelectorAll('.tab-pane').forEach(function(item) {
                item.classList.remove('show');
                item.classList.remove('active');
            })
            document.getElementById("nav-"+statusReceived.moduleSlug+"-tab").style.display = "none";
            allTabs = document.querySelectorAll('.nav-block').forEach(function(item) {
                item.classList.remove('active')
            })
            document.getElementById("nav-programme").classList.add('show');
            document.getElementById("nav-programme").classList.add('active');
            document.getElementById("nav-programme-tab").classList.add('active');
        }
    }
}

var changePollStatus = function(pollStatus) {
    console.log('changePollStatus');
    pollStatusReceived = JSON.parse(pollStatus);
    if (pollStatusReceived.pollStatus == true) {
        document.getElementById('fieldset-'+pollStatusReceived.pollID).disabled = false;
        document.getElementById('poll-overlay-'+pollStatusReceived.pollID).classList.remove('active');
    }
    else {
        document.getElementById('fieldset-'+pollStatusReceived.pollID).disabled = true;
        document.getElementById('poll-overlay-'+pollStatusReceived.pollID).classList.add('active');
    }
}

var changeEventStatus = function(eventStatus) {
    console.log('changeEventStatus');
    eventStatusReceived = JSON.parse(eventStatus);
    console.table(eventStatusReceived);
    if (eventStatusReceived.eventStatus == true && eventStatusReceived.eventEmbeded) {
        document.getElementById('fieldset-qr').disabled = false;
        console.log('L\'événement passe à true')
        var createdEventReceiver = document.getElementById('js-live-container');
        createdEventReceiver.innerHTML =  `
            <div id="video-${eventStatusReceived.videoID}" class="video-container" data-ytid="${eventStatusReceived.youtubeId}">
                <div id="code-video-${eventStatusReceived.videoID}" class="embed-responsive embed-responsive-16by9">
                    ${eventStatusReceived.eventEmbeded}
                </div>
            </div>
        `;
    }
    else if (eventStatusReceived.eventStatus == false) {
        document.getElementById('fieldset-qr').disabled = true;
        console.log('L\'événement passe à false')
        var createdEventReceiver = document.getElementById('js-live-container');
        createdEventReceiver.innerHTML =  `
            <div class="waiting-block">
                <div id="disclaimer" class="alert alert-danger text-center" role="alert">
                    De retour prochainement.
                </div>
                <img src="img/waiting-bg.jpg" alt="">
            </div>
        `;
    }
    else {
        console.log('L\'événement passe à '+eventStatusReceived.eventStatus)
        if (eventStatusReceived == true) {
            document.getElementById('fieldset-qr').disabled = false;
        }
        else {
            document.getElementById('fieldset-qr').disabled = true;
        }
        var createdEventReceiver = document.getElementById('js-live-container');
        createdEventReceiver.innerHTML =  `
            <div class="waiting-block">
                <div id="disclaimer" class="alert alert-danger text-center" role="alert">
                    De retour prochainement.
                </div>
                <img src="img/waiting-bg.jpg" alt="">
            </div>
        `;
    }
}

var changeVideoStatus = function(videoStatus) {
    console.log('changeVideoStatus');
    videoStatusReceived = JSON.parse(videoStatus);
    console.table(videoStatusReceived);
    var createdEventReceiver = document.getElementById('js-live-container');
    if (videoStatusReceived.eventStatus ==  true && videoStatusReceived.videoStatus == true && videoStatusReceived.eventVideo == videoStatusReceived.videoID) {
        console.log('La vidéo passe à true')
        createdEventReceiver.innerHTML =  `
            <div id="video-${videoStatusReceived.eventVideo}" class="video-container" data-ytid="${videoStatusReceived.youtubeId}">
                <div id="code-video-${videoStatusReceived.eventVideo}" class="embed-responsive embed-responsive-16by9">
                    ${videoStatusReceived.videoEmbeded}
                </div>
            </div>
        `;
    }
    else if (videoStatusReceived.eventStatus ==  true && videoStatusReceived.videoStatus == false && videoStatusReceived.videoPosition < videoStatusReceived.eventVideoPosition) {
        console.log('La vidéo passe à false. On passe sur une autre vidéo');
        createdEventReceiver.innerHTML =  `
            <div id="video-${videoStatusReceived.eventVideo}" class="video-container" data-ytid="${videoStatusReceived.youtubeId}">
                <div id="code-video-${videoStatusReceived.eventVideo}" class="embed-responsive embed-responsive-16by9">
                    ${videoStatusReceived.videoEmbeded}
                </div>
            </div>
        `;
    }
    else if (videoStatusReceived.eventVideo == false) {
        console.log('Y\'a plus de vidéos pour cet événement.');
        createdEventReceiver.innerHTML =  `
            <div class="waiting-block">
                <div id="disclaimer" class="alert alert-danger text-center" role="alert">
                    De retour prochainement.
                </div>
                <img src="img/waiting-bg.jpg" alt="">
            </div>
        `;
    }
    // else if (videoStatusReceived.eventStatus ==  true && videoStatusReceived.videoStatus == false  && videoStatusReceived.eventVideoPosition > videoStatusReceived.videoPosition) {
    //     console.log('On passe la vidéo en OFF et ce n\'est pas la vidéo de l\'event. Du coup on fait rien.');
    // }
    else {
        console.log('Tous les autres cas');
    }
}

var changePollVisibility = function(pollVisibility) {
    console.log('changePollVisibility');
    pollVisibilityReceived = JSON.parse(pollVisibility);
    if (pollVisibilityReceived.pollVisibility == true) {
        document.getElementById('poll-'+pollVisibilityReceived.pollID).style.display = "block";
    }
    else {
        document.getElementById('poll-'+pollVisibilityReceived.pollID).style.display = "none";
    }
}

var showPollResults = function(pollID) {
    console.log('showPollResults');
    checkOptionTotal();
    if ($('#poll-resultats-'+pollID).hasClass('d-none')) {
        $('#poll-resultats-'+pollID).removeClass('d-none');
        $('#poll-options-'+pollID).addClass('d-none');
    }
    else {
        $('#poll-resultats-'+pollID).addClass('d-none');
        $('#poll-options-'+pollID).removeClass('d-none');
    }
}

socket.on('chat message', receive);
socket.on('change status', changeStatus);
socket.on('change moduleStatus', changeModuleStatus);
socket.on('change eventStatus', changeEventStatus);
socket.on('change videoStatus', changeVideoStatus);
socket.on('change pollStatus', changePollStatus);
socket.on('change pollVisibility', changePollVisibility);
socket.on('show pollResults', showPollResults);
socket.on('chat answer', receiveAnswer);
socket.on('delete question', receiveDeleteQuestion);
socket.on('One more vote', receiveTotalVotes);


// Envoi et enregistrement des informations
function sendVote(event) {
    event.preventDefault();

    var pollId = this.id;
    var pollValue = document.querySelector('input[name="poll-vote-'+CSS.escape(pollId)+'"]:checked').value;
    console.log("ID du sondage : "+pollId)
    console.log("ID de l'option : "+pollValue)
    const url = "/send-vote";
        axios.post(url, {
            voteOptionId: pollValue,
            votePoll: pollId,
        })
        .then((response) => {
            //console.log(response.data.code);
            console.table(response.data);
            if (response.data.code == 200) {
                $('#vote-sent').modal('show');
                setTimeout(function(){
                    $('#vote-sent').modal('hide')
                }, 3000);
                $("#js-vote-sent").html(response.data.message)
                totalVotesObj = JSON.stringify({
                    pollID: response.data.pollID,
                    totalVotes: response.data.totalVotes
                })
                sendOneMoreVote(totalVotesObj)
            }
            else if (response.data.code == 403) {
                $('#vote-sent').modal('show');
                $("#js-vote-sent").html('Accès interdit')
            }
        }, (error) => {
            console.log(error);
        }); 
    
}

function recordQuestion(msgObj) {
    messageQuestion = JSON.parse(msgObj).questionSent;
    if (messageQuestion == "")
    {
        alert("Vous devez remplir le champ 'Question' !");
    }
    else
    {
        const url = "/send-question";
        axios.post(url, {
            questionSent: messageQuestion,
        })
        .then((response) => {
            msgObj = JSON.stringify({
                questionId: response.data.id,
                questionSent: response.data.questionSent,
                questionNom: response.data.questionNom,
                questionPrenom: response.data.questionPrenom,
                questionEmail: response.data.questionEmail
            })
            send(msgObj);
        }, (error) => {
            console.log(error);
        });
        messageQuestion.value = "";

        $('#question-sent').modal('show');
        setTimeout(function(){
            $('#question-sent').modal('hide')
        }, 3000);
        $("#js-question-sent").html('Votre question a bien été envoyée. Si vous n\'avez pas la réponse durant la web-conférence, vous serez recontacté par e-mail ou par téléphone.')
    }   
}

function checkOptionTotal() {
    console.log('checkOptionTotal')
    $('.js-option').each(function(index, item) {
        var optionId =item.id;
        var url = "/poll-option-total/id/"+optionId;
        axios.get(url)
        .then(response => {
            item.innerHTML = response.data.total[1];
            totalVotes = response.data.totalVotes[1];
            if (totalVotes == null) {
                totalVotes = 0;
            }
            $('#total-vote-'+response.data.pollId).html(" "+totalVotes);
        })
        .catch(function(error) {
            if(error) {
                console.log(error);
            }
        })
    })
}

