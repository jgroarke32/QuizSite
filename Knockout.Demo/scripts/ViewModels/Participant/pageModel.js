var pageModel = function () {
    var self = this;

    self.addChild = function (property, child) {
        child._parent = this;
        this[property] = child;
        return;
    };

    self.addChild("quizInfo", new quizVM)
    self.addChild("questions", new questionsVM());
    self.addChild("users", new quizUsersVM());
    self.addChild("roundScores", new roundScoresVM());

    self.viewRound = ko.observable(1);


    self.leaderboard = ko.computed(function () {
        if (self.roundScores.data().length === 0) {
            return self.users.data().map(obj => ({ user: obj.name, score: 0 }));
        }
        else {
            var users = _.uniq(self.roundScores.data().map(a => a.user));
            var usersScores = [];
            for (i = 0; i < users.length; i++) {
                var tscore = self.roundScores.data().filter(obj => { return obj.user == users[i] }).map(a => a.score).reduce(function (a, b) { return a + b; }, 0);
                usersScores.push({
                    user: users[i],
                    score: tscore
                });
            };
            return SortArray(usersScores, true, function (left, right) { return left.score < right.score; })
        }
    });

    self.startInfoReady = ko.computed(function () {
        return self.quizInfo.userName() != undefined && self.quizInfo.quizId() > 1;
    });

    self.startWS = function () {
        if (socket == undefined) {
            console.log("Start ws");
            connectWebSocket({
                server: 'localhost',
                port: '5050'
            });
        } else { console.log("Already inited"); }
    }

    self.resumeQuiz = function (data) {
        viewModel.users.addUsers(data);
        viewModel.quizInfo.quizStart(data);
        viewModel.questions.addQuestions(data);

        //Also add round scores where necessary 
    };
};

var viewModel = new pageModel();


//addonMessageHandler("users", viewModel.users.addUsers);

addonMessageHandler("resumeQuiz", viewModel.resumeQuiz);

addonMessageHandler("newRound", function () {
    viewModel.addScores(serverData.roundScores);
    viewModel.questions.currentRoundSent(false);
    roundEnd();
});


var cookie = parseInt(getCookie('quizId'));
var user = getCookie('usid');
viewModel.quizInfo.userName(user);
viewModel.quizInfo.quizId(cookie);
var wsOnOpen = function (item) {
    var userinfo = { content: "newUser", user: viewModel.quizInfo.userName(), userId: viewModel.quizInfo.userId(), quizId: parseInt(viewModel.quizInfo.quizId()) };
    socket.send(serialize(userinfo));
}
addwsOpenHandler(wsOnOpen, 1);

if (!cookie) {
    //Show modal on startup
    $(document).ready(function () {
        $("#startupModal").modal('show');


        window.fbAsyncInit = function () {
            FB.init({
                appId: '268936764261592',
                autoLogAppEvents: true,
                cookie: true,
                xfbml: true,
                version: 'v7.0'
            });

            FB.getLoginStatus(function (response) {   // Called after the JS SDK has been initialized.
                statusChangeCallback(response);        // Returns the login status.
            });
        };
    });
}
else {
    connectWebSocket({
        server: 'localhost',
        port: '5050'
    });

    addwsOpenHandler(function () {
        socket.send(serialize({ content: "retrieveQuizData", quizId: cookie, userId: user }));
    }, 1);
}