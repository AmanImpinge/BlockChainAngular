/* ----------------------------------------------------------------------------------------------

Note:   All buttons in the LightBox will close the LightBox. There is no need to provide a 
        function or code to close the light box. 

Files:  Files associated with the LightBox:  LightBox.js, LightBox.css, LightBox.chtml

===========================================
            **** WARNINGS *****
===========================================
    Do NOT modify any of the z-indexes associated with the Light Box. Whether
    in this file or your own implemented HTML code. If you find yourself needing to change the
    z-index you have implemented the LightBox incorrectly.
===========================================

DisplayIndependent():  
    In some instances there is a new to provide a detailed HTML page inside of a popup. This is possible with this method call.
    You will create your HTML normally starting with the DisplayIndependent HTML code which can be found in the LightBox.csHTML 
    page (it's commented out). Please do not change any of the classes. They are all needed by the LightBox Class. You can add 
    in your own classes. You will need to provide an ID for the first Inner div.  Please see the example:

    <div class="LightBoxIndependentWrapper noShow">
        <div id="******PROVIDE AN ID********" class="LightBoxIndependent">

    That ID you use will be the id you provide in the DisplayIndependent() method call
        
        lb.DisplayIndependent('#NewIDAdded');

    Everything in your HTML code should already have your binds and clicks added. The light box is merely displaying it in the proper
    format. When using the LightBox independent you can also set the width of the LightBox. Please see the .Width() method for details.

    Please see below for an Examples.

===========================================
              METHODS FOR USE
===========================================
Initialization 
    var lb = new LightBox(message)
        The message can be passed through the initial declaration.

.ButtonValuesYes(callbackFunction, buttonText, buttonFli)
    This will set up the "Yes/Okay" button with the callback function. You can also pass in the dataFli string to 
    use for the button name if it needs to be different than the word "OK" which is the default text.
    
.ButtonValuesNo(callbackFunction, buttonText, buttonFli)
    This will set up the "No" button with the callback function. You can also pass in the dataFli string to 
    use for the button name if it needs to be different than the word "No" which is the default text.
    
.ButtonValuesCancel(callbackFunction, buttonText, buttonFli)
    This will set up the "Cancel" button with the callback function. You can also pass in the dataFli string to 
    use for the button name if it needs to be different than the word "Cancel" which is the default text.

.ButtonColors(yesColor, CancelColor, NoColor)
    The idea is that you can change the color of the buttons. You must pass in the approrpiate values allowed. 
    Those are: Info, Primary, Warning, Success, Warning
    
.Content(contentHTML)
    This is the main content of the LightBox. It can take html tags and such, including the input tags. Required.
    
.Width(cssClassorWidth)
    The default width of the LightBox is 40% width of the browser window. You can override this value by providing
    a specified class (percentage indicated in class) or an actual pixel value. If you provide a pixel value DO NOT include the 'px'
        CSS Class Options = lb40, lb50, lb60, lb70, lb80, lb90, lb95

.HeaderContent(defaultText, dataFli, icon)
    This method takes three arguments. The third parameter is optional. One of the first two parameters 
    must be present. Suggestion: Always provide the defaultText
        defaultText =   The header text you want to display as default or in general if no dataFlI is provided
        dataFli =       The fli that the header text will used. If this is not set in the DB then the defaultText 
                        will show if it is provided.             
        icon =          this is the font-awesome class name that you want displyed.  All of them start with icon-

.HideHeader()
    This will hide the entire header including the "X" close button.

.HideHeaderText()
    The header text and the icon will not show if this is called. The "X" close button will still be seen.

.ShowCancel()
    If this is called the Cancel button will be displayed.

.ShowNo()
    If this is called the No button will be  displayed.

.HideYes()
    If this is called the Yes button will not be  displayed.

.CloseX(callbackFunction)
    This can be called to add a callback function to the Regular LightBox "X" button in the upper right hand corner. 
    This function will be called along with the regular close function, which closes the LightBox.

.Display()
    Needs to be the final call, which will hook up all the information together and display the LightBox.

------ The following are for displaying more complex HTML inside a LightBox --------------------------------------------------------

.DisplayIndependent(IdTag)
    This is used when you are using an individually created LightBox (Please see the template for doing 
    this in the LightBox.chtml file).  This needs to be the last call. It hooks up the default close clicks 
    to all the buttons and will display the LightBox

.Close()
    This will manuall close the LightBox when called if the LightBox was initially called with .DisplayIndependent(idTag). 
    This will not work with .Display()

.Reopen()
    This method will reopen and already populated .DisplayIndependent(idTag) LightBox. This will not work with .Display()

.DoNotClose()
    For use with the DisplayIndependent(idTag). This will not attach the closue callbacks to the button click events, 
    including the X. You will need to use the .Close() inside your own click events on the button to close the LightBox.
    Pass in a value of .DoNotClose(true) and you will be able to preserve the last button to have a close event added to it.

.BeforeClose(passInFunction)
    This will run in place of the "X" close button on the LightBox. If you use this you will need to manually run the .Close() 
    call inside your function that you are passing into the BeforeClose method

.Ajax(url, IDForPopulation)
    This will populate your designated ID with the content returned from the ajax call. If you do not provide an ID, the 
    default ID used will be  #LightBoxContent, which is part of the base HTML provided when making a Independent LightBox

.IsSet() - Returns True/False
    Checks to see if an ID is already being used in the LightBox call. This way you can determine if you need to create a new 
    LightBox or if you need to close an Open LightBox.

.BeforeClose()
    This is a function that you want called before the LightBox closes. This function will be called on the X and the Cancel button

.SkipBefore()
    This is normally used in a callback function when you are dealing with putting a callback on the Yes or No button and 
    you ahve the BeforeCLose function set.

.Destroy();
    This clears out the Content ID area if it was populated by an Ajax call and then destroys the container ID. THis means you have
    to redeclare the LightBox Independent with the ID of the Independent LightBox.


===========================================
                 EXAMPLES
===========================================

Alert Examples --------------
    var lb = new LightBox();
    lb.Content('Message Here');
    lb.Display();


    var lb = new LightBox('Message Here');
    lb.Display();

    //-- you can daisy chain them, with Display always being the last
    var lb = new LightBox(m).Display(); // This has been tested.

Confirm Example ------------
    var lb = new LightBox();
    lb.HeaderContent('Confirm');
    lb.Content('Message Here.');
    lb.ButtonValuesYes(function() { // call back function }, '_LightBox_FLINameForTheOkButton');
    lb.ShowCancel();    
    lb.Display();

Other Examples ------------
    var lb = new LightBox();
    lb.HeaderContent('Save', '_LightBox_FollowUpMergeHeaderSave', 'icon-save');
    lb.Content('Would you like to save this e-mail as a new template?');
    lb.ButtonValuesYes(function () { EmailEditor.saveAsNewContentSubmit(showSearchEditor()); });
    lb.ButtonValuesNo(function () { showSearchEditor(); });
    lb.Width('lb60');
    lb.ShowCancel();
    lb.ShowNo();
    lb.Display();
    
    var lb = new LightBox();
    lb.HeaderContent('Copy', '_LightBox_FollowUpMergeHeaderFilter', 'icon-copy');
    lb.Content('<input type="text" id="txtSaveName" />');
    lb.ButtonValuesYes(copyCallback);
    lb.Width("600");
    lb.ShowCancel();
    lb.Display();

Independent Examples -----
    var lb = new LightBox();
    lb.DisplayIndependent('#HTMLID');

    var lb = new LightBox().DisplayIndependent('#HTMLID'); //This has not been tested but should work.

    var lb = new LightBox();
    lb.Width('lb70');
    lb.DisplayIndependent('#HTMLID');


---------------------------------------------------------------------------------------------- */
gDebug = false;
var LightBox = function (contentHtml) {
    //------------------------------------------------------------------------- Close Functions
    var callbackClose = function () {
        if ($.isFunction(beforeCloseFunction)) {
            beforeCloseFunction();
        }

        $('#LightBoxWrapper').addClass('noShow');

        if (!$('.LightBoxIndependentWrapper').is(':visible')) {
            if (!keepDimmerViewable) {
                $('#LightBoxDimmer').addClass('noShow');
            }
        } else {
            $('#LightBoxDimmer').css('z-index', '25');
        }
    };

    var callbackCloseIndependent = function () {
        if ($.isFunction(beforeCloseFunction) && !skipBeforeCloseFunction) {
            beforeCloseFunction();

            if (handleCloseIndependent) {
                _closeIndependentCall();
            }
        } else {
            _closeIndependentCall();
        }
    };

    var manuallyCloseIndependent = function () {
        if (idContainer) {
            callbackCloseIndependent();
        } else {
            if (gDebug) {
                alert('Hey Developer - \nYou need to have already called the DisplayIndependent() method call with the appropriate ID to close the LightBox independently.');
            }
        }
    };

    var _closeIndependentCall = function () {
        var tempCount = 0;
        var tempCountInd = 0;

        $(idContainer).parent().addClass('noShow');
        $(idContainer).addClass('noShow');

        $('.LightBoxIndependentWrapper').not('.noShow').each(function () { //fli's "show invisible" feature will override noShow and tempCount will be off.
            if ($(this).is(':visible')) {
                tempCount++;
            }
        });

        if ($("#LightBoxWrapper").is(':visible')) {
            tempCountInd++;
        }

        if (tempCount == 1) {
            $('#LightBoxDimmer').css('z-index', '25');
        }

        if (tempCount == 0 && tempCountInd == 0) {
            $('#LightBoxDimmer').addClass('noShow');
        }
    };
    //-- End Close Functions

    //------------------------------------------------------------------------- default private variables
    var buttonColorsArray = ["Info", "Primary", "Warning", "Success", "Danger"];
    var beforeCloseFunction = null;
    var handleCloseIndependent = false;
    var showYes = true;
    var showNo = false;
    var showCancel = false;
    var showHeader = true;
    var showHeaderText = true;
    var automaticallyCloseAll = true;
    var automaticallyCloseLastButton = true;
    var skipBeforeCloseFunction = false;
    var changeButtonColors = false;
    var buttonColorNo = '';
    var buttonColorYes = 'bsButtonInfo';
    var buttonColorCancel = '';
    var headerIcon = '';
    var headerText = '';
    var headerFli = '';
    var widthPixels = '';
    var widthClass = '';
    var content = '';
    var idContainer = '';
    var ajaxId = '';
    var keepDimmerViewable = false;

    //-- setting functions info
    var callbackYes = '';
    var callbackNo = '';
    var callbackCancel = '';
    var callbackCancelX = '';
    var buttonTextYes = 'Okay';
    var buttonTextNo = 'No';
    var buttonTextCancel = 'Cancel';
    var buttonFliYes = '_LightBox_GenericButtonOK';
    var buttonFliNo = '_LightBox_GenericButtonNo';
    var buttonFliCancel = '_LightBox_GenericButtonCancel';
    //-- End Private Variables

    //------------------------------------------------------------------------- Set Variables
    var setBeforeCloseFunction = function (newCloseFunction, handleClose) {
        if ($.isFunction(newCloseFunction)) {
            beforeCloseFunction = newCloseFunction;

            if (handleClose != undefined && handleClose) {
                handleCloseIndependent = true;
            }
        } else {
            if (gDebug) {
                alert('Hey Developer -\nIn order to use the .BeforeClose() method you need to pass in a function as the parameter.');
            }
        }
    };

    var setShowYes = function () {
        showYes = false;
    };

    var setShowNo = function () {
        showNo = true;
    };

    var setSkipBeforeCloseFunction = function (shouldSkip) {
        if (shouldSkip !== false) {
            skipBeforeCloseFunction = true;
        } else {
            skipBeforeCloseFunction = false;
        }
    };

    var setShowCancel = function () {
        showCancel = true;
    };

    var setShowHeader = function () {
        showHeader = false;
    };

    var setShowHeaderText = function () {
        showHeaderText = false;
    };

    var setButtonColors = function (yesButtonColorTemp, cancelButtonColorTemp, noButtonColorTemp) {
        changeButtonColors = true;

        var tempYesColor = 0;
        var tempNoColor = 0;
        var tempCancelColor = 0;
        buttonColorYes = '';
        buttonColorNo = '';
        buttonColorCancel = '';

        $.each(buttonColorsArray, function (index, item) {
            if (yesButtonColorTemp == item) {
                tempYesColor++;
            }

            if (cancelButtonColorTemp == item) {
                tempCancelColor++;
            }

            if (noButtonColorTemp == item) {
                tempNoColor++;
            }
        });

        if (tempYesColor > 0) {
            buttonColorYes = "bsButton" + yesButtonColorTemp;
        }

        if (tempCancelColor > 0) {
            buttonColorCancel = "bsButton" + cancelButtonColorTemp;
        }

        if (tempNoColor > 0) {
            buttonColorNo = "bsButton" + noButtonColorTemp;
        }
    };

    var setHeaderContent = function (defaultText, dataFli, icon) {
        var tempValid = 0;
        headerFli = '';
        headerText = '';

        if (defaultText != '' && defaultText != undefined) {
            headerText = defaultText;
        } else {
            tempValid++;
        }

        if (dataFli != '' && dataFli != undefined) {
            headerFli = dataFli;
        } else {
            tempValid++;
        }

        if (tempValid == 2) {
            if (gDebug) {
                alert('Hey Developer - \nYou need to pass in either text for the header (first param) or a ' +
                    '\nheader data-fli value (second param) or both.\n data-fli is suggested to be prefixed with _LightBox_');
            }
        }

        if (icon != '' && icon != undefined) {
            headerIcon = icon;
        }
    };

    var setContent = function (contentHtml) {
        content = '';
        if (contentHtml != '' && contentHtml != undefined) {
            content = contentHtml;
        } else {
            if (gDebug) {
                alert('Hey Developer - \nYou need to pass in a value for the content.');
            }
        }
    };

    var setKeepDimmerViewable = function () {
        keepDimmerViewable = true;
    };

    var setWidth = function (cssClassorWidth) {
        if (cssClassorWidth != '' && cssClassorWidth != undefined) {
            if (parseInt(cssClassorWidth) > 0) {
                widthPixels = cssClassorWidth;
            } else {
                widthClass = cssClassorWidth;
            }
        } else {
            if (gDebug) {
                alert('Hey Developer - \nEither provide a pixel value or class for the width. If width is not needed remove the call.' +
                    '\n Default Width: 40% \n Pass in Classes: lb40, lb50, lb60, lb70, lb80, lb90, lb95\n Pass in Pixel Widths: 500, 350, etc.');
            }
        }
    };

    var setButtonValuesYes = function (callbackFunction, buttonText, buttonFli) {
        if (buttonFli != undefined && buttonFli != '') {
            buttonFliYes = buttonFli;
        }

        if (buttonText != undefined && buttonText != '') {
            buttonTextYes = buttonText;
        }

        if (callbackFunction != undefined && callbackFunction != '' && $.isFunction(callbackFunction)) {
            callbackYes = callbackFunction;
        } else {
            callbackYes = '';
        }
    };

    var setButtonValuesNo = function (callbackFunction, buttonText, buttonFli) {
        if (buttonFli != undefined && buttonFli != '') {
            buttonFliNo = buttonFli;
        }

        if (buttonText != undefined && buttonText != '') {
            buttonTextNo = buttonText;
        }

        if (callbackFunction != undefined && callbackFunction != '' && $.isFunction(callbackFunction)) {
            callbackNo = callbackFunction;
        } else {
            callbackNo = '';
        }
    };

    var setButtonValuesCancel = function (callbackFunction, buttonText, buttonFli) {
        if (buttonFli != undefined && buttonFli != '') {
            buttonFliCancel = buttonFli;
        }

        if (buttonText != undefined && buttonText != '') {
            buttonTextCancel = buttonText;
        }

        if (callbackFunction != undefined && callbackFunction != '' && $.isFunction(callbackFunction)) {
            callbackCancel = callbackFunction;
        } else {
            callbackCancel = '';
        }
    };

    var setCancelX = function (callbackFunction) {
        if (callbackFunction != undefined && callbackFunction != '' && $.isFunction(callbackFunction)) {
            callbackCancelX = callbackFunction;
        } else {
            callbackCancelX = '';
        }
    };

    var setDoNotClose = function (tempLastButton) {
        automaticallyCloseLastButton = (tempLastButton == undefined) ? false : tempLastButton;
        automaticallyCloseAll = false;
    };

    var setClicks = function () {
        $('#lbYesButton').on('click.LightBox', function () {
            if ($(this).hasClass("disabled")) return;

            if ($.isFunction(callbackYes)) {
                (callbackYes)();
            }

            (callbackClose)();
        });

        $('#lbNoButton').on('click.LightBox', function () {
            if ($.isFunction(callbackNo)) {
                (callbackNo)();
            }

            (callbackClose)();
        });

        $('#lbCancelButton').on('click.LightBox', function () {
            if ($.isFunction(callbackCancel)) {
                (callbackCancel)();
            }

            (callbackClose)();
        });

        $('#LightBoxHeader button').on('click.LightBox', function () {
            if ($.isFunction(callbackCancelX)) {
                (callbackCancelX)();
            }

            (callbackClose)();
        });

        $('#lbYesButton span').removeAttr('data-fli').attr('data-fli', buttonFliYes).text(buttonTextYes);
        $('#lbNoButton span').removeAttr('data-fli').attr('data-fli', buttonFliNo).text(buttonTextNo);
        $('#lbCancelButton span').removeAttr('data-fli').attr('data-fli', buttonFliCancel).text(buttonTextCancel);
    };

    var isSetIdOfIndependnet = function () {
        if (idContainer != '') {
            return true;
        }

        return false;
    };
    //-- End Set Values

    //------------------------------------------------------------------------- Display Functions
    var display = function () {
        setClicks();
        clearButtonColors();

        //- order matters
        if (headerIcon != '') {
            $('#lbHeaderIcon').removeAttr('class').addClass(headerIcon);
        }

        if (headerText != '') {
            $('#lbHeaderText').attr('data-fli', headerFli).text(headerText);
        }

        if (!showHeader) {
            $('#LightBoxHeader').addClass('noShow');
        }

        if (!showHeaderText) {
            $('#lbHeaderIcon, #lbHeaderText').addClass('noShow');
        }

        if (!showYes) {
            $('#lbYesButton').addClass('noShow');
        }

        if (showNo) {
            $('#lbNoButton').removeClass('noShow');
        }

        if (showCancel) {
            $('#lbCancelButton').removeClass('noShow');
        }

        if (content != '') {
            $('#LightBoxContent').html(content);
        }

        if (widthPixels != '') {
            $('#LightBox').css('width', widthPixels + "px");
        }

        if (widthClass != '') {
            $('#LightBox').addClass(widthClass);
        }

        $('#LightBox').css('top', $(window).scrollTop() + 'px'); // make sure it positioned on the screen
        $('#LightBoxDimmer').removeClass('noShow');
        $('#LightBoxWrapper').removeClass('noShow').css({ opacity: 0.0 }).animate({ opacity: 1.0 });
           // .fli('init'); // run the FLI - this will cover the header, and buttons

        $('#lbYesButton').addClass(buttonColorYes);
        $('#lbNoButton').addClass(buttonColorNo);
        $('#lbCancelButton').addClass(buttonColorCancel);

        var tempTotalCount = 0;

        $('.LightBoxIndependentWrapper').each(function () {
            var current = $(this).is(':visible');

            if (current) {
                tempTotalCount++;
            }
        });

        if (tempTotalCount > 0) {
            $('#LightBoxWrapper').css('z-index', '52');
            $('#LightBoxDimmer').css('z-index', '51');
        }
    };

    var displayIndependent = function (divContainer, ajaxUrl, ajaxPopulateId, ajaxCallback) {
        if (divContainer != undefined && divContainer != '') {
            idContainer = divContainer;

            if (widthPixels != '') {
                $(idContainer).css('width', widthPixels + "px");
            }

            if (widthClass != '') {
                $(idContainer).addClass(widthClass);
            }

            if (automaticallyCloseAll && $(idContainer + ' .lightBoxActionButtons').length > 0) {
                $(idContainer + ' .lightBoxActionButtons div').each(function () {
                    //-- prevents multiple binding of the close event
                    if (!General.checkBoundEvent($(this), 'LightBox')) {
                        $(this).on('click.LightBox', callbackCloseIndependent);
                    }
                });
            }

            if (automaticallyCloseLastButton && $(idContainer + ' .lightBoxActionButtons').length > 0 && !General.checkBoundEvent($(idContainer + ' .lightBoxActionButtons div:last'), 'LightBox')) {
                $(idContainer + ' .lightBoxActionButtons div:last').on('click.LightBox', callbackCloseIndependent);
            }

            if (ajaxUrl != undefined && ajaxUrl != '') {
                ajaxCall(ajaxUrl, ajaxPopulateId, ajaxCallback);
            }

            //-- The X will always close the light box no matter what. This prevents multipl binding of same event
            if (!General.checkBoundEvent($(idContainer + ' .lightBoxHeader button'), 'LightBox')) {
                $(idContainer + ' .lightBoxHeader button').on('click.LightBox', callbackCloseIndependent);
            }

            _openIndependentCall();

            //if ($().fli) {
            //    $(idContainer).fli('init');
            //}
        } else {
            if (gDebug) {
                alert('Hey Developer - \nYou need to provide an ID of the container you want to show.');
            }
        }
    };

    var reopen = function () {
        if (idContainer) {
            skipBeforeCloseFunction = false;
            _openIndependentCall();
        } else {
            if (gDebug) {
                alert('Hey Developer - \nYou need to have already called the DisplayIndependent() method call with the appropriate ID in order to reopen the LightBox.');
            }
        }
    };

    var _openIndependentCall = function () {
        var totalContainers = 0;
        $(idContainer).parent().css('z-index', '50');
        $('#LightBoxDimmer').css('z-index', '25');

        $(idContainer).css('top', $(window).scrollTop() + 'px'); // in case they scrolled a little bit
        $('.LightBoxIndependentWrapper ' + idContainer).removeClass('noShow');
        $(idContainer).parent().removeClass('noShow');

        $('.LightBoxIndependentWrapper').each(function () {
            var current = $(this).is(':visible');


            if (current) {

                totalContainers++;
            }
        });

        if ((totalContainers - 1) > 0) { //-- this accounts for the current parent being visable.
            $(idContainer).parent().css('z-index', '52');
            $('#LightBoxDimmer').css('z-index', '51');
        }

        //setTimeout(function () {
        $('#LightBoxDimmer').removeClass('noShow'); //-- This is foot race with the callback function. having the timer allows the Dimmer to show
        // }, 20);
        try {
            $(idContainer).find('.ssTable').each(function () {
                $(this).ssTable('resize');
            })
        } catch (e) {

        }
    };
    //-- End Display Functions

    //------------------------------------------------------------------------- Misc
    var ajaxCall = function (htmlUrl, populateContainer, callbackFunction) {
        //-- where should the content go
        if (populateContainer != undefined && populateContainer != '') {
            ajaxId = ".LightBoxIndependentWrapper " + populateContainer;
        } else {
            if (idContainer != '') {
                ajaxId = idContainer + ' .lightBoxContent';
            } else {
                if (gDebug) {
                    alert('Hey Developer -\nIf using the actual .Ajax() call you need to provide a class or ID (including the . or #\n. ' +
                        'Instead of using the .Ajax call you can add the ajaxURL as the second parameter in the .DisplayIndependent() call.');
                }
            }
        }

        if (htmlUrl != undefined && htmlUrl != '') {
            $.ajax({
                type: 'POST',
                url: htmlUrl,
                data: {},
                dataType: 'html',
                async: false,
                success: function (result) {
                    $(ajaxId).html('');
                    $(ajaxId).html(result); //-- populate the ID

                    if ($.isFunction(callbackFunction)) {
                        callbackFunction();
                    }
                },
                failure: function () {
                    var lb = new LightBox('Unable to process your request.');
                    lb.Display();
                }
            });
        } else {
            if (gDebug) {
                alert('Hey Developer -\nIf you are using the .Ajax() method you must supply a URL.');
            }
        }
    };

    var clearIdContainer = function () {
        if (ajaxId != '') {
            $(ajaxId).html();
        }

        idContainer = '';
    };

    var clearButtonColors = function () {
        $.each(buttonColorsArray, function (index, item) {
            $('#lbYesButton, #lbNoButton, #lbCancelButton').removeClass("bsButton" + item);
        });
    };

    var reset = function () {
        beforeCloseFunction = null;
        handleCloseIndependent = false;
        skipBeforeCloseFunction = false;
        automaticallyCloseAll = true;
        automaticallyCloseLastButton = true;
        keepDimmerViewable = false;
        showNo = false;
        showYes = true;
        showCancel = false;
        showHeader = true;
        showHeaderText = true;
        headerIcon = 'icon-warning-sign';
        headerText = 'Alert';
        headerFli = '_LightBox_GenericHeader';
        widthPixels = '';
        widthClass = '';
        content = '';
        ajaxId = '';

        changeButtonColors = false;
        buttonColorNo = '';
        buttonColorYes = 'bsButtonInfo';
        buttonColorCancel = '';

        callbackYes = '';
        callbackNo = '';
        callbackCancel = '';
        callbackCancelX = '';
        buttonTextYes = 'Okay';
        buttonTextNo = 'No';
        buttonTextCancel = 'Cancel';
        buttonFliYes = '_LightBox_GenericButtonOK';
        buttonFliNo = '_LightBox_GenericButtonNo';
        buttonFliCancel = '_LightBox_GenericButtonCancel';

        $('#LightBox').removeAttr('style');
        $('#LightBox, #lbHeaderIcon').removeAttr('class');

        $('#LightBoxContent').empty(); //
        $('#lbNoButton span').html('No'); //
        $('#lbCancelButton span').html('Cancel'); //
        $('#lbYesButton span').html('OK'); //

        $('#lbNoButton, #lbYesButton, #lbCancelButton').unbind('click.LightBox');
        $('#LightBoxHeader, #lbHeaderIcon, #lbHeaderText').removeClass('noShow');

        //-- I added the LightBoxDimmer to this line of code. Should be monitored if it causes grief for other areas. :)
        $('#lbNoButton, #lbCancelButton, #LightBoxWrapper, #LightBoxDimmer').addClass('noShow');
    };

    __construct = function () {
        reset();

        if (contentHtml != 'undefined' && contentHtml != '') {
            content = contentHtml;
        }
    }();
    //-- End Misc

    return {
        Display: display,
        DisplayIndependent: displayIndependent,
        ShowNo: setShowNo,
        HideYes: setShowYes,
        ShowCancel: setShowCancel,
        HideHeader: setShowHeader,
        HideHeaderText: setShowHeaderText,
        HeaderContent: setHeaderContent,
        ButtonValuesYes: setButtonValuesYes,
        ButtonValuesNo: setButtonValuesNo,
        ButtonValuesCancel: setButtonValuesCancel,
        KeepDimmerViewable: setKeepDimmerViewable,
        CloseX: setCancelX,
        Content: setContent,
        Width: setWidth,
        Reopen: reopen,
        DoNotClose: setDoNotClose,
        Close: manuallyCloseIndependent,
        BeforeClose: setBeforeCloseFunction,
        Ajax: ajaxCall,
        IsSet: isSetIdOfIndependnet,
        SkipBefore: setSkipBeforeCloseFunction,
        Destroy: clearIdContainer,
        ButtonColors: setButtonColors
    };
};