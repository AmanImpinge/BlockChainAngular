var ssCookie = new function () {

    var cookiesDisabled = false;

    var save = function (name, value, days) {
        var date = new Date();
        if (days != null) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else {
            //make cookie expire in 10 years
            date.setTime(date.getTime() + (365 * 10 * 24 * 60 * 60 * 1000));
            var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";

    };

    var read = function (name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) == 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;

    };

    var test = function () {
        ssCookie.save('ssnetTest', 'testSuccessful', '1');
        var checkCookie = ssCookie.read('ssnetTest');
        if (checkCookie === undefined || checkCookie != 'testSuccessful') {
            ssCookie.cookiesDisabled = true;
        }
    };

    //Sorry but delete is a reserved keyword. Use destory instead
    var destroy = function (name) {
        createCookie(name, "", -1);
    };

    return {
        save: save,
        read: read,
        test: test,
        destroy: destroy,
        cookiesDisabled: cookiesDisabled
    };
}();
