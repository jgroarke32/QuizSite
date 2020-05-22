var answersVM = function () {
    var self = this;

    self.data = ko.observableArray([]);

    //Each answer obj has answers for entire round
    self.addAnswers = function (objs) {
        for (i = 0; i < objs.answers.length; i++) {
            self.data.push({
                round: objs.answers[i].round,
                id: objs.answers[i].questionId,
                answer: objs.answers[i].answer,
                user: objs.answers[i].user,
                isCorrect: ko.observable('')
            });
        };
        self._parent.showMarkModal();
    }

    self.markCorrect = function (answer) {
        var index = self.data().indexOf(answer);
        self.data()[index].isCorrect(true);
        self._parent.roundScores.determineRoundScore(answer.user);
    }

    self.markIncorrect = function (answer) {
        var index = self.data().indexOf(answer);
        self.data()[index].isCorrect(false);
        self._parent.roundScores.determineRoundScore(answer.user);
    }

    self.filteredAnswers = function (qsid) {
        return ko.utils.arrayFilter(self.data(), function (answer) {
            return (answer.id == qsid && answer.round == self._parent.viewRound());
        });
    };

    self.isallCorrected = ko.computed(function () {
        var cor = self.data().filter(obj => { return obj.round == self._parent.viewRound() && obj.isCorrect() === '' });
        return Boolean(cor.length === 0);
    });

    addonMessageHandler("answers", self.addAnswers);
}