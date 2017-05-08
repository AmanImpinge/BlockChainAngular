//<reference path="../extDefinitions/jquery.d.ts" />
var general = (function () {
    var randomVersion = function () {
        return Math.round(Math.random() * 100000);
    };
    return {
        randomVersion: randomVersion
    };
})();

var waitOverlay = (function () {
    //This method is also called on hashchange. in JSDataService
    //This should only be called by Ajax setup.
    //But if your ajax call defines a "complete" callback then
    //Your need to call .hide();
    var hideIfZeroCounter = 0;
    var hasTabAjaxCall = false;

    var init = function () {
        waitOverlay.hideIfZeroCounter = 0;
        waitOverlay.hide();
    };

    var show = function () {
        ++waitOverlay.hideIfZeroCounter;
        $('#divWaitSpinner').removeClass('noShow');
    };
    var hideWaitSpinner = function () {
        setTimeout(function () {
            if (waitOverlay.hideIfZeroCounter > 0) {
                return;
            }
            waitOverlay.hideIfZeroCounter = 0;
            $('#divWaitSpinner').addClass('noShow');
        }, 1000);
    };
    var hide = function () {
        --waitOverlay.hideIfZeroCounter;
        if (waitOverlay.hideIfZeroCounter > 0) {
            return void (0);
        }
        if ($('#divWaitSpinner').hasClass('isWaitingForEventToCloseSpinner')) {
            return void (0);
        }
        if (hasTabAjaxCall) {
            hasTabAjaxCall = false;
            return void (0);
        }

        hideWaitSpinner();
    };

    var keepOverlayUntilDone = function () {
        $('#divWaitSpinner').addClass('isWaitingForEventToCloseSpinner');
        waitOverlay.show();
    };

    var hideOverlayAfterEventDone = function () {
        $('#divWaitSpinner').removeClass('isWaitingForEventToCloseSpinner');
        waitOverlay.hide();
    };

    var blockHideOverlay = function (shouldBlockOverlay) {
        if (!shouldBlockOverlay) {
            return hideOverlayAfterEventDone();
        }
        return keepOverlayUntilDone();
    };

    var setHasTabAjaxCall = function (isTab) {
        hasTabAjaxCall = isTab;
    };

    return {
        init: init,
        show: show,
        hide: hide,
        blockHideOverlay: blockHideOverlay,
        hideIfZeroCounter: hideIfZeroCounter,
        setHasTabAjaxCall: setHasTabAjaxCall
    };
})();

var openDialog = (function () {
    //This method is also called on hashchange. in JSDataService
    //This should only be called by Ajax setup.
    //But if your ajax call defines a "complete" callback then
    //Your need to call .hide();
    var okButtonCallback = null;
    var init = function () {
        $(".lbClickClose").on('click', function () {
            hide();
        });
        $("#btnOkButton").on('click', function () {
            if (okButtonCallback != null) {
                okButtonCallback();
            }
        });
        openDialog.hide();
    };

    var show = function (content, okText, okButton) {
        $("#lightBoxContent").html(content);
        $("#divLoginBox").text(okText);
        okButtonCallback = okButton;
        $('#divDialogNotification').removeClass('noShow');
    };

    var hide = function () {
        $('#divDialogNotification').addClass('noShow');
        okButtonCallback = null;
    };

    return {
        init: init,
        show: show,
        hide: hide
    };
})();
//# sourceMappingURL=global.js.map
