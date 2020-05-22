var quizVM = function () {
    var self = this;

    self.userName = ko.observable();
    self.userId = ko.observable();
    self.liveQuiz = ko.observable(false); //Bool to determine if quiz has started
    self.totalRounds = ko.observable(0); //Total Rounds of current quiz
    self.qperRound = ko.observable(0);
    self.currentRound = ko.observable(0); //Round the live quiz is currently on
    self.quizId = ko.observable();
    self.quizStartTime = ko.observable();

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

    self.quizStart = function (info) {
        setCookie('quizId', self.quizId());
        setCookie('usid', self.userId());
        $("#WaitingRoomModal").modal('hide');
        self.totalRounds(info.quizInfo.rounds);
        self.qperRound(info.quizInfo.qperround);
        self.currentRound(info.quizInfo.currentRound);
        self.quizStartTime(info.quizInfo.start);
        self.liveQuiz(true);
        //Start round 1. Maybe add animation
        //Srart fading stuff in
    }

    self.quizEnd = function (info) {
        document.cookie = document.cookie + ";max-age=0"; //Delete cookie;
    };

    addonMessageHandler("quizStart", self.quizStart);
}