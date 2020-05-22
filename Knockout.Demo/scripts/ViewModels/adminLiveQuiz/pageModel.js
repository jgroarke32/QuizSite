var pageModel = function () {
    var self = this;

    self.addChild = function (property, child) {
        child._parent = this;
        this[property] = child;
        return;
    };

    self.addChild("quizInfo", new quizVM());
    self.addChild("questions", new questionsVM());
    self.addChild("users", new quizUsersVM());
    self.addChild("answers", new answersVM());
    self.addChild("roundScores", new roundScoresVM({
        rounds: self.quizInfo.roundsList(),
        totalRounds: self.quizInfo.totalRounds(),
        qperRound: self.quizInfo.qperRound(),
        answers: self.answers.data(),
        users: self.users.data().map(user => user.name)
    }));

    self.viewRound = ko.observable(1); //Current round of questions admin is viewing

    self.openSummary = function () {
        self.leaderboard();
        document.getElementById('correctionModal').style.zIndex = "0";
        $('#masterLeaderboard').clone().appendTo('#summaryBody');
    }

    self.closeSummary = function () {
        document.getElementById('correctionModal').style.zIndex = "1050";
    }


    self.showMarkModal = ko.computed(function () {
        var expectedAnswers = self.quizInfo.qperRound() * self.users.data().length;
        var allSent = self.questions.filteredQuestions(self.viewRound()).map(q => q.isSent());
        //Also include round == quizInfo.currentRound()
        return 0 !== expectedAnswers && expectedAnswers == self.answers.data().filter(item => { return item.round == self.viewRound() && allSent.every(x => x == true) }).length;
    });

    self.answersReturnedPct = ko.computed(function () {
        if (0 == self.users.data().length) { return 0 + "%" }
        else {
            var expectedAnswers = self.quizInfo.qperRound() * self.users.data().length;
            var currentAnswers = self.answers.data().filter(item => { return item.round == self.viewRound() }).length;
            return (currentAnswers / expectedAnswers * 100) + "%";
        }
    });

    self.answersReturnedPctTxt = ko.computed(function () {
        var expectedUsers = self.users.data().length;
        var users = [...new Set(self.answers.data().map(ans => ans.user))];
        return users.length + " of " + expectedUsers + " answers for Round " + self.quizInfo.currentRound();
    });

    self.answersReturnedList = ko.computed(function () {
        var expectedUsers = self.users.data().map(usr => usr.name);
        var array = [];
        var users = self.answers.data().filter(item => { return item.round == self.viewRound() }).map(a => a.user);
        var difference = expectedUsers.filter(x => !users.includes(x));
        difference.forEach(function (item) {
            array.push({
                user: item,
                isSent: false
            })
        });
        expectedUsers.filter(x => !difference.includes(x)).forEach(function (item) {
            array.push({
                user: item,
                isSent: true
            })
        });
        return array;
    });


    self.leaderboard = ko.computed(function () {
        if (ko.computedContext.isInitial()) {
            return self.users.data().map(obj => ({ user: obj.name, score: 0 }));
        }
        else {
            console.log("Helping");
            var users = self.users.data().map(a => a.name);//Filter this where not an admin
            var usersScores = [];
            for (i = 0; i < users.length; i++) {
                var rScores = self.roundScores.data().filter(obj => { return obj.user == users[i] });
                var tscore = rScores.map(a => a.score()).reduce(function (a, b) { return a + b; }, 0);
                usersScores.push({
                    user: users[i],
                    score: tscore
                });
            };
            return SortArray(usersScores, true, function (left, right) { return left.score < right.score; })
        }
    });

    self.sendRound = function () {
        var rndScores = self.roundScores.filteredRoundScores(self.viewRound()).map(obj => ({ round: obj.round, user: obj.user, score: obj.score() }));
        var toSend = {
            content: "sendnewRoundToUsers",
            quizId: self.quizInfo.quizId,
            round: self.quizInfo.currentRound() + 1,
            roundScores: rndScores
        };
        socket.send(serialize(toSend));
        //Animation here on button
        //close on callback function from server
        self.closeSummary();
        $("#correctionModal").modal('hide');
        $("#summaryModal").modal('hide');
        self.quizInfo.currentRound(self.quizInfo.currentRound() + 1);
        self.viewRound(self.quizInfo.currentRound());
    };

    self.initPage = function (info) {
        //quiz set up
        self.quizInfo.totalRounds(info.quizInfo.rounds);
        self.quizInfo.qperRound(info.quizInfo.qperround);
        self.quizInfo.quizId = info.quizInfo.quizId;
        self.questions.addQuestions(info);
    }

    self.adminCallBck = function (serverData) {
        self.users.addUsers(serverData);
        var message = { content: "getQuizInfo", quizId: 1234 };
        socket.send(serialize(message));
    }

    self.resumeQuiz = function (serverData) {
        self.questions.addQuestions(serverData);
        self.roundScores.addScores(serverData);
        self.answers.addAnswers(serverData);
        self.users.addUsers(serverData);
        self.quizInfo.resumeQuiz(serverData);
    }

    self.finishQuiz = function () {

    }
};
var viewModel = new pageModel();


addonMessageHandler("adminQuiz", viewModel.initPage);

addonMessageHandler("resumeAdmin", viewModel.resumeQuiz)

addonMessageHandler("AdminCallbck", viewModel.adminCallBck);

$(document).ready(function () {
    //$("#startupModal").modal('show');
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