var quizVM = function () {
    var self = this;

    self.quizInfo = ko.observableArray([]);

    self.questioncount = ko.observable(0);
    self.userid = ko.observable('Kealan');
    self.currentQuizid = ko.observable(1234);
    self.rounds = ko.observable(1);

    self.fetchQuiz = function () {
        console.log("open" + getSocketState());
        var message = { content: "getQuestions", quizId: 1234 }
        socket.send(serialize(message));
        $("#startupModal").modal('hide');
        self._parent.shouldShowQuestions(true);

    }

    self.startQuiz = function () {
        window.location.href = "adminlivequiz.html";
    }
}