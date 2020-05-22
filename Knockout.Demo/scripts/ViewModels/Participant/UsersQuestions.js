var questionsVM = function () {
    var self = this;
    self.data = ko.observableArray([]);
    self.currentRoundSent = ko.observable(false);

    self.addQuestions = function (objs) {
        objs.questions.forEach(function (item) {
            self.data.push({
                id: item.qsid,
                question: item.question,
                round: item.round,
                answer: ko.observable(item.answer) //possibly add isCorrect here
            });
        });
    }

    self.filteredQuestions = function (round) {
        return ko.utils.arrayFilter(self.data(), function (question) {
            return (question.round == round);
        });
    };

    self.newQuestion = function (item) {
        self.data.push({
            id: item.question.quizID,
            question: item.question.question,
            round: item.question.round,
            questionId: item.question.questionId,
            answer: ko.observable("")
        });
    }

    // Animation callbacks for the planets list
    self.showQuestion = function (element) {
        if (element.nodeType === 1) {
            $(element).hide().fadeIn();
        }
    }

    self.allAnswered = function (round) {
        return (self._parent.quizInfo.qperRound() == self.filteredQuestions(round).filter(obj => { return obj.answer() !== '' }).length);
    };

    self.sendAnswers = function () {
        //Add spinning animation to button
        //stop and close modal on the function callback from server
        var reply = self.filteredQuestions(self._parent.viewRound()).filter(obj => { return obj.round == self._parent.viewRound() }).map(obj => ({ questionId: obj.questionId, answer: obj.answer(), round: obj.round }))
        var toSend = {
            content: "sendAnswers",
            quizId: self._parent.quizInfo.quizId(),
            answers: reply
        }
        socket.send(serialize(toSend));


        $("#roundReviewModal").modal('hide');
        self.currentRoundSent(true);
    }

    addonMessageHandler("newQuestion", self.newQuestion);
}