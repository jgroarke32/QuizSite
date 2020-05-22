var roundScoresVM = function (info) {
    var self = this;

    self.data = ko.observableArray([]);

    for (i = 0; i < info.totalRounds; i++) {
        for (j = 0; j < info.users.length; j++) {
            var rndScore = info.answers.filter(answer => { return answer.round == info.rounds[i] && answer.user == info.users[j] && answer.isCorrect() == true }).length;
            self.data().push({
                user: info.users[j],
                round: info.rounds[i],
                score: ko.observable(rndScore)
            });
        }
    };

    self.addScores = function (obj) {
        obj = obj.roundScores;
        for (i = 0; i < obj.length; i++) {
            self.data.push({
                user: obj[i].user,
                round: obj[i].round,
                score: ko.observable(obj[i].score)
            });
        }
        self.data.notifySubscribers();
    }

    self.filteredRoundScores = function (round) {
        return ko.utils.arrayFilter(self.data(), function (question) {
            return (question.round == round);
        });
    };

    self.roundsPlayed = ko.computed(function () {
        if (self.data().length == 0) { return 0 };
        return Array.from(Array( ko.utils.arrayGetDistinctValues(self.data().map(a => a.round))).keys()).map(n => n + 1);
    });

    //probably change soon
    self.determineRoundScore = function (user) {
        var correct = self._parent.answers.data().filter(obj => { return obj.round == self._parent.viewRound() && obj.user == user && obj.isCorrect() == true });

        var index = self.data().indexOf((self.data().filter(obj => { return obj.round == self._parent.viewRound() && obj.user == user }))[0]);
        if (index >= 0) {
            self.data()[index].score(correct.length)
        }
        else {
            self.data().push({
                user: user,
                round: self._parent.viewRound(),
                score: ko.observable(correct.length)
            })
        }
        self.data.notifySubscribers();
    }
}