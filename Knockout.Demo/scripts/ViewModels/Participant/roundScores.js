var roundScoresVM = function () {
    var self = this;

    self.data = ko.observableArray([]);

    self.addScores = function (obj) {
        for (i = 0; i < obj.length; i++) {
            self.data.push({
                user: obj[i].user,
                round: obj[i].round,
                score: obj[i].score
            });
        }
    }

    self.filteredScores = function (round) {
        return ko.utils.arrayFilter(self.data(), function (score) {
            return (score.round == round);
        });
    };
}