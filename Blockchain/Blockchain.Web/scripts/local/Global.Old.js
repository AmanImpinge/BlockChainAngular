var WaitOverlayNew = new function () {
    //This method is also called on hashchange. in JSDataService
    //This should only be called by Ajax setup.
    //But if your ajax call defines a "complete" callback then
    //Your need to call .hide();

    var hideIfZeroCounter = 0;
    var hasTabAjaxCall = false;
    var hideCounter = 0;

    var init = function () {
        WaitOverlayNew.hideIfZeroCounter = 0;
        WaitOverlayNew.hide();
    };

    var show = function () {
        ++WaitOverlayNew.hideIfZeroCounter;
        $('#divWaitSpinner').removeClass('noShow');
    };

    var hide = function (referral) {
        if (typeof referral == "undefined") {
            referral = "undefined";
        }
        --WaitOverlayNew.hideIfZeroCounter;
        if (WaitOverlayNew.hideIfZeroCounter > 0) {
            return void (0);
        }
        if ($('#divWaitSpinner').hasClass('isWaitingForEventToCloseSpinner')) {
            return void (0);
        }
        if (hasTabAjaxCall) {
            hasTabAjaxCall = false;
            return void (0);
        }
        ++hideCounter;
        return hideWaitSpinner(hideCounter);
    };

    var hideWaitSpinner = function (count) {
        setTimeout(function () {
            if (WaitOverlayNew.hideIfZeroCounter > 0) {
                return;
            }
            WaitOverlayNew.hideIfZeroCounter = 0;
            $('#divWaitSpinner').addClass('noShow');
        }, 1000);
    };

    var keepOverlayUntilDone = function () {
        $('#divWaitSpinner').addClass('isWaitingForEventToCloseSpinner');
        WaitOverlayNew.show();
    };

    var hideOverlayAfterEventDone = function () {
        $('#divWaitSpinner').removeClass('isWaitingForEventToCloseSpinner');
        WaitOverlayNew.hide();
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
}();
var OpenDialog = new function () {
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
        OpenDialog.hide();
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
}();
var General = new function () {
    var randomVersion = function () {
        return Math.round(Math.random() * 100000);
    };
    return {
        randomVersion: randomVersion
    }
}();
angular.module("datetime", []).directive("datetime", function (datetime, $log, $document) {
    var doc = $document[0];

    function getInputSelectionIE(input) {
        var bookmark = doc.selection.createRange().getBookmark();
        var range = input.createTextRange();
        var range2 = range.duplicate();

        range.moveToBookmark(bookmark);
        range2.setEndPoint("EndToStart", range);

        var start = range2.text.length;
        var end = start + range.text.length;
        return {
            start: start,
            end: end
        };
    }

    function getInputSelection(input) {
        input = input[0];

        if (input.selectionStart != undefined && input.selectionEnd != undefined) {
            return {
                start: input.selectionStart,
                end: input.selectionEnd
            };
        }

        if (doc.selection) {
            return getInputSelectionIE(input);
        }
    }

    function getInitialNode(nodes) {
        return getNode(nodes[0]);
    }

    function setInputSelectionIE(input, range) {
        var select = input.createTextRange();
        select.moveStart("character", range.start);
        select.collapse();
        select.moveEnd("character", range.end - range.start);
        select.select();
    }

    function setInputSelection(input, range) {
        input = input[0];

        if (input.setSelectionRange) {
            input.setSelectionRange(range.start, range.end);
        } else if (input.createTextRange) {
            setInputSelectionIE(input, range);
        }
    }

    function getNode(node, direction) {
        if (!direction) {
            direction = "next";
        }
        while (node && (node.token.type == "static" || node.token.type == "regex")) {
            node = node[direction];
        }
        return node;
    }

    function addDate(date, token, diff) {
        switch (token.name) {
            case "year":
                date.setFullYear(date.getFullYear() + diff);
                break;
            case "month":
                date.setMonth(date.getMonth() + diff);
                break;
            case "date":
            case "day":
                date.setDate(date.getDate() + diff);
                break;
            case "hour":
            case "hour12":
                date.setHours(date.getHours() + diff);
                break;
            case "ampm":
                date.setHours(date.getHours() + diff * 12);
                break;
            case "minute":
                date.setMinutes(date.getMinutes() + diff);
                break;
            case "second":
                date.setSeconds(date.getSeconds() + diff);
                break;
            case "millisecond":
                date.setMilliseconds(date.getMilliseconds() + diff);
                break;
            case "week":
                date.setDate(date.getDate() + diff * 7);
                break;
        }
    }

    function getLastNode(node, direction) {
        var lastNode;

        do {
            lastNode = node;
            node = getNode(node[direction], direction);
        } while (node);

        return lastNode;
    }

    function selectRange(range, direction, toEnd) {
        if (!range.node) {
            return;
        }
        if (direction) {
            range.start = 0;
            range.end = "end";
            if (toEnd) {
                range.node = getLastNode(range.node, direction);
            } else {
                range.node = getNode(range.node[direction], direction) || range.node;
            }
        }
        setInputSelection(range.element, {
            start: range.start + range.node.offset,
            end: range.end == "end" ? range.node.offset + range.node.viewValue.length : range.end + range.node.offset
        });
    }

    function isStatic(node) {
        return node.token.type == "static" || node.token.type == "regex";
    }

    function closerNode(range, next, prev) {
        var offset = range.node.offset + range.start,
			disNext = next.offset - offset,
			disPrev = offset - (prev.offset + prev.viewValue.length);

        return disNext <= disPrev ? next : prev;
    }

    function createRange(element, nodes) {
        var prev, next, range;

        range = getRange(element, nodes);

        if (isStatic(range.node)) {
            next = getNode(range.node, "next");
            prev = getNode(range.node, "prev");

            if (!next && !prev) {
                range.node = nodes[0];
                range.end = 0;
            } else if (!next || !prev) {
                range.node = next || prev;
            } else {
                range.node = closerNode(range, next, prev);
            }
        }

        range.start = 0;
        range.end = "end";

        return range;
    }

    function getRange(element, nodes, node) {
        var selection = getInputSelection(element), i, range;
        for (i = 0; i < nodes.length; i++) {
            if (!range && nodes[i].offset + nodes[i].viewValue.length >= selection.start || i == nodes.length - 1) {
                range = {
                    element: element,
                    node: nodes[i],
                    start: selection.start - nodes[i].offset,
                    end: selection.start - nodes[i].offset
                };
                break;
            }
        }

        if (node && range.node.next == node && range.start + range.node.offset == range.node.next.offset) {
            range.node = range.node.next;
            range.start = range.end = 0;
        }

        return range;
    }

    function isRangeCollapse(range) {
        return range.start == range.end ||
			range.start == range.node.viewValue.length && range.end == "end";
    }

    function isRangeAtEnd(range) {
        var maxLength, length;
        if (!isRangeCollapse(range)) {
            return false;
        }
        maxLength = range.node.token.maxLength;
        length = range.node.viewValue.length;
        if (maxLength && length < maxLength) {
            return false;
        }
        return range.start == length;
    }

    function isPrintableKey(e) {
        var keyCode = e.charCode || e.keyCode;
        return keyCode >= 48 && keyCode <= 57 ||
			keyCode >= 65 && keyCode <= 90 ||
			keyCode >= 97 && keyCode <= 122;
    }

    function linkFunc(scope, element, attrs, ngModel) {
        var parser = datetime(attrs.datetime),
			modelParser = attrs.datetimeModel && datetime(attrs.datetimeModel),
			range = {
			    element: element,
			    node: getInitialNode(parser.nodes),
			    start: 0,
			    end: "end"
			},
			errorRange = {
			    element: element,
			    node: null,
			    start: 0,
			    end: 0
			};

        var validMin = function (value) {
            return ngModel.$isEmpty(value) || angular.isUndefined(attrs.min) || value >= new Date(attrs.min);
        };

        var validMax = function (value) {
            return ngModel.$isEmpty(value) || angular.isUndefined(attrs.max) || value <= new Date(attrs.max);
        };

        if (ngModel.$validators) {
            ngModel.$validators.min = validMin;
            ngModel.$validators.max = validMax;
        }

        attrs.$observe("min", function () {
            validMinMax(parser.getDate());
        });

        attrs.$observe("max", function () {
            validMinMax(parser.getDate());
        });

        ngModel.$render = function () {
            element.val(ngModel.$viewValue || "");
            if (doc.activeElement == element[0]) {
                selectRange(range);
            }
        };

        function validMinMax(date) {
            if (ngModel.$validate) {
                ngModel.$validate();
            } else {
                ngModel.$setValidity("min", validMin(date));
                ngModel.$setValidity("max", validMax(date));
            }
            return !ngModel.$error.min && !ngModel.$error.max;
        }

        ngModel.$parsers.push(function (viewValue) {
            // Handle empty string
            if (!viewValue && angular.isUndefined(attrs.required)) {
                // Reset range
                range.node = getInitialNode(parser.nodes);
                range.start = 0;
                range.end = "end";
                ngModel.$setValidity("datetime", true);
                return null;
            }

            try {
                parser.parse(viewValue);
            } catch (err) {
                $log.error(err);

                ngModel.$setValidity("datetime", false);

                if (err.code == "NUMBER_TOOSHORT" || err.code == "NUMBER_TOOSMALL" && err.match.length < err.node.token.maxLength) {
                    errorRange.node = err.node;
                    errorRange.start = 0;
                    errorRange.end = err.match.length;
                } else {
                    if (err.code == "LEADING_ZERO") {
                        viewValue = viewValue.substr(0, err.pos) + err.properValue + viewValue.substr(err.pos + err.match.length);
                        if (err.match.length >= err.node.token.maxLength) {
                            selectRange(range, "next");
                        } else {
                            range.start += err.properValue.length - err.match.length + 1;
                            range.end = range.start;
                        }
                    } else if (err.code == "SELECT_INCOMPLETE") {
                        parser.parseNode(range.node, err.selected);
                        viewValue = parser.getText();
                        range.start = err.match.length;
                        range.end = "end";
                    } else if (err.code == "INCONSISTENT_INPUT") {
                        viewValue = err.properText;
                        range.start++;
                        range.end = range.start;
                        // } else if (err.code == "NUMBER_TOOLARGE") {
                        // viewValue = viewValue.substr(0, err.pos) + err.properValue + viewValue.substr(err.pos + err.match.length);
                        // range.start = 0;
                        // range.end = "end";
                    } else {
                        viewValue = parser.getText();
                        range.start = 0;
                        range.end = "end";
                    }
                    scope.$evalAsync(function () {
                        if (viewValue == ngModel.$viewValue) {
                            throw "angular-datetime crashed!";
                        }
                        ngModel.$setViewValue(viewValue);
                        ngModel.$render();
                    });
                }

                return undefined;
            }

            ngModel.$setValidity("datetime", true);

            if (ngModel.$validate || validMinMax(parser.getDate())) {
                var date = parser.getDate();

                if (angular.isDefined(attrs.datetimeUtc)) {
                    date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
                }

                if (modelParser) {
                    return modelParser.setDate(date).getText();
                } else {
                    // Create new date to make Angular notice the difference.
                    return new Date(date.getTime());
                }
            }

            return undefined;
        });

        ngModel.$formatters.push(function (modelValue) {

            if (!modelValue) {
                ngModel.$setValidity("datetime", angular.isUndefined(attrs.required));
                return "";
            }

            ngModel.$setValidity("datetime", true);

            if (modelParser) {
                modelValue = modelParser.parse(modelValue).getDate();
            }

            if (angular.isDefined(attrs.datetimeUtc)) {
                modelValue = new Date(modelValue.getTime() + modelValue.getTimezoneOffset() * 60 * 1000);
            }

            return parser.setDate(modelValue).getText();
        });

        function addNodeValue(node, diff) {
            var date, viewValue;

            date = new Date(parser.date.getTime());
            addDate(date, node.token, diff);
            parser.setDate(date);
            viewValue = parser.getText();
            ngModel.$setViewValue(viewValue);

            range.start = 0;
            range.end = "end";
            ngModel.$render();

            scope.$apply();
        }

        var waitForClick;
        element.on("focus keydown keypress mousedown click", function (e) {
            switch (e.type) {
                case "mousedown":
                    waitForClick = true;
                    break;
                case "focus":
                    e.preventDefault();

                    // Init value on focus
                    if (!ngModel.$viewValue) {
                        if (angular.isDefined(attrs["default"])) {
                            parser.setDate(new Date(attrs["default"]));
                        }
                        ngModel.$setViewValue(parser.getText());
                        ngModel.$render();
                        scope.$apply();
                    }

                    if (!waitForClick) {
                        setTimeout(function () {
                            if (!ngModel.$error.datetime) {
                                selectRange(range);
                            } else {
                                selectRange(errorRange);
                            }
                        });
                    }
                    break;
                case "keydown":
                    switch (e.keyCode) {
                        case 37:
                            // Left
                            e.preventDefault();
                            if (!ngModel.$error.datetime) {
                                selectRange(range, "prev");
                            } else {
                                selectRange(errorRange);
                            }
                            break;
                        case 39:
                            // Right
                            e.preventDefault();
                            if (!ngModel.$error.datetime) {
                                selectRange(range, "next");
                            } else {
                                selectRange(errorRange);
                            }
                            break;
                        case 38:
                            // Up
                            e.preventDefault();
                            addNodeValue(range.node, 1);
                            break;
                        case 40:
                            // Down
                            e.preventDefault();
                            addNodeValue(range.node, -1);
                            break;
                        case 36:
                            // Home
                            e.preventDefault();
                            if (ngModel.$error.datetime) {
                                selectRange(errorRange);
                            } else {
                                selectRange(range, "prev", true);
                            }
                            break;
                        case 35:
                            // End
                            e.preventDefault();
                            if (ngModel.$error.datetime) {
                                selectRange(errorRange);
                            } else {
                                selectRange(range, "next", true);
                            }
                            break;
                    }
                    break;

                case "click":
                    e.preventDefault();
                    waitForClick = false;
                    if (!ngModel.$error.datetime) {
                        range = createRange(element, parser.nodes);
                        selectRange(range);
                    } else {
                        selectRange(errorRange);
                    }
                    break;

                case "keypress":
                    if (isPrintableKey(e)) {
                        setTimeout(function () {
                            range = getRange(element, parser.nodes, range.node);
                            if (isRangeAtEnd(range)) {
                                range.node = getNode(range.node.next) || range.node;
                                range.start = 0;
                                range.end = "end";
                                selectRange(range);
                            }
                        });
                    }
                    break;

            }
        });

    }

    return {
        restrict: "A",
        require: "?ngModel",
        link: linkFunc
    };
});
angular.module("datetime").factory("datetime", function ($locale) {
    // Fetch date and time formats from $locale service
    var formats = $locale.DATETIME_FORMATS;
    // Valid format tokens. 1=sss, 2=''
    var tokenRE = /yyyy|yy|y|M{1,4}|dd?|EEEE?|HH?|hh?|mm?|ss?|([.,])sss|a|Z|ww|w|'(([^']+|'')*)'/g;
    // Token definition
    var definedTokens = {
        "y": {
            minLength: 1,
            maxLength: 4,
            min: 1,
            max: 9999,
            name: "year",
            type: "number"
        },
        "yy": {
            minLength: 2,
            maxLength: 2,
            min: 1,
            max: 99,
            name: "year",
            type: "number"
        },
        "yyyy": {
            minLength: 4,
            maxLength: 4,
            min: 1,
            max: 9999,
            name: "year",
            type: "number"
        },
        "MMMM": {
            name: "month",
            type: "select",
            select: formats.MONTH
        },
        "MMM": {
            name: "month",
            type: "select",
            select: formats.SHORTMONTH
        },
        "MM": {
            minLength: 2,
            maxLength: 2,
            min: 1,
            max: 12,
            name: "month",
            type: "number"
        },
        "M": {
            minLength: 1,
            maxLength: 2,
            min: 1,
            max: 12,
            name: "month",
            type: "number"
        },
        "dd": {
            minLength: 2,
            maxLength: 2,
            min: 1,
            max: 31,
            name: "date",
            type: "number"
        },
        "d": {
            minLength: 1,
            maxLength: 2,
            min: 1,
            max: 31,
            name: "date",
            type: "number"
        },
        "EEEE": {
            name: "day",
            type: "select",
            select: fixDay(formats.DAY)
        },
        "EEE": {
            name: "day",
            type: "select",
            select: fixDay(formats.SHORTDAY)
        },
        "HH": {
            minLength: 2,
            maxLength: 2,
            min: 0,
            max: 23,
            name: "hour",
            type: "number"
        },
        "H": {
            minLength: 1,
            maxLength: 2,
            min: 0,
            max: 23,
            name: "hour",
            type: "number"
        },
        "hh": {
            minLength: 2,
            maxLength: 2,
            min: 1,
            max: 12,
            name: "hour12",
            type: "number"
        },
        "h": {
            minLength: 1,
            maxLength: 2,
            min: 1,
            max: 12,
            name: "hour12",
            type: "number"
        },
        "mm": {
            minLength: 2,
            maxLength: 2,
            min: 0,
            max: 59,
            name: "minute",
            type: "number"
        },
        "m": {
            minLength: 1,
            maxLength: 2,
            min: 0,
            max: 59,
            name: "minute",
            type: "number"
        },
        "ss": {
            minLength: 2,
            maxLength: 2,
            min: 0,
            max: 59,
            name: "second",
            type: "number"
        },
        "s": {
            minLength: 1,
            maxLength: 2,
            min: 0,
            max: 59,
            name: "second",
            type: "number"
        },
        "milliPrefix": {
            name: "milliPrefix",
            type: "regex",
            regex: /[,.]/
        },
        "sss": {
            minLength: 3,
            maxLength: 3,
            min: 0,
            max: 999,
            name: "millisecond",
            type: "number"
        },
        "a": {
            name: "ampm",
            type: "select",
            select: formats.AMPMS
        },
        "ww": {
            minLength: 2,
            maxLength: 2,
            min: 0,
            max: 53,
            name: "week",
            type: "number"
        },
        "w": {
            minLength: 1,
            maxLength: 2,
            min: 0,
            max: 53,
            name: "week",
            type: "number"
        },
        "Z": {
            name: "timezone",
            type: "regex",
            regex: /[+-]\d{4}/
        },
        "string": {
            name: "string",
            type: "static"
        }
    };

    // Push Sunday to the end
    function fixDay(days) {
        var s = [], i;
        for (i = 1; i < days.length; i++) {
            s.push(days[i]);
        }
        s.push(days[0]);
        return s;
    }

    // Use localizable formats
    function getFormat(format) {
        return formats[format] || format;
    }

    function createNode(token, value) {
        return {
            token: definedTokens[token],
            value: value,
            viewValue: value || "",
            offset: 0
        };
    }

    // Parse format to nodes
    function createNodes(format) {
        var nodes = [],
			pos = 0,
			match;

        while ((match = tokenRE.exec(format))) {

            if (match.index > pos) {
                nodes.push(createNode("string", format.substring(pos, match.index)));
                pos = match.index;
            }

            if (match.index == pos) {
                if (match[1]) {
                    nodes.push(createNode("string", match[1]));
                    nodes.push(createNode("sss"));
                } else if (match[2]) {
                    nodes.push(createNode("string", match[2].replace("''", "'")));
                } else {
                    nodes.push(createNode(match[0]));
                }
                pos = tokenRE.lastIndex;
            }
        }

        if (pos < format.length) {
            nodes.push(createNode("string", format.substring(pos)));
        }

        // Build relationship between nodes
        var i;
        for (i = 0; i < nodes.length; i++) {
            nodes[i].next = nodes[i + 1] || null;
            nodes[i].prev = nodes[i - 1] || null;
            nodes[i].id = i;
        }

        return nodes;
    }

    function getInteger(str, pos) {
        str = str.substring(pos);
        var match = str.match(/^\d+/);
        return match && match[0];
    }

    function getMatch(str, pos, pattern) {
        var i = 0,
			strQ = str.toUpperCase(),
			patternQ = pattern.toUpperCase();

        while (strQ[pos + i] && strQ[pos + i] == patternQ[i]) {
            i++;
        }

        return str.substr(pos, i);
    }

    function getWeek(date) {
        var yearStart = new Date(date.getFullYear(), 0, 1);

        var weekStart = new Date(yearStart.getTime());

        if (weekStart.getDay() > 4) {
            weekStart.setDate(weekStart.getDate() + (1 - weekStart.getDay()) + 7);
        } else {
            weekStart.setDate(weekStart.getDate() + (1 - weekStart.getDay()));
        }
        var diff = date.getTime() - weekStart.getTime();

        return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    }

    function num2str(num, minLength, maxLength) {
        var i;
        num = "" + num;
        if (num.length > maxLength) {
            num = num.substr(num.length - maxLength);
        } else if (num.length < minLength) {
            for (i = num.length; i < minLength; i++) {
                num = "0" + num;
            }
        }
        return num;
    }

    function setText(node, date, token) {
        switch (token.name) {
            case "year":
                node.value = date.getFullYear();
                break;
            case "month":
                node.value = date.getMonth() + 1;
                break;
            case "date":
                node.value = date.getDate();
                break;
            case "day":
                node.value = date.getDay() || 7;
                break;
            case "hour":
                node.value = date.getHours();
                break;
            case "hour12":
                node.value = date.getHours() % 12 || 12;
                break;
            case "ampm":
                node.value = date.getHours() < 12 ? 1 : 2;
                break;
            case "minute":
                node.value = date.getMinutes();
                break;
            case "second":
                node.value = date.getSeconds();
                break;
            case "millisecond":
                node.value = date.getMilliseconds();
                break;
            case "week":
                node.value = getWeek(date);
                break;
            case "timezone":
                node.value = (date.getTimezoneOffset() > 0 ? "-" : "+") + num2str(Math.abs(date.getTimezoneOffset() / 60), 2, 2) + "00";
                break;
        }

        if (node.value < 0) {
            node.value = 0;
        }

        switch (token.type) {
            case "number":
                node.viewValue = num2str(node.value, token.minLength, token.maxLength);
                break;
            case "select":
                node.viewValue = token.select[node.value - 1];
                break;
            default:
                node.viewValue = node.value + "";
        }
    }

    // set the proper date value matching the weekday
    function setDay(date, day) {
        // we don't want to change month when changing date
        var month = date.getMonth(),
			diff = day - (date.getDay() || 7);
        // move to correct date
        date.setDate(date.getDate() + diff);
        // check month
        if (date.getMonth() != month) {
            if (diff > 0) {
                date.setDate(date.getDate() - 7);
            } else {
                date.setDate(date.getDate() + 7);
            }
        }
    }

    function setHour12(date, hour) {
        hour = hour % 12;
        if (date.getHours() >= 12) {
            hour += 12;
        }
        date.setHours(hour);
    }

    function setAmpm(date, ampm) {
        var hour = date.getHours();
        if ((hour < 12) == (ampm > 1)) {
            date.setHours((hour + 12) % 24);
        }
    }

    function setDate(date, value, token) {
        switch (token.name) {
            case "year":
                date.setFullYear(value);
                break;
            case "month":
                date.setMonth(value - 1);
                break;
            case "date":
                date.setDate(value);
                break;
            case "day":
                setDay(date, value);
                break;
            case "hour":
                date.setHours(value);
                break;
            case "hour12":
                setHour12(date, value);
                break;
            case "ampm":
                setAmpm(date, value);
                break;
            case "minute":
                date.setMinutes(value);
                break;
            case "second":
                date.setSeconds(value);
                break;
            case "millisecond":
                date.setMilliseconds(value);
                break;
            case "week":
                date.setDate(date.getDate() + (value - getWeek(date)) * 7);
                break;
        }

        if (date.getFullYear() < 0) {
            date.setFullYear(0);
        }
    }

    // Re-calculate offset
    function calcOffset(nodes) {
        var i, offset = 0;
        for (i = 0; i < nodes.length; i++) {
            nodes[i].offset = offset;
            offset += nodes[i].viewValue.length;
        }
    }

    function parseNode(node, text, pos) {
        var p = node, m, match, value, j;
        switch (p.token.type) {
            case "static":
                if (text.lastIndexOf(p.value, pos) != pos) {
                    throw {
                        code: "TEXT_MISMATCH",
                        message: "Pattern value mismatch",
                        text: text,
                        node: p,
                        pos: pos
                    };
                }
                break;

            case "number":
                // Fail when meeting .sss
                value = getInteger(text, pos);
                if (value == null) {
                    throw {
                        code: "NUMBER_MISMATCH",
                        message: "Invalid number",
                        text: text,
                        node: p,
                        pos: pos
                    };
                }
                if (value.length < p.token.minLength) {
                    throw {
                        code: "NUMBER_TOOSHORT",
                        message: "The length of number is too short",
                        text: text,
                        node: p,
                        pos: pos,
                        match: value
                    };
                }

                if (value.length > p.token.maxLength) {
                    value = value.substr(0, p.token.maxLength);
                }

                if (+value < p.token.min) {
                    throw {
                        code: "NUMBER_TOOSMALL",
                        message: "The number is too small",
                        text: text,
                        node: p,
                        pos: pos,
                        match: value
                    };
                }

                if (value.length > p.token.minLength && value[0] == "0") {
                    throw {
                        code: "LEADING_ZERO",
                        message: "The number has too many leading zero",
                        text: text,
                        node: p,
                        pos: pos,
                        match: value,
                        properValue: num2str(+value, p.token.minLength, p.token.maxLength)
                    };
                }

                // if (+value > p.token.max) {
                // throw {
                // code: "NUMBER_TOOLARGE",
                // message: "The number is too large",
                // text: text,
                // node: p,
                // pos: pos,
                // match: value,
                // properValue: num2str(p.token.max, p.token.minLength, p.token.maxLength)
                // };
                // }

                p.value = +value;
                p.viewValue = value;
                break;

            case "select":
                match = "";
                for (j = 0; j < p.token.select.length; j++) {
                    m = getMatch(text, pos, p.token.select[j]);
                    if (m && m.length > match.length) {
                        value = j;
                        match = m;
                    }
                }
                if (!match) {
                    throw {
                        code: "SELECT_MISMATCH",
                        message: "Invalid select",
                        text: text,
                        node: p,
                        pos: pos
                    };
                }

                if (match != p.token.select[value]) {
                    throw {
                        code: "SELECT_INCOMPLETE",
                        message: "Incomplete select",
                        text: text,
                        node: p,
                        pos: pos,
                        match: match,
                        selected: p.token.select[value]
                    };
                }

                p.value = value + 1;
                p.viewValue = match;
                break;

            case "regex":
                m = p.regex.exec(text.substr(pos));
                if (!m || m.index != 0) {
                    throw {
                        code: "REGEX_MISMATCH",
                        message: "Regex doesn't match",
                        text: text,
                        node: p,
                        pos: pos
                    };
                }
                p.value = m[0];
                p.viewValue = m[0];
                break;
        }
    }

    // Main parsing loop. Loop through nodes, parse text, update date model.
    function parseLoop(nodes, text, date) {
        var i, pos, errorBuff, baseDate, compareDate;

        pos = 0;
        baseDate = new Date(date.getTime());

        for (i = 0; i < nodes.length; i++) {
            try {
                parseNode(nodes[i], text, pos);
                pos += nodes[i].viewValue.length;

                compareDate = new Date(baseDate.getTime());
                setDate(compareDate, nodes[i].value, nodes[i].token);
                if (compareDate.getTime() != baseDate.getTime()) {
                    setDate(date, nodes[i].value, nodes[i].token);
                }
            } catch (err) {
                if (err.code == "NUMBER_TOOSHORT" || err.code == "NUMBER_TOOSMALL" || err.code == "LEADING_ZERO") {
                    errorBuff = err;
                    pos += err.match.length;
                } else {
                    throw err;
                }
            }
        }

        if (text.length > pos) {
            throw {
                code: "TEXT_TOOLONG",
                message: "Text is too long",
                text: text,
                pos: pos
            };
        }

        if (errorBuff) {
            throw errorBuff;
        }
    }

    function createParser(format) {

        format = getFormat(format);

        var nodes = createNodes(format);

        var parser = {
            parse: function (text) {
                var oldDate = parser.date,
					date = new Date(oldDate.getTime()),
					oldText = parser.getText(),
					newText;

                if (!text) {
                    throw {
                        code: "EMPTY",
                        message: "The input is empty",
                        oldText: oldText
                    };
                }

                try {
                    parseLoop(parser.nodes, text, date);
                    parser.setDate(date);
                    newText = parser.getText();
                    if (text != newText) {
                        throw {
                            code: "INCONSISTENT_INPUT",
                            message: "Successfully parsed but the output text doesn't match the input",
                            text: text,
                            oldText: oldText,
                            properText: newText
                        };
                    }
                } catch (err) {
                    // Should we reset date object if failed to parse?
                    parser.setDate(oldDate);
                    throw err;
                }
                return parser;
            },
            parseNode: function (node, text) {
                var date = new Date(parser.date.getTime());
                try {
                    parseNode(node, text, 0);
                } catch (err) {
                    parser.setDate(parser.date);
                    throw err;
                }
                setDate(date, node.value, node.token);
                parser.setDate(date);
                return parser;
            },
            setDate: function (date) {
                parser.date = date;

                var i, node;
                for (i = 0; i < parser.nodes.length; i++) {
                    node = parser.nodes[i];

                    setText(node, date, node.token);
                }
                calcOffset(parser.nodes);
                return parser;
            },
            getDate: function () {
                return parser.date;
            },
            getText: function () {
                var i, text = "";
                for (i = 0; i < parser.nodes.length; i++) {
                    text += parser.nodes[i].viewValue;
                }
                return text;
            },
            date: null,
            format: format,
            nodes: nodes,
            error: null
        };

        parser.setDate(new Date());

        return parser;
    }

    return createParser;
});



angular.module("ApiServices", [])
    .service("$marcou-navigation", ["$http", function ($http) {
        return {
            GetTabsByParentId: function (id, complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Home/GetTabs?v=' + General.randomVersion(),
                        data: {},
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            },
            LoadContentWell: function (url, complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'GET',
                        url: url + '?v=' + General.randomVersion(),
                        data: {}
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            }
        }
    }])
    .service("$marcou-authentication", ["$http", function ($http) {
        return {
            AuthenticateUser: function (username, password, rememberMe, complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Login/Authenticate?v=' + General.randomVersion(),
                        data: JSON.stringify({
                            username: username,
                            password: password,
                            rememberMe: rememberMe
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            }
        }

    }])
    .service("$marcou-equipment", ["$http", function ($http) {
        return {
            DeleteAttachment: function (id, complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Home/DeleteAttachment?v=' + General.randomVersion(),
                        data: JSON.stringify({ id: id }),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            },
            GetAttachmentsForEquipment: function (id, complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Home/GetAttachmentsForEquipment?v=' + General.randomVersion(),
                        data: JSON.stringify({ id: id }),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            },
            LoadLayouts: function(complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Home/GetLayouts?v=' + General.randomVersion(),
                        data: {},
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            },
            LoadEquipmentData: function (complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Home/LoadEquipmentData?v=' + General.randomVersion(),
                        data: {},
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            }
            , GetEquipmentDataById: function (id, complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Home/GetEquipmentDataById?v=' + General.randomVersion(),
                        data: JSON.stringify({ id: id }),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            }
            , DeleteEquipmentDataById: function (id, complete, fail) {
                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Home/DeleteEquipmentDataById?v=' + General.randomVersion(),
                        data: JSON.stringify({ id: id }),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            }, SaveEquipmentData: function (data, complete, fail) {

                try {
                    WaitOverlayNew.show();
                    var xhr = $http({
                        method: 'POST',
                        url: '/Home/SaveEquipmentData?v=' + General.randomVersion(),
                        data: { data: JSON.stringify(data) },
                        headers: { 'Content-Type': 'application/json' }
                    });

                    xhr.success(function (data, status, headers, config) {
                        if (complete) {
                            complete(data);
                        }
                        WaitOverlayNew.hide();
                    })
                    .error(function (data, status, headers, config) {
                        if (fail) {
                            fail(status, data);
                        }
                        WaitOverlayNew.hide();
                    });
                } catch (e) {
                    WaitOverlayNew.hide();
                }
            }
        }

    }]);
var myApp = angular.module("MarcouApp", ["ngCookies", "ApiServices", "datetime"]);


myApp.controller("MarcouLoginController", ["$scope", "$filter", "$timeout", "$marcou-authentication", function ($scope, $filter, $timeout, dataService) {
    $scope.userInfo = {
        username: '',
        password: '',
        rememberMe: false
    }
    $scope.errorMessage = null;
    $scope.toggleRememberMe = function () {
        $scope.userInfo.rememberMe = !$scope.userInfo.rememberMe;
    }
    $scope.authenticateUser = function () {
        dataService.AuthenticateUser($scope.userInfo.username, $scope.userInfo.password, $scope.userInfo.rememberMe,
        function (result) {

            if (result.Successful) {

                $scope.errorMessage = null;
                window.location = "/";
            } else {
                $scope.errorMessage = result.ErrorMessage;
            }

        },
        function (result) {
        });
    }

    //alert('loaded');
}]);
myApp.controller("MarcouNavigationController", ["$scope", "$filter", "$http", "$cookies", "$cookieStore", "$compile", "$marcou-navigation", function ($scope, $filter, $http, $cookies, $cookieStore, $compile, navigationService) {

    $scope.tabs = [];
    $scope.currentTab = null;
    $scope.init = function () {
        OpenDialog.init();
        WaitOverlayNew.init();
        navigationService.GetTabsByParentId(null, function (result) {
            $scope.tabs = result;

            $scope.currentTab = $cookies.get("currentNav");
            if ($scope.currentTab == null || $scope.currentTab == '') {
                $scope.currentTab = result[0];
                $cookies.put("currentNav", result[0].Id);
            } else {
                //grab the latest value for the tab as it is a different object now
                for (var i = 0; i < $scope.tabs.length; i++) {
                    if ($scope.tabs[i].Id == $scope.currentTab) {
                        $scope.currentTab = $scope.tabs[i];
                        break;
                    }
                }
            }
            $scope.navigateTo($scope.currentTab);
        }, function (result) { });
    }
    $scope.logout = function () {
        window.location = "/Logout";
    }
    $scope.navigateTo = function (tab) {

        $cookies.put("currentNav", tab.Id);
        $scope.currentTab = tab;
        navigationService.LoadContentWell(tab.Url, function (result) {
            var el = angular.element("#MainContentWell").html(result);
            $compile(el)($scope);
        },
        function (result) {

        });
    }
    $scope.init();

}]);
myApp.controller("MarcouEquipmentController", ["$scope", "$timeout", "$filter", "$http", "$cookies", "$cookieStore", "$compile", "$marcou-equipment", "datetime", function ($scope, $timeout, $filter, $http, $cookies, $cookieStore, $compile, apiService, datetime) {

    $scope.equipmentTypeId = 0;
    $scope.plantFilterType = 0;
    $scope.filterByText = '';
    $scope.mainData = 0;
    $scope.showInactiveEquipment = false;
    $scope.filteredEquipmentList = [];
    $scope.equipmentList = [];
    $scope.selectedRow = null;
    $scope.isDirty = false;
    $scope.scrollToId = null;
    $scope.currentLowerTab = 1;
    $scope.layouts = null;

    $scope.navigateLowerTab = function (tab) {
        $scope.currentLowerTab = tab.Id;
    }


    $scope.lowerNavTabs = null;

    $scope.attachmentLocation = 1;
    $scope.uploadFile = function (attachmentLocation) {
        //debugger;
        $scope.attachmentLocation = attachmentLocation;
        var addbtnBrowse = '<div class="bsButton" id="browseDialogue"><span id="spBrowse">Browse</span></div>';
        var dialogContent =
            '<div id="showUploadDialogue" class="divRow">' +
                '<form id="ajaxUploadForm" action="/BuilderSetup/UploadFile" method="post" enctype="multipart/form-data">' +
                    '<input type="file" name="file" id="fileUpload" style="opacity:0; display:none;" />  ' +
                    '<label><span>Please Choose an image to upload</span></label>' +
                    '<div class="fakefile divRowCell80">' +
                        '<input type="text" id="fakeFile" readonly="readonly" />' +
                    '</div>' +
                    '<div class="fakefile divRowCell20">' +
                        addbtnBrowse +
                    '</div>' +
                '</form>' +
            '</div>';

        var lb = new LightBox();
        lb.HeaderContent('Upload Image', 'BuilderSetup_LightBoxHeaderText', 'icon-save');
        lb.Content(dialogContent);
        lb.ButtonValuesYes($scope.Upload);
        lb.ShowCancel();
        lb.ButtonValuesCancel('', 'Cancel', 'BuilderSetup_LightBoxCancelButton');
        lb.Display();

        if (!$("body").hasClass("initHasRunForBuilderSetup")) {
            $("body").delegate('#fakeFile', 'click', function () {
                $("#fileUpload").trigger('click');
            });
            $("body").delegate('input[type=file]', 'change', function (e) {
                $in = $('input[type=file]');
                $("#fakeFile").val($in.val().replace(/C:\\fakepath\\/i, ''));
            });
            $("body").delegate('#browseDialogue', 'click', function () {
                $("#fileUpload").trigger('click');
            });
            $("body").addClass("initHasRunForBuilderSetup");
        }
    }
    $scope.deleteAttachment = function (location) {
        var lb = new LightBox('<span>Are you sure you want to delete this image?</span>');
        lb.Width('lb60');
        lb.ShowCancel();
        lb.ButtonColors('', 'Info');
        lb.HeaderContent('Deleting image verification');
        lb.ButtonValuesYes(function () {
            apiService.DeleteAttachment($scope["currentImg" + location], function (r1) {
                if (r1.Successful) {
                    $scope["currentImg" + location] = null;

                    apiService.GetAttachmentsForEquipment($scope.selectedRow.EquipmentData.Id, function (result) {

                        if (result.Successful) {

                            $scope.selectedRow.Attachments = result.Data;


                            for (var v = 0; v < $scope.selectedRow.Attachments.length; v++) {
                                if ($scope["currentImg" + $scope.selectedRow.Attachments[v].AttachmentTypeId] == null) {
                                    $scope["currentImg" + $scope.selectedRow.Attachments[v].AttachmentTypeId] = $scope.selectedRow.Attachments[v].Id;
                                }
                            }



                        }
                    }, function () { });
                }
            }, function () { });
            lb.Close();
        });
        lb.Display();



    }
    $scope.endsWith = function (suffix) {
        return suffix.indexOf(suffix, this.length - suffix.length) !== -1;
    };
    $scope.Upload = function () {
        //debugger;
        var fn = $('#fakeFile').val().toLowerCase();
        if (!$scope.endsWith(".gif") &&
            !$scope.endsWith(".jpg") &&
            !$scope.endsWith(".jpeg") &&
            !$scope.endsWith(".png") &&
            !$scope.endsWith(".tiff")) {

            WaitOverlayNew.hide();
            var lblErr = new LightBox("Only files currently supported are .gif, .jpg, .png, .tiff");
            lblErr.Display();

            return;
        }

        WaitOverlayNew.show();
        var maxSize = 10000000; //10mb
        var fileSize = $('#fakeFile').val() != "" ? $('#fileUpload')[0].files[0].size : 0;
        if (fileSize == 0) {
            WaitOverlayNew.hide();
            var lblErr = new LightBox("Please select a file before uploading.");
            lblErr.Display();
            lblErr.DoNotClose();
            return;
        } else if (fileSize > maxSize) {
            WaitOverlayNew.hide();
            var lblErr = new LightBox("Maximum file size is 2mb.");
            lblErr.Display();
            lblErr.DoNotClose();
            return;
        } else {
            var iframe = $('<iframe name="postiframe" id="postiframe" style="display: none" />');
            $("body").append(iframe);
            var form = $('#ajaxUploadForm');
            form.attr("action", "/Home/UploadFile?equipmentId=" + $scope.selectedRow.EquipmentData.Id + "&location=" + $scope.attachmentLocation);
            form.attr("method", "post");
            form.attr("enctype", "multipart/form-data");
            form.attr("encoding", "multipart/form-data");
            form.attr("target", "postiframe");
            form.attr("file", $('#fileUpload').val());
            form.submit();
            $("#postiframe").load(function () {
                var retValue = $("#postiframe")[0].contentDocument.body.innerHTML;

                if (retValue == "Error") {
                    WaitOverlayNew.hide();
                    new LightBox("An error occured while uploading your attachment. Try again or contact technical support.").Display();
                } else {
                    apiService.GetAttachmentsForEquipment($scope.selectedRow.EquipmentData.Id, function (result) {

                        if (result.Successful) {

                            $scope.selectedRow.Attachments = result.Data;


                            for (var v = 0; v < $scope.selectedRow.Attachments.length; v++) {
                                if ($scope["currentImg" + $scope.selectedRow.Attachments[v].AttachmentTypeId] == null) {
                                    $scope["currentImg" + $scope.selectedRow.Attachments[v].AttachmentTypeId] = $scope.selectedRow.Attachments[v].Id;
                                }
                            }



                        }
                    }, function () { });
                    //$scope.currentBuilder.LogoUrl = "../../../Attachments/" + $("#postiframe")[0].contentDocument.body.innerHTML;
                    //$scope.SaveBuilder(true);
                    WaitOverlayNew.hide();
                }

                $("#postiframe").remove();
            });
        }
    };

    $scope.saveRecord = function () {
        if ($scope.isDirty && $scope.selectedRow != null) {
            apiService.SaveEquipmentData($scope.selectedRow, function (result) {
                if (result.Successful) {
                    $scope.scrollToId = result.Data;
                    $scope.LoadEquipment();
                    $scope.isDirty = false;
                } else {
                    var lb = new LightBox('<span>You have unsaved changes. By clicking OK you will lose your edits. Or click Cancel to resume editing.</span>');
                    lb.Width('lb60');
                    lb.ShowCancel();
                    lb.ButtonColors('', 'Info');
                    lb.HeaderContent('Unsaved Changes');
                    lb.ButtonValuesYes(function () {
                        $scope.isDirty = false;
                        lb.SkipBefore();
                        lb.Close();
                    });
                    lb.Display();
                }

            }, function (result) {

            });
        }
    }
    $scope.LightBox = null;
    $scope.promptSaveBeforeAction = function (func) {
        
        if ($scope.isDirty) {

            var lb = new LightBox('<span>You have unsaved changes. By clicking OK you will lose your edits. Or click Cancel to resume editing.</span>');
            lb.Width('lb60');
            lb.ShowCancel();
            lb.ButtonColors('', 'Info');
            lb.HeaderContent('Unsaved Changes');
            lb.ButtonValuesYes(function () {
                $scope.isDirty = false;
                lb.SkipBefore();
                lb.Close();
                if (func != null) {
                    func();
                }
            });

            lb.Display();
        } else {
            if (func != null) {
                func();
            }
        }
    }
    $scope.newRecord = function () {
        $scope.promptSaveBeforeAction(function () {
            apiService.GetEquipmentDataById(0, function (result) {
                if (result.Successful) {
                    $scope.selectedRow = result.Data;
                    $scope.isDirty = false;
                } else {
                    $scope.selectedRow = null;
                    $scope.isDirty = false;
                }
            }, function (result) {
                $scope.selectedRow = null;
                $scope.isDirty = false;
            });
        });


    }
    $scope.deleteRecord = function () {
        $scope.promptSaveBeforeAction(function () {
            if ($scope.selectedRow != null) {
                apiService.DeleteEquipmentDataById($scope.selectedRow.EquipmentData.Id, function (result) {
                    if (result.Successful) {
                        $scope.isDirty = false;
                        $scope.selectedRow = null;
                        $scope.LoadEquipment();
                    }
                }, function (result) {
                    $scope.selectedRow = null;
                    $scope.isDirty = false;
                });
            }
        });
    }
    $scope.printRecord = function () {

    }
    $scope.browsNextImage = function (location) {
        //debugger;
        var list = [];
        for (var v = 0; v < $scope.selectedRow.Attachments.length; v++) {
            if ($scope.selectedRow.Attachments[v].AttachmentTypeId == location) {
                list.push($scope.selectedRow.Attachments[v]);
            }
        }
        var value = $scope["currentImg" + location];

        for (var v = 0; v < list.length; v++) {
            if (list[v].Id == value) {
                //we have our current node, now to figure out what to do from here.
                if (v < list.length - 1) {
                    $scope["currentImg" + location] = list[v + 1].Id;

                } else {
                    $scope["currentImg" + location] = list[0].Id;
                }
                break;
            }
        }

    }

    $scope.browsPreviousImage = function (location) {

        var list = [];
        for (var v = 0; v < $scope.selectedRow.Attachments.length; v++) {
            if ($scope.selectedRow.Attachments[v].AttachmentTypeId == location) {
                list.push($scope.selectedRow.Attachments[v]);
            }
        }
        var value = $scope["currentImg" + location];

        for (var v = 0; v < list.length; v++) {
            if (list[v].Id == value) {
                //we have our current node, now to figure out what to do from here.
                if (v == 0) {
                    $scope["currentImg" + location] = list[list.length - 1].Id;

                } else {
                    $scope["currentImg" + location] = list[v - 1].Id;
                }
                break;
            }
        }

    }
    $scope.getCurrentImageModelId = function (id) {
        return $scope["currentImg" + id];
    }
    $scope.ToggleServiceEquipmentOnly = function () {
        $scope.promptSaveBeforeAction(function () {
            $scope.showInactiveEquipment = !$scope.showInactiveEquipment;
            $scope.FilterEquipment();
            //$scope.isDirty = false;
        });
    }
    function padStr(i) {
        return (i < 10) ? "0" + i : "" + i;
    }
    $scope.generateLayout = function()
    {
        var html = '';
        for (var i = 0; i < $scope.lowerNavTabs.length; i++) {
            var loc = $scope.lowerNavTabs[i];
            html += '<div class="divRow" ng-class="{\'noShow\':currentLowerTab != ' + $scope.lowerNavTabs[i].Id + '}">';
            html += '<div class="divRowCell50">';
            for (var j = 0; j < loc.Groups.length; j++) {
                var g = loc.Groups[j];
                for (var k = 0; k < g.Fields.length; k++) {
                    var f = g.Fields[k];


                    html += '<div class="divColumnMiddle">';
                    html += '   <label for="' + f.DomId + '">' + f.Label + ':</label>';
                    if (f.InputType == 1) {
                        html += '   <input id="' + f.DomId + '" type="text" ' +
                        (f.Options != null && f.Options != '' ? 'ng-options="' + f.Options + '"' : '') +
                        (f.Model != null && f.Model != '' ? " ng-model=\"" + f.Model + "\" " : '') +
                        (f.OnChange != null && f.OnChange != '' ? " ng-change=\"" + f.OnChange + "\" " : '') +
                        (f.NgClass != null && f.NgClass != '' ? " ng-class=\"" + f.NgClass + "\" " : '');
                        html += '/>';

                    }
                    else if (f.InputType == 2) {
                        html += '   <select id="' + f.DomId + '" ' +
                         (f.Options != null && f.Options != '' ? 'ng-options="' + f.Options + '"' : '') +
                         (f.Model != null && f.Model != '' ? " ng-model=\"" + f.Model + "\" " : '') +
                         (f.OnChange != null && f.OnChange != '' ? " ng-change=\"" + f.OnChange + "\" " : '') +
                         (f.NgClass != null && f.NgClass != '' ? " ng-class=\"" + f.NgClass + "\" " : '');
                        html += '></select>';
                    }


                    html += '</div>';

                }

                for (var l = 0; l < g.SubGroups.length; l++) {
                    var sg = g.SubGroups[l];
                    html += '<div class="divRow" style="margin-top: 6px;"' +
                        (sg.NgClass != null && sg.NgClass != '' ? "ng-class=\"" + sg.NgClass + "\" " : '') + '>';

                    html += '<div style="padding: 7px; border: #000 solid 1px;" ' + (sg.CssClass != null && sg.CssClass != '' ? "class=\"" + sg.CssClass + "\" " : '') + '>';

                    for (var sgf = 0; sgf < sg.Fields.length; sgf++) {
                        var f = sg.Fields[sgf];
                        html += '<div class="divColumnMiddle"><label for="' + f.DomId + '">' + f.Label + ':</label>';
                        if (f.InputType == 1) {
                            html += '   <input id="' + f.DomId + '" type="text" ' +
                            (f.Options != null && f.Options != '' ? 'ng-options="' + f.Options + '"' : '') +
                            (f.Model != null && f.Model != '' ? " ng-model=\"" + f.Model + "\" " : '') +
                            (f.OnChange != null && f.OnChange != '' ? " ng-change=\"" + f.OnChange + "\" " : '') +
                            (f.NgClass != null && f.NgClass != '' ? " ng-class=\"" + f.NgClass + "\" " : '');
                            html += '/>';

                        }
                        else if (f.InputType == 2) {
                            html += '   <select id="' + f.DomId + '" ' +
                             (f.Options != null && f.Options != '' ? 'ng-options="' + f.Options + '"' : '') +
                             (f.Model != null && f.Model != '' ? " ng-model=\"" + f.Model + "\" " : '') +
                             (f.OnChange != null && f.OnChange != '' ? " ng-change=\"" + f.OnChange + "\" " : '') +
                             (f.NgClass != null && f.NgClass != '' ? " ng-class=\"" + f.NgClass + "\" " : '');
                            html += '></select>';
                        }
                        html += '</div>';
                    }
                    html += '</div>';
                    html += '</div>';
                }


            }
            html += '</div>';



            //attachments

            html += '<div class="divRowCell50">';
            html += '<div class="divFullSection" ng-class="{\'noShow\': (selectedRow == null || selectedRow.EquipmentData.Id == ' + loc.Id + ') }">';
            html += '<h4>Attachments</h4><div style="clear: both;"></div><div class="divColumns" style=""><ul class="bsPagination">';

            html += '<li ng-repeat="attachment in selectedRow.Attachments | filter:{AttachmentTypeId: ' + loc.Id + '}" ng-class="{\'noShow\': attachment.Id != getCurrentImageModelId(' + loc.Id + ') }"><div class="divColumns"><a href="/Attachments/{{attachment.Filename}}" target="_blank"><img src="/Attachments/{{attachment.Filename}}" style="width: auto; max-width: 100%; height: auto;"/></a></div><div style="clear: both;"></div></li>';

            html += '</ul></div>';

            html += '<div class="divRow"></div>';

            html += '<div class="divRow" style="margin-top: 6px;"><div class="divRowCell50"><div class="bsButton left" ng-click="browsPreviousImage(' + loc.Id + ')"><<</div></div><div class="divRowCell50"><div class="bsButton right" ng-click="browsNextImage(' + loc.Id + ')">>></div></div></div>';
            html += '<div class="divRow"><div class="divRowCell50"><button class="bsButton bsButtonInfo" ng-click="uploadFile(' + loc.Id + ')">Upload</button></div><div class="divRowCell50"><button class="bsButton bsButtonDanger" ng-click="deleteAttachment(' + loc.Id + ')">Delete</button></div></div>';





            html += '</div>';
            html += '</div>';
            //end attachments




            html += '</div>';
        }
        //$compile(html)($scope);
        angular.element("#txtLowerNavFields").html(html);

        $compile(angular.element("#txtLowerNavFields").contents())($scope);
        angular.element("#txtLowerNavFields :input").on("change", function () {
            
            if ($scope.isDirty == false) {
                $scope.isDirty = true;
            }
        });
        angular.element("#txtLowerNavFields .isNumeric").ssNumber();
    }
    $scope.rowClicked = function (result) {
        $scope.promptSaveBeforeAction(function () {
            apiService.GetEquipmentDataById($scope.filteredEquipmentList[result].Id, function (result) {
                if (result.Successful) {
                    
                    
                    //$scope.mainData = result.Data.Layout.Id;
                    
                    //$scope.lowerNavTabs = result.Data.Layout.SubLocations;
                    if (result.Data.EquipmentData.InServiceDate != null) {
                        var temp = new Date(result.Data.EquipmentData.InServiceDate);
                        result.Data.EquipmentData.InServiceDate =
                            padStr(1 + temp.getMonth()) + '/' + padStr(temp.getDate()) + '/' + padStr(temp.getFullYear());
                    }
                    if (result.Data.EquipmentData.OutServiceDate != null) {
                        var temp = new Date(result.Data.EquipmentData.OutServiceDate);
                        result.Data.EquipmentData.OutServiceDate =
                            padStr(1 + temp.getMonth()) + '/' + padStr(temp.getDate()) + '/' + padStr(temp.getFullYear());
                    }

                    $scope.lowerNavTabs = [];
                    $scope.mainData = 0;
                    for (var i = 0; i < $scope.layouts.length; i++) {
                        if ($scope.layouts[i].EquipmentTypeId == result.Data.EquipmentData.EquipmentTypeId) {
                            $scope.mainData = $scope.layouts[i].Id;

                            $scope.lowerNavTabs = $scope.layouts[i].SubLocations;
                            break;
                        }

                    }

                    for (var v = 0; v < result.Data.Attachments.length; v++) {
                        var val = $scope["currentImg" + result.Data.Attachments[v].AttachmentTypeId];
                        if (val == null) {
                            $scope["currentImg" + result.Data.Attachments[v].AttachmentTypeId] = result.Data.Attachments[v].Id;
                        }
                    }
             
                    $scope.selectedRow = result.Data;
                    $scope.isDirty = false;
                    $scope.generateLayout();
                } else {
                    $scope.selectedRow = null;
                    $scope.isDirty = false;
                }
            }, function (result) {
                $scope.selectedRow = null;
                $scope.isDirty = false;
            });
        });
    };
    $scope.UpdateLayoutTabs = function () {
        $scope.lowerNavTabs = [];
        $scope.mainData = 0;
        for (var i = 0; i < $scope.layouts.length; i++) {
            if ($scope.layouts[i].EquipmentTypeId == $scope.selectedRow.EquipmentData.EquipmentTypeId) {
                $scope.mainData = $scope.layouts[i].Id;
                $scope.lowerNavTabs = $scope.layouts[i].SubLocations;

                $scope.generateLayout();
                $scope.isDirty = true;
                break;
            }
        }
    }
    $scope.setDirty = function () {
        if ($scope.isDirty == false) {
            $scope.isDirty = true;
        }
    }

    $scope.init = function () {
        $scope.isDirty = false;
        

        if ($scope.lowerNavTabs != null && $scope.lowerNavTabs.length > 0) {
            $scope.currentLowerTab = $scope.lowerNavTabs[0].Id;
        } else {
            $scope.currentLowerTab = 1;
        }
        $scope.LoadLayouts();
        $scope.LoadEquipment();
        angular.element('#tbEquipment').ssTable('init', {
            aoData: $scope.filteredEquipmentList,
            rowRenderFn: $scope.rowRenderFn,
            ngCompile: [$compile, $scope, $timeout],
            bottomPositionReferenceElement: null,
            isSearchBarVisible: false,
            isRowCountVisible: true
        });
        var options = {
            dateFormat: "mm/dd/yy",
            onSelect: function (dateText) {
                //$scope.updateInServiceDate(dateText);
                $scope.selectedRow.EquipmentData.InServiceDate = dateText;
                $scope.isDirty = true;
            }
        };
        angular.element("#txtInServiceDate").datepicker(options);
        options = {
            dateFormat: "mm/dd/yy",
            onSelect: function (dateText) {
                //$scope.updateInServiceDate(dateText);
                $scope.selectedRow.EquipmentData.OutServiceDate = dateText;
                $scope.isDirty = true;
            }
        };
        angular.element("#txtOutServiceDate").datepicker(options);
        
    }
    $scope.rowRenderFn = function (i, rowData, columnKeys, tdStyleArray) {

        var htmlString = "<tr id='EquipRow-" + rowData.Id + "' ng-class='{\"highlightSelected\": " + rowData.Id + " == selectedRow.EquipmentData.Id }' ng-click='rowClicked(" + rowData.Index + ")'>";

        for (var j = 0; j < columnKeys.length; j++) {
            htmlString += "<td style=\"" + tdStyleArray[columnKeys[j]] + "\">" + eval('rowData.' + columnKeys[j]) + "</td>";
        }

        htmlString += "</tr>";
        return htmlString;
    }
    $scope.FilterEquipment = function () {
        var list = [];
        var equipmentList = $scope.equipmentList;
        for (var i = 0; i < equipmentList.length; i++) {
            var toAdd = true;

            if ($scope.equipmentTypeId != 0 && equipmentList[i].EquipmentTypeId != $scope.equipmentTypeId) {
                toAdd = false;
            }

            if (toAdd) {
                if ($scope.plantFilterType != 0 && equipmentList[i].PlantId != $scope.plantFilterType) {
                    toAdd = false;
                }
            }
            if (toAdd) {
                if (!$scope.showInactiveEquipment) {
                    if (!equipmentList[i].InService) {
                        toAdd = false;
                    }
                }
            }
            if (toAdd) {
                var filterText = $scope.filterByText.toLowerCase();
                if (filterText.length > 0) {
                    toAdd = false;

                    if (equipmentList[i].EquipmentNumber == null) {
                        equipmentList[i].EquipmentNuber = '';
                    }
                    if (equipmentList[i].Description == null) {
                        equipmentList[i].Description = '';
                    }
                    if (equipmentList[i].Manufacturer == null) {
                        equipmentList[i].Manufacturer = '';
                    }
                    if (equipmentList[i].Model == null) {
                        equipmentList[i].Model = '';
                    }
                    if (equipmentList[i].SerialNumber == null) {
                        equipmentList[i].SerialNumber = '';
                    }
                    if (equipmentList[i].EquipmentNumber.toLowerCase().indexOf(filterText) > -1 ||
                        equipmentList[i].Description.toLowerCase().indexOf(filterText) > -1 ||
                        equipmentList[i].Manufacturer.toLowerCase().indexOf(filterText) > -1 ||
                        equipmentList[i].Model.toLowerCase().indexOf(filterText) > -1 ||
                        equipmentList[i].SerialNumber.toLowerCase().indexOf(filterText) > -1) {
                        toAdd = true;
                    }
                }
            }

            if (toAdd) {
                list.push(JSON.parse(JSON.stringify(equipmentList[i])));
            }

        }
        for (var z = 0; z < list.length; z++) {
            list[z].Index = z;
        }

        $scope.filteredEquipmentList = list;
        

        angular.element('#tbEquipment').ssTable('refresh', $scope.filteredEquipmentList);
        if ($scope.scrollToId != null) {
            angular.element('#tbEquipment').ssTable('scrollToRowByKeyValuePair', 'Id', $scope.scrollToId, function () {
                angular.element("#EquipRow-" + $scope.scrollToId).trigger("click");
            });
            $scope.scrollToId = null;
        }
    }
    $scope.LoadEquipment = function () {
        apiService.LoadEquipmentData(function (result) {

            if (result.Successful) {
                $scope.equipmentTypes = result.Data.EquipmentType;
                var clonedTypes = JSON.parse(JSON.stringify(result.Data.EquipmentType));
                clonedTypes.splice(0, 0, {
                    Id: 0,
                    Name: "All"
                });
                $scope.equipmentTypesFilter = clonedTypes;
                $scope.equipmentList = result.Data.EquipmentData;
                $scope.plantTypes = result.Data.PlantType;
                $scope.conveyorTypes = result.Data.ConveyorTypes;

                clonedTypes = JSON.parse(JSON.stringify(result.Data.PlantType));
                clonedTypes.splice(0, 0, {
                    Id: 0,
                    Code: "Any"
                });
                $scope.plantTypesFilter = clonedTypes;
                $scope.manufacturers = result.Data.Manufacturers;
                $scope.unitsOfMeasurement = result.Data.UnitsOfMeasurement;
                //$scope.attachments = result.Data.Attachments;
                $scope.FilterEquipment();
                $scope.isDirty = false;
            }
        },
        function (result) {

        });
    }
    $scope.LoadLayouts = function() {
        apiService.LoadLayouts(function (result) {
            if (result.Successful) {
                $scope.layouts = result.Data;
            } else {
                $scope.layouts = [];
            }
            
        }, function(result) {});

    }
    $scope.init();

}]);
myApp.controller("MarcouMaintenanceRecordsController", ["$scope", "$filter", "$http", "$cookies", "$cookieStore", "$compile", "$marcou-equipment", function ($scope, $filter, $http, $cookies, $cookieStore, $compile, apiService) {

    $scope.blah = "aaa";
    $scope.whatever = "";
    $scope.init = function () {

        $scope.whatever += "bbb";
    }

    $scope.init();

}]);

