function SortArray(array, direction, comparison) {
    if (array == null) {
        return [];
    }

    for (var oIndex = 0; oIndex < array.length; oIndex++) {
        var oItem = array[oIndex];//1st item in array;
        for (var iIndex = oIndex + 1; iIndex < array.length; iIndex++) {
            var iItem = array[iIndex];//next item in array after oitem;
            var isOrdered = comparison(oItem, iItem);
            if (isOrdered == direction) {
                array[iIndex] = oItem;
                array[oIndex] = iItem;
                oItem = iItem;
            }
        }
    }
    return array;
}

function roundEnd() {
    $("#bId").toggleClass("final");
    $("#bodyId").toggleClass("final");
    $("#bodyId").css({ position: "absolute" })
    $("#roundAnimation").css({
        "z-Index": 33033,
        top: "0px"
    });
    $("#roundAnimation").fadeIn(10000);
}

function newRound() {
    viewModel.quizInfo.currentRound(serverData.round);
    viewModel.viewRound(serverData.round);
    $("#bodyId").css({ position: "" })
    $("#roundAnimation").fadeOut(2000);
    $("#bId").toggleClass("final");
    $("#bodyId").toggleClass("final");
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + "; expires=" + exdate.toUTCString();
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
        c_start = c_value.indexOf(c_name + "=");
    if (c_start == -1)
        c_value = null;
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
            c_end = c_value.length;
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

var getParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

