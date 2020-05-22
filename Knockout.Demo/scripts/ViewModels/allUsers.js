var quizUsersVM = function () {
    var self = this;

    self.data = ko.observableArray([]);

    self.addUsers = function (objs) {
        objs.currentUsers.forEach(function (item) {
            if (!self.data().map(a => a.id).includes(item.id)) {
                FB.api("/" + item.id + "/picture?redirect=false", function (response) {
                    console.log(response.data.url);

                    self.data.push({
                        id: item.id,
                        pid: ko.observable(response.data.url),
                        name: item.name,
                        isAdmin: false, //Currently unused
                        online: ko.observable(true)
                    });
                });
            };
        });
    }

    self.userOffline = function (userName) {
        ko.utils.arrayForEach(self.data(), function (item) {
            if (item.name == userName.user) {
                item.online(false);
            }
        });
    }

    addonMessageHandler("newUserCallbck", self.addUsers);
    addonMessageHandler("userDisconnect", self.userOffline);
}