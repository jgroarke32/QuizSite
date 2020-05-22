var questionsVM = function () {
    var self = this;

    self.data = ko.observableArray([]);

    self.addQuestions = function (objs) {
        objs.questions.forEach(function (item) {
            self.data.push({
                quizId: item.quizId,
                question: item.question,
                round: item.round,
                answer: item.answer,
                questionId: item.questionId,
                qValue: 1,
                isSent: ko.observable(item.isSent)
            });
        });
    };

    self.sendQtoClients = function (question) {
        var replies = {
            quizId: question.quizId,
            qid: question.questionId,
            content: "sendQtoUsers"
        };
        socket.send(serialize(replies));
    };

    self.sendQcalbck = function (info) {
        self.data().filter(obj => { return obj.questionId == info.questionId })[0].isSent(info.isSent);
    }

    self.filteredQuestions = function (round) {
        return ko.utils.arrayFilter(self.data(), function (question) {
            return (question.round == round);
        });
    };

    // Animation callbacks for the planets list
    self.showQuestion = function (element) {
        if (element.nodeType === 1) {
            $(element).hide().fadeIn();
        }
    }
    addonMessageHandler("sendQcalbck", self.sendQcalbck);
}