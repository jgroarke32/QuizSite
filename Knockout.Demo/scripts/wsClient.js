//Simple handling of 1 websocket connection

var socket, loadedFlag;
var timeout = 2000;
var clearTimer = -1;

function handleErrors(sError, sURL, iLine) {
    return true;
};
function getSocketState() {
    return (socket != null) ? socket.readyState : 0;
}


var onMessageHandlers = [];

function addonMessageHandler(event ,handler) {
    onMessageHandlers.push({
        event: event,
        func: handler
    });
    //console.log()
}


function wsonMessage(e) {
    var serverData = $.parseJSON(e.data);
    console.log(serverData);

    onMessageHandlers.filter(obj => { return obj.event == serverData.content }).forEach(function (handler) {
        handler.func(serverData)
    });
}

function onMessage(e) {
    var serverData = $.parseJSON(e.data);
    console.log(serverData);

    if (serverData.content == "adminQuiz") {
        viewModel.initPage(serverData)
    }

    if (serverData.content == "questions") {
        viewModel.totalRounds(serverData.rounds);
        viewModel.addQuestions(serverData.questions);
    }

    if (serverData.content == "users") {
        viewModel.users.addUsers(serverData.users);
    }

    if (serverData.content == "answers") {
        viewModel.answers.addAnswers(serverData.answers);
    }

    if (serverData.content == "sendQcalbck") {
        viewModel.questions.sendQcalbck(serverData);
    }

    if (serverData.content == "quizStart") {
        viewModel.quizInfo.quizStart();
    }

    if (serverData.content == "newUserCallbck") {
        viewModel.users.addUsers(serverData.currentUsers);
        var message = { content: "getQuizInfo", quizId: 1234, user: viewModel.userName() }
        socket.send(serialize(message));
    }
}

function onError() {
    clearInterval(clearTimer);
    socket.onclose = function () {
        loadedFlag = false;
    };
    clearTimer = setInterval("connectWebSocket()", timeout);
}

function onClose() {
    loadedFlag = false;
    clearInterval(clearTimer);
    clearTimer = setInterval("connectWebSocket()", timeout);
}

var wsOpenHandlers = [];

function addwsOpenHandler(handler, args) {
    wsOpenHandlers.push({
        func: handler,
        args: args
    });
    //console.log()
}

function onOpen() {
    clearInterval(clearTimer);
    console.log("open" + getSocketState());
    //var userinfo = { content: "newAdmin", user: viewModel.userName(), quizId: 1234 };
    //socket.send(serialize(userinfo)); Need to move else where

    wsOpenHandlers.forEach(function (handler) {
        handler.func(handler.args);
    });

}

//If info.(property) isnt defined find way to use default
function connectWebSocket(info) {

    if ("WebSocket" in window) {
        if (getSocketState() === 1) {
            socket.onopen = onOpen; //Keep default for now
            clearInterval(clearTimer);
            console.log(getSocketState());
        }
        else {
            try {
                //Replace below with info.server and info.port
                host = "ws://" + info.server + ":" + info.port;
                socket = new WebSocket(host);
                socket.onopen = onOpen;
                socket.onmessage = function (e) {
                    wsonMessage(e);
                };
                socket.onerror = onError;
                socket.onclose = onClose;
            }
            catch (exeption) {
                console.log(exeption);
            }
        }
    }
}