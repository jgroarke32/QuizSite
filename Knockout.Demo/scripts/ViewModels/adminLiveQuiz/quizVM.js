var quizVM = function () {
    var self = this;

    self.liveQuiz = ko.observable(false); //Bool to determine if quiz has started
    self.totalRounds = ko.observable(0); //Total Rounds of current quiz
    self.qperRound = ko.observable(0);
    self.currentRound = ko.observable(0); //Round the live quiz is currently on
    self.quizId = '';
    self.quizStartTime = ko.observable();
    self.userName = ko.observable();
    self.userId = ko.observable();

    self.roundsList = ko.computed(function () {
        return Array.from(Array(parseInt(self.totalRounds())).keys()).map(n => n + 1);
    });

    self.roundsPlayedList = ko.computed(function () {
        return Array.from(Array(parseInt(self.currentRound())).keys()).map(n => n + 1);
    });

    self.determineRoundCount = ko.computed(function () {
        var arr = [];
        var rds = self.totalRounds();
        var i = 1;
        while (i <= rds) {
            arr.push(i++);
        }
        return arr;
    });

    //server callback
    self.startQuiz = function () {
        self.liveQuiz(true);
        setCookie('quizId', self.quizId);
        $("#waitingRoomModal").modal('hide');
        toSend = {
            content: "startQuiz",
            quizId: self.quizId
        }
        socket.send(serialize(toSend));
    }
    //Send to server
    self.quizStart = function (info) {
        //self.quizStartTime(info.);
        self.currentRound(1);
    }

    self.resumeQuiz = function (info) {
        info = info.quizInfo;
        self.liveQuiz(true);
        self.currentRound(info.currentRound);
        self.totalRounds(info.rounds);
        self.qperRound(info.qperround);
        self.quizId = info.quizId;
    }

    addonMessageHandler("quizStart", self.quizStart);

}