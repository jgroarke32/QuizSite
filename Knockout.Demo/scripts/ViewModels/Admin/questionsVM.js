var questionsVM = function () {
    var self = this;

    self.data = ko.observableArray([]);

    self.filteredQuestions = function () {
        return ko.utils.arrayFilter(self.data(), function (question) {
            return (question.round == self._parent.viewRound());
        });
    };

    self.addQuestions = function (objs) {
        console.log(objs);
        objs.forEach(function (item) {
            self.data.push({
                id: item.quizId,
                question: ko.observable(item.question),
                round: item.round,
                answer: ko.observable(item.answer),
                questionId: item.questionId,
                qtype: ko.observable(item.qtype)
            });
        });
    };

    //Adds questions only from init modal
    self.addInitQuestions = function (amount) {
        self.data.removeAll();
        for (let h = 1; h <= self._parent.quizInfo.rounds(); h++) {
            for (let i = 0; i < amount; i++) {
                self.data.push({
                    question: ko.observable(""),
                    qtype: ko.observable(""),
                    answer: ko.observable(""),
                    round: h,
                    questionid: Math.random().toString(36).substr(2, 9)
                });
            }
        }
    };

    //Needs some more work here
    self.sendQuestions = function () {
        var curqs = self._parent.currentRoundQuestions();
        var send = { question: curqs.map(a => a.question()), answer: curqs.map(a => a.answer()), qtype: curqs.map(a => a.qtype()), round: self._parent.viewRound(), questionId: curqs.map(a => a.questionid), quizId: self._parent.quizInfo.currentQuizid(), content: "addQuestions" };
        console.log(send);
        socket.send(serialize(send));
        if (self._parent.viewRound() != self._parent.quizInfo.rounds()) {
            self._parent.viewRound(self._parent.viewRound() + 1);
            //self.addQuestions(self.questoncount());
            $("#reviewModal").modal('hide');
        }
        else {
            document.getElementById("Savebtn").style.display = "none";
            document.getElementById("finishQuestionInit").style.display = "block";
        }
    }

}