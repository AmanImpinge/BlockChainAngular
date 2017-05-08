/*
==================README added callback features=====================
 var onCallBackScroll = oInit.callBackScroll;
 var onSortCallBack   = oInit.callBackSort;
 var onSearchCallBack = oInit.callBackSearch;
=============================================
HTML / CSS Checklist 
Your <table> is the only child in a <div>. The <div> will determine the size of the table so your HTML/js should properly handle the height of this div.
Your <table> has an empty <tbody> and has one <th> row in the <thead>.
The <th>'s have a data-key attribute.  The data-key values are passed to the rowRenderFn in the columnKeys (array) param. Since the user may have re-ordered the columns, the sequence of the keys in columnKeys indicates the order of the HTML columns from left to right
All the <th>'s should have a css width property
The parent of your <table> has the "position" CSS property. The value can be anything (e.g., relative, absolute, etc.) 
Your <table> has an id attribute.
The padding and margin of your <th>'s must match the margins and padding of the <td>'s you 
define in your rowRenderFn.  Otherwise misalignment will occur.  If you need to 
additional spacing, just put a <span> inside your <td> and apply margin and padding to the <span>.
Your <table> style must be "table-layout:fixed".

JS Notes:

    If you add an event handler to the rows (like a click). Then use jquery's "on" method and 
    bind it to the PARENT of your <table>, _NOT_ your <table>.
    example:
        $('#myTable').parent().on('click', 'tr.myClassDefinedInTheRowRenderFn', function () { ... });
        //see below for more info on RowRenderFn 

 
Public Variables 

none 

Public Methods: //LP unfortunately, was inconsistent in my use of leading underscores to denote if a method is suppose to be public.  Refer to the list for now.  If you see a method you want to use, then first search the entire project an see if anyone else is using it. Otherwise ask me if it should be public.

    init, refresh, scrollToRowByKeyValuePair, filterRecords, resize


init 
    Description:  After calling init your table will be rendered on the screen.

    Parameters oInit
       where    
            oInit is an object with the following properties 
                aoData (type: array of objects
                    where each object consist of key value pairs 
                    where each key is the Column name of your database Table/QueryResult.
                    and each value is the value for that Row and Column in the database Table/QueryResult.)
                                    
             rowRenderFn (type: function)
                    Description: the ssTable plugin will call your rowRenderFn to generate the HTML
                    for every row. 

                    rowRenderFn Parameters: (i, rowData, columnKeys, tdStyleArray) //add the class jsShouldNotDynamicallyStyleTds if the tds widths will never have a need to be resized dynamically. That would happend if you had a table with a large number of columns where it is unlikely even a wide monitor would ever show all the columns.  Customer Search is such an example. 
                        where 
                            i (deprecated) is the index of the current rendered row. Note that this is only 
                            useful for alternate row shading.  Because if the user has started
                            to reduce the rendered rows by filtering the rows with a search, then the
                            "i" will have no correlation to your aoData index. // because this parameter is not useful, it is marked for deletion.
                                
                        rowData is the object used for this row's column values.  It comes directly from your aoData array of object.

                        columnKeys is an array of your Column Names.
                          The order of columnKeys matters! This will allow the alignment of the 
                          headers to the cell data in case the user has to re-ordered the columns.

                        tdStyleArray is an associtive

                        Returns:
                            a string with the HTML to render for the row

                    Example:
                    function rowRenderFn(i, rowData, columnKeys) {
                        var htmlString = '<tr class="trShading' + ((i % 2 == 0) ? 'Even' : 'Odd') + '" id="trPurchaseOrder' + rowData.ID + '">';
                        //if you wanted to highlight a row you could conditionally add a class to the row (e.g., if rowData.ID matches selectedID).
                        for (var j = 0; j < columnKeys.length; j++) {
                            var columnKey = columnKeys[j];
                            eval(' var columnValue = rowData.' + columnKey);
                            var tdStyle = tdStyleArray[columnKeys[j]];
                            tdSyle = tdStyle == null ? '' : tdStyle;                      
                            htmlString += "<td  class="tdMatchPaddingAndMarginOfTH" style="' + tdStyle + '"'" + columnValue + "</td>";
                        }
                        htmlString += "</tr>";
                        return htmlString;
                    }

             ngCompile is an array that should contain three elements
                ngCompile[0] should contain the reference to $compile function of angular
                ngCompile[1] should contain the reference to the $scope variable of angular.
                ngCompile[2] should contain the reference to the $timeout functino of angular.

                the purpose of this parameter is to integrate ssTable to angular. Meaning, if you have angular directives
                in your row render function, you should add this parameter so that those directive will work.
                
                Example:

                angular.element('#mySSTable').ssTable('init', {
                    aoData: aoData,
                    rowRenderFn: rowRenderFn,
                    ngCompile: [$compile,$scope,$timeout]  
                });


    isSearchBarVisible (type: bool)
         //set to true if you want a search bar to display.

    isRowCountVisible (type:bool)
         //set to true if you want the row count to display

    isSortable (type:bool, default false)
         //when set to false, clicking on a header will not sort the table

    Example:    
        $('#table0').ssTable('init', //assume example of three column table(ID, Item and Price) with two rows
            {
                aoData: [{ID:0, Item: 'Apple', Price: '0.99'} , {ID: 1, Item: 'Cherry', Price:'0.10'}]
                rowRenderFn: function(i, rowData, columnKeys) {
                    var htmlString = '<tr id="trMyTableName'+rowData.ID+'">'; //it's nice to see the row ID in the DOM.
                    for (var j = 0; j < columnKeys.length; j++) {
                        var columnKey = columnKeys[j];
                        eval(' var columnValue = rowData.' + columnKey);
                        htmlString += "<td  class="tdMatchPaddingAndMarginOfTH" style='white-space: nowrap; overflow:hidden;'>" + columnValue + "</td>";
                    }
                    htmlString += "</tr>";
                    return htmlString;  
                 },      
                isSearchBarVisible: true,
                isRowCountVisible: false
        });
  

refresh
    Description:
        Use when you need to refresh the data being displayed and the display itself.
        Useful if you just saved/updated your table in the database. Refresh
        also redraws the table.

    Parameters:
        aoData (see init for description) 

    Returns:
        null
    
Example: 
    $('#myTable').ssTable('refresh', [{ID:0, Item: 'Apple', Price: '0.99'} , {ID: 1, Item: 'Cherry', Price:'0.10'}, {ID: 2, Item: 'New Coke', Price:'0.79'}]


scrollToRowByKeyValuePair
    Description: 
    Redraws the <table> so that the first row having a matching key value pair is presented in the scrollable view port.  
      Parameters
         key: (type: string)
         value: (type: any)
         callback: a function to run when the scroll is complete. NOTE: There is a known issue that may cause the callback to run two consecutive times.
    
    Returns:
        null
    
    Example
        $('#gAttachmentTable').ssTable('scrollToRowByKeyValuePair', 'ID', 0, function() {
            $('#trAttachment0').last().trigger('click');
        });

filterRecords
    Description: 
    Redraws the <table> so that only rows matching the filter criteria are show.  Note this filter is performed using the object data not the render data.

      Parameters: 
         filterObject (type: object) with the following properties 
            filterString: (type: any) //filterValue is probably a better name since the type is any
            columnKey: (type: string) //this is the property name in your object
            
    Returns:
        null
    
    Example
        $('#gAttachmentTable').ssTable('filterRecords', { filterString: attachmentTypeId, columnKey: 'TypeID' }); //in this example TypeID is not rendered in the HTML but we can still filter by it.
  
resize:
    Description:
        Redraw the table and viewport based on current width and positions of the <th's> and 
        the bottom reference element.
     
    Parameters:
        none
    
    Returns:
        null
    
    Example:
        $('#myTable').ssTable('resize'); 



TO DO: 
    The plugin code should clear the current search when the developer calls the
scrollToRow method (I may already be doing this LP).
    Possibly add stopwatch support (But I really don't think users care. LP)

File Dependecies:
jquery.css
ssTable.jquery.css
whiteIconFind.png
(future ? ssStopWatch.js). 

Latest Example: see Realtor Screen
Other Example: see below.
*/


//To do: clean up magic numbers like 32px for scroll bar UI height.
//To do: prefix all private functions with underscore. This is partially done. 
//To do: see if some scroll bar methods can be obsoleted now that we have custom scrollbars.
//To do: _getCurrentBrowserScrollbarWidth should set a private constant -- no need to repeatedly run this method.
(function ($) {
    var methods = {
        init: function (oInit) {
            //define properties in the ssTable data namespace (e.g., $(this).data('ssTable').keyupTimeout)
            //note you can't put methods in the return object because the "this" context is lost.

            $(this).hide();
            $(this).addClass('ssTable');

            return this.each(function () {
                //initialize namespace
                var $this = $(this);
                var data = $this.data('ssTable');
                //initialize properties. Access using $('#myTable').data('ssTable').myProperty; 
                var whenComplete = null;
                if (!(typeof oInit.whenComplete === "undefined")) {
                    whenComplete = oInit.whenComplete;
                }
                var aoDataAll = oInit.aoData;
                var ngCompile = oInit.ngCompile ? oInit.ngCompile : null;

                if (aoDataAll == null || aoDataAll.length == 0) {
                    aoDataAll = [{}];
                }
                var scrollControlShortEdgeDimension = null;
                var onCheckAllCallback = oInit.onCheckAllCallback;
                var onCallBackScroll = oInit.callBackScroll;
                var onSortCallBack = oInit.callBackSort;
                var onSearchCallBack = oInit.callBackSearch;
                var rowRenderFn = oInit.rowRenderFn;
                var bottomPositionReferenceElement = oInit.bottomPositionReferenceElement;
                $(bottomPositionReferenceElement).css('visibility', 'hidden');
                var isRowCountVisible = oInit.isRowCountVisible;
                var isSortable = (oInit.isSortable == null) ? true : oInit.isSortable;
                var isSearchBarVisible = oInit.isSearchBarVisible;
                var keyupTimeout = null;
                var opacityTimeout = null;
                var aoDataToSearch = aoDataAll;
                var aoDataToRender = aoDataAll;
                var numberOfRowsInChunk = 10; //dynamically determined later
                var numberOfChunks = Math.ceil(aoDataAll.length / numberOfRowsInChunk);
                var numberOfRowsInLastChunk = aoDataAll.length % numberOfRowsInChunk;
                var numberOfRowsToRender = aoDataAll.length;
                var rowHeight;

                var previousSearchString = "";
                var ssTableContainer;
                var tableChunkHTMLString = '<table class="tableChunk ssTableChunkTable" style="position:absolute; top:0px; table-layout:fixed;"><thead></thead><tbody class="tbodyTableChunk"></tbody></table>';
                var requiredDivHeight;
                var calculatedDivHeightToActualHeightRatio = 1;
                var useDivScrollScaling = false;
                var scrollCallBackIsBusy = false;
                var afterScrollCallback = null;
                var isSortBusy = false;
                var columnKeys = [];
                var tableHeader = null;
                var cookies = []; //we'll put our resize and order. What to do about sort direction and search terms? 
                var sumOfColumnMinWidths = null;
                var tdStyleArray = [];

                //$.each(aoDataAll[0], function (key, value) { columnKeys.push(key); });
                $(this).find('thead').find('tr').find('th').each(function (index) { //next 5 lines below are necessary in case width props are inherited
                    var minWidth = $(this).css('min-width'); //deprecated
                    ssTableValues.thWidthsArray.push(minWidth); //deprecated
                    y++;
                    //ssTableValues.thMinimumWidth = minWidth;
                    //ssTableValues.thWidth = minWidth;
                    //$($(tableHeader).find('thead').find('tr').find('th').get(index)).css('width', minWidth);
                    //$($(tableHeader).find('thead').find('tr').find('th').get(index)).css('min-width', minWidth);

                    //var maxWidth = $(this).css('max-width');
                    //ssTableValues.thMaximumWidth = maxWidth;
                    //console.log(ssTableValues.thMaximumWidth + " " + $(this).html());
                    //$($(tableHeader).find('thead').find('tr').find('th').get(index)).css('max-width', maxWidth);
                    //$.each(aoDataAll[0], function (key, value) { columnKeys.push(key); });
                    //var dataKey = $(this).attr('data-key');

                    /* if (dataKey != null && dataKey != '') {
                        columnKeys.push(dataKey);
                    } */

                });

                $.each(aoDataAll[0], function (key, value) { columnKeys.push(key); });

                $(this).after(
                    '<div class="ssTableWrapperDiv">' +
                        //'<input type="text" class="ssTableSearchInput notDisabledIfTabIsViewOnly" />' +
                        '<div class="bsInputPrepend divRowCell100 notDisabledIfTabIsViewOnly">' +
                            '<div class="bsButton"><i class="icon-search"></i></div>' +
                            '<input class="ssTableSearchInput" type="text">' +
                        '</div>' +
                        '<div class = "ssTableHeaderWrapperDiv" style="height:auto; overflow:hidden; top:0px; left:0px; position:absolute;">' +
                            '<table class="ssTableHeaderTable"><thead></thead><tbody></tbody></table>' +
                        '</div>' +
                        '<div class="ssTableViewDiv" style="height:0px; width:0px;' +
                            'background:#eeeeee; overflow-y:scroll; overflow-x:scroll; position:absolute; top:0px; left:0px; ">' +
                            '<div class="ssTableExpanderDiv" style="left:0px; top:0px; width:1px; height:0px; position:absolute;"></div>' +
                        '</div>' +
                        '<p class="ssTableRecordCountP" style="position:absolute; top:0px; right:10px;">Number of Rows:<span class = "spanRecordCount"></span></p>' +
                    '</div>');

                var inputSearch = $(this).siblings('.ssTableWrapperDiv').find('.ssTableSearchInput');
                var spanRecordCount = $(this).siblings('.ssTableWrapperDiv').find('.spanRecordCount');
                var pRecordCount = $(this).siblings('.ssTableWrapperDiv').find('.ssTableRecordCountP');

                $(inputSearch).hide();
                $(pRecordCount).hide();
                $(spanRecordCount).hide(); //child of p above. This line shouldn't be necessary but kept in because no time to check if code query's spans' visibility

                if (isSearchBarVisible) {
                    $(inputSearch).show();
                }

                if (isRowCountVisible) {
                    $(pRecordCount).show();
                    $(spanRecordCount).show(); //child of p above. This line shouldn't be necessary but kept in because no time to check if code query's spans' visibility
                }

                $(this).css('visibility', 'hidden');

                var divWrapper = $(this).siblings('.ssTableWrapperDiv');
                var divTableViewer = $(this).siblings('.ssTableWrapperDiv').find('.ssTableViewDiv');
                var tableHeader = $(this).siblings('.ssTableWrapperDiv').find('.ssTableHeaderTable');
                var divTableHeader = $(this).siblings('.ssTableWrapperDiv').find('.ssTableHeaderWrapperDiv');

                $(inputSearch).attr('id', 'inputSearch' + ($('.ssTableSearchInput').length - 1));
                $(divTableViewer).attr('id', 'divTableViewer' + ($('.ssTableViewDiv').length - 1));
                $(inputSearch).data('ssTable', $(this));
                $(divTableViewer).data('ssTable', $(this));
                $(tableHeader).data('ssTable', $(this));
                $(divTableHeader).data('ssTable', $(this));
                $(divTableHeader).data('ssTableId', $(this).attr('id'));

                var y = 0;
                var trHeaderClone = $(this).find('thead').find('tr').clone();
                $(tableHeader).find('thead').html(trHeaderClone);


                $(tableHeader).find('th').each(function () { //-- To do this block needs to be revisited

                    $(this).css('overflow', 'hidden');
                    $(this).css('white-space', 'nowrap');
                    var thisText = $(this).text();
                    thisText = $.trim(thisText);
                    var thisTextNbsp = thisText.split(' ').join('&nbsp;');
                    var thisHtml;
                    if ($(this).attr("data-column-type") == 'checkbox') {
                        //var trid = 'chk-' + $(this).attr("id");
                        var checkAllElement = $('<input type="checkbox" />');
                        checkAllElement.on('change', function () {
                            if (onCheckAllCallback) onCheckAllCallback($(this));
                        });

                        thisHtml = $(this).append(checkAllElement).html();

                    } else {
                        thisHtml = $(this).html(thisTextNbsp);
                    }
                    //var thisHtml = $(this).html(thisTextNbsp); //LP: sorry I realize this strip the developers HTML from their TH

                });

                //now detect if the browser is running on a MID and if it is then only keep the first 6 columns.
                var userAgent = navigator.userAgent;
                userAgent = userAgent.toLowerCase();
                var isMobileInternetDevice = false; //first assume the user is not using a MID


                //if (userAgent.indexOf('arm') != -1 || // risky as arm could accidentally match other terms
                //    userAgent.indexOf('ipad') != -1 ||
                //    userAgent.indexOf('ipod') != -1 ||
                //    userAgent.indexOf('iphone') != -1 ||
                //    userAgent.indexOf('android') != -1) {
                //    //var numberOfHeaders = $(tableHeader).find('th').length;

                //    //for (var i = 5; i < numberOfHeaders; ++i) {
                //    //    $($(tableHeader).find('th'ssss).get(i)).remove();
                //    //}


                //}
                if (isSortable != false) {
                    $(tableHeader).on('click', 'th', function () {
                        

                        if ($(this).attr('data-column-type') == 'checkbox') {
                            return;
                        }

                        if ($(this).find('.imgSwapLeft').length != 0 || $(this).find('.imgSwapRight').length != 0 || $(this).hasClass('nosort')) {
                            return;
                        }

                        var ssTable = $('#' + $(divTableHeader).data('ssTableId')); //LP 03/18/2014 workaround to bug when multiple tables present

                        if ($(ssTable).length == 0) {

                            ssTable = $(this).parents().find('.ssTableHeaderWrapperDiv').data('ssTable');
                        }

                        var isSortBusy = $(ssTable).data('ssTable').isSortBusy;

                        if (isSortBusy) {
                            return;
                        }

                        $(ssTable).data('ssTable').isSortBusy = true;

                        var columnIndex = $(this).parent().find('th').index(this);
                        var shouldSortNumerically = $(this).hasClass('jsShouldSortNumerically');
                        $(ssTable).data('ssTable').isSortBusy = true;

                        var divTableViewer = $(ssTable).data('ssTable').divTableViewer;
                        $(divTableViewer).css('opacity', '0.5');

                        var thisTableID = $(ssTable).attr('id');

                        $('#' + thisTableID).ssTable('sortByColumn', columnIndex, shouldSortNumerically);


                        if (typeof onSortCallBack != 'undefined') {
                            onSortCallBack();
                        }
                    });
                }
                $(tableHeader).find('th').each(function (index) {
                    if (index == 0 || index > $(tableHeader).find('th').length - 1) {
                        return;
                    }

                    var thLeftPosition = $(this).position().left;
                    var columnResizeDiv = $('<div class="ssTableResizeHandleDiv" style="position:absolute; top:0px; left:0px;  height:100%; ">&nbsp;</div>'); // transparent

                    $(this).parents('.ssTableHeaderWrapperDiv').append(columnResizeDiv);
                    $(columnResizeDiv).css('left', thLeftPosition - 10);
                    $(columnResizeDiv).data('thAdjacentLeft', $(tableHeader).find('th').get(index - 1));
                    $(columnResizeDiv).data('thAdjacentRight', $(tableHeader).find('th').get(index));
                });

                $(divTableHeader).on('mousedown', '.ssTableResizeHandleDiv', function () {
                    $('body').data('resizeHandle', $(this));
                    var divTableViewer = $(this).parents().find('.ssTableViewDiv');
                    $('body').data('divTableViewer', divTableViewer);
                    $('body').bind('mousemove', function (e) {
                        var mouseXOffset = e.pageX;
                        var thisResizeHandle = $(this).data('resizeHandle');
                        var divTableViewer = $(this).data('divTableViewer');
                        var thisLeftPosition = $(thisResizeHandle).position().left;
                        if ($(this).data('mouseXOffset') == null) {
                            $(this).data('mouseXOffset', mouseXOffset);
                        }
                        if ($(this).data('leftPosition') == null) {
                            $(this).data('leftPosition', thisLeftPosition);
                        }
                        var thAdjacentLeft = $(thisResizeHandle).data('thAdjacentLeft');
                        var thAdjacentRight = $(thisResizeHandle).data('thAdjacentRight');
                        if ($(this).data('thAdjacentLeftWidth') == null) {
                            $(this).data('thAdjacentLeftWidth', parseInt($(thAdjacentLeft).css('width')));
                        }
                        if ($(this).data('thAdjacentRightWidth') == null) {
                            $(this).data('thAdjacentRightWidth', parseInt($(thAdjacentRight).css('width')));
                        }

                        var mouseXDelta = e.pageX - $(this).data('mouseXOffset');
                        var thAdjacentLeftWidth = $(this).data('thAdjacentLeftWidth') + mouseXDelta;
                        var thAdjacentRightWidth = $(this).data('thAdjacentRightWidth') - mouseXDelta;
                        if (thAdjacentLeftWidth > 25 && thAdjacentRightWidth > 25) {
                            var thisResizeHandleLeft = $(this).data('leftPosition') + mouseXDelta;
                            $(thisResizeHandle).css('left', thisResizeHandleLeft);
                            $(thAdjacentLeft).css('width', thAdjacentLeftWidth);
                            $(thAdjacentRight).css('width', thAdjacentRightWidth);
                            var ssTable = $(thisResizeHandle).parent().data('ssTable');
                            $(ssTable).ssTable('resize');
                            //set a 2 second timeout to save the cookie with new widths
                            var ssTableID = $(ssTable).attr('id');
                            if ($(ssTable).data('saveCookieOnTimeout') != null) {
                                window.clearTimeout($(ssTable).data('saveCookieOnTimeout'));
                            }
                            var ssTableID = $(ssTable).attr('id');
                            $(ssTable).data('saveCookieOnTimeout',
                                window.setTimeout("$('#" + ssTableID + "').ssTable('saveUserPreferences');", 2000));
                        }
                    });
                });

                $(tableHeader).on('mousedown', 'th', function () {
                    

                    var ssTableID = $(divTableHeader).data('ssTableId'); //LP 03/18/2014 Not sure why this workaround is necessary -- solves problem when multiple tables are present

                    if ($('#' + ssTableID).length == 0) {
                        var ssTable = $(this).parents().find('.ssTableHeaderTable').data('ssTable');
                        ssTableID = $(ssTable).attr('id');
                    }

                    var thMousedownTimeout = setTimeout("$('#" + ssTableID + "').ssTable('onTHMouseDownTimeout');", 1000);
                    $('body').data('thMousedownTimeout', thMousedownTimeout);
                });

                $(document).bind('mouseup', function () {
                    

                    $('body').unbind('mousemove');
                    $('body').removeData('mouseXOffset');
                    $('body').removeData('leftPosition');
                    $('body').removeData('thAdjacentLeftWidth');
                    $('body').removeData('thAdjacentRightWidth');

                    var thMousedownTimeout = $('body').data('thMousedownTimeout');

                    if (thMousedownTimeout != null) {
                        window.clearTimeout(thMousedownTimeout);
                    }

                    $('body').removeData('thMousedownTimeout');
                });

                $(inputSearch).bind('keyup', function (e) {
                    var thisTable = $(this).data('ssTable');
                    var divTableViewer = $(thisTable).data('ssTable').divTableViewer;
                    var divTableViewerID = $(divTableViewer).attr('id');
                    var keyupTimeout = $(thisTable).data('ssTable').keyupTimeout;

                    if (keyupTimeout != null) {
                        window.clearTimeout($(thisTable).data('ssTable').keyupTimeout);
                        $(thisTable).data('ssTable').keyupTimeout = null;
                        $(divTableViewer).css('opacity', '1');
                    }

                    var opacityTimeout = $(thisTable).data('ssTable').opacityTimeout;

                    if (opacityTimeout != null) {
                        window.clearTimeout($(thisTable).data('ssTable').opacityTimeout);
                        $(thisTable).data('ssTable').opacityTimeout = null;
                        $(divTableViewer).css('opacity', '1');
                    }

                    $(thisTable).data('ssTable').opacityTimeout = window.setTimeout("$('#" + divTableViewerID + "').css('opacity', '0.5')", 450);
                    var thisTableID = $(thisTable).attr('id');

                    $(thisTable).data('ssTable').keyupTimeout = window.setTimeout("$('#" + thisTableID + "').ssTable('onKeyup')", 1500);
                });

                //$(inputSearch).bind('change', function() {
                //    //    $(this).trigger('keyup');
                //});

                $(divTableViewer).on('hover', 'td', function () {
                    var lastHoverTD = $(this).parent().data('lastHoverTD');

                    if (lastHoverTD == $(this)) {
                        return;
                    } //glitch prevention

                    $(this).parent().data('lastHoverTD', $(this));
                    var removeTimeout = $('#divViewTDOverflow').data('removeTimeout');

                    if (removeTimeout != null) {
                        window.clearTimeout(removeTimeout);
                    }

                    var thisHTML = $(this).html();

                    $(this).html('<span style="display:inline; width:auto;">' + thisHTML + '</span>');
                    var thisSpanOuterWidth = $(this).find('span').width();
                    var thisOuterWidth = $(this).outerWidth();

                    $(this).html(thisHTML);
                    var thisText = $(this).text();

                    if (thisSpanOuterWidth > thisOuterWidth) {
                        if ($('#divViewTDOverflow').length == 0) {
                            $('body').append('<div id = "divViewTDOverflow"></div>');
                        }

                        $('#divViewTDOverflow').text(thisText);
                        $('#divViewTDOverflow').show();

                        var offsetLeft = $(this).offset().left;
                        var offsetTop = $(this).offset().top;

                        $('#divViewTDOverflow').css('left', offsetLeft - 3);
                        $('#divViewTDOverflow').css('top', offsetTop + 1);
                        $('#divViewTDOverflow').data('removeTimeout', window.setTimeout("$('#divViewTDOverflow').hide();", 6000));
                    } else {
                        $('#divViewTDOverflow').hide();
                    }
                });

                $(divTableViewer).scroll(function () {
                    //console.log(new Date() + ' scrolling');
                    //check if tableChunk0 is present and if its position is wrong
                    var ssTable = $(this).data('ssTable');
                    var afterScrollCallback = $(ssTable).data('ssTable').afterScrollCallback;
                    //console.log("afterScrollCallback: "+ afterScrollCallback);
                    $(ssTable).data('ssTable').afterScrollCallback = null;

                    //the next 8 lines address an issue that when you scroll up the table may have a gap when you hit the first row
                    var firstTableChunk = $(this).find('.tableChunk').first();
                    //console.log("firstTableChunk: " + firstTableChunk);
                    if ($(firstTableChunk).attr('data-id') == 'tableChunk0') {
                        //console.log("firstTableChunk data-id: " + $(firstTableChunk).attr('data-id'));
                        var tableChunk0Top = $(firstTableChunk).position().top;
                        //console.log("tableChunk0Top: " + tableChunk0Top);
                        if (tableChunk0Top > 0) {
                            return;
                        }
                    }

                    $('#divViewTDOverflow').remove(); // just in case it is there
                    var numberOfRowsInChunk = $(ssTable).data('ssTable').numberOfRowsInChunk;
                    var rowHeight = $(ssTable).data('ssTable').rowHeight;
                    var lastTableChunkIndex = $(ssTable).data('ssTable').lastTableChunkIndex;
                    var numberOfChunks = $(ssTable).data('ssTable').numberOfChunks;
                    var divTableViewer = $(ssTable).data('ssTable').divTableViewer;
                    var tableHeader = $(ssTable).data('ssTable').tableHeader;
                    var scrollLeft = $(this).scrollLeft();
                    //console.log("numberOfRowsInChunk: " + numberOfRowsInChunk);
                    //console.log("rowHeight: " + rowHeight);
                    //console.log("lastTableChunkIndex: " + lastTableChunkIndex);
                    //console.log("numberOfChunks: " + numberOfChunks);
                    //console.log("divTableViewer: " + divTableViewer);
                    //console.log("tableHeader: " + tableHeader);
                    //console.log("scrollLeft: " + scrollLeft);

                    $(tableHeader).css('margin-left', scrollLeft * -1);
                    $(tableHeader).parent().find('.ssTableResizeHandleDiv').remove();
                    $(tableHeader).find('th').each(function (index) {

                        if (index == 0 || index > $(tableHeader).find('th').length - 1) {
                            //console.log("index == 0 || index > $(tableHeader).find('th').length - 1: ");
                            return;
                        }
                        var thLeftPosition = $(this).position().left;
                        var columnResizeDiv = $('<div class="ssTableResizeHandleDiv" style="position:absolute; top:0px; left:0px;  height:100%;"></div>'); // transparent
                        $(this).parents('.ssTableHeaderWrapperDiv').append(columnResizeDiv);
                        $(columnResizeDiv).css('left', thLeftPosition - 10);
                        $(columnResizeDiv).data('thAdjacentLeft', $(tableHeader).find('th').get(index - 1));
                        $(columnResizeDiv).data('thAdjacentRight', $(tableHeader).find('th').get(index));

                    });
                    //console.log("scrollCallBackIsBusy: " + $(ssTable).data('ssTable').scrollCallBackIsBusy);
                    if ($(ssTable).data('ssTable').scrollCallBackIsBusy) {
                        //console.log("scrollLeft: abort!");
                        return;
                    }

                    $(ssTable).data('ssTable').scrollCallBackIsBusy = true;
                    //TODO check if this was a horiz scroll event, if it was, then no need to do the rest.
                    var $this1 = $(this);
                    //var st = setTimeout(function() {


                    var scrollTop = $this1.scrollTop();
                    var scrollBottom = scrollTop + parseInt($this1.height());
                    //console.log("scrollTop: " + scrollTop);
                    //console.log("scrollBottom: " + scrollBottom);
                    var scrollCenter = (scrollTop + scrollBottom) / 2;
                    //console.log("scrollCenter: " + scrollCenter);
                    var percentScroll = scrollCenter / requiredDivHeight;
                    //console.log("percentScroll: " + percentScroll);
                    var firstTableChunkID = $(divTableViewer).find('table.tableChunk').first().attr('data-id');
                    var firstTableChunkIndex = firstTableChunkID.split('tableChunk').pop();

                    var lastTableChunkID = $(divTableViewer).find('table.tableChunk').last().attr('data-id');
                    var lastTableChunkIndex = lastTableChunkID.split('tableChunk').pop();

                    //console.log("firstTableChunkID: " + firstTableChunkID);
                    //console.log("firstTableChunkIndex: " + firstTableChunkIndex);
                    //console.log("lastTableChunkID: " + lastTableChunkID);                    
                    //console.log("lastTableChunkIndex: " + lastTableChunkIndex);


                    //check if tables are even visible, they aren't then refresh based on scroll position.
                    var topPositionOfFirstTable = parseInt($(divTableViewer).find('table.tableChunk').first().css('top'));
                    //console.log("topPositionOfFirstTable: " + topPositionOfFirstTable);
                    if (topPositionOfFirstTable > scrollBottom) {
                        //console.log("refreshViewAndPreserveScrollPosition0");
                        $(ssTable).ssTable('refreshViewAndPreserveScrollPosition');
                    }

                    var bottomPositionOfLastTable = parseInt($(divTableViewer).find('table.tableChunk').last().css('top')) + parseInt($(divTableViewer).find('table.tableChunk').last().outerHeight());

                    if (bottomPositionOfLastTable < scrollTop) {
                        //console.log("refreshViewAndPreserveScrollPosition1");
                        $(ssTable).ssTable('refreshViewAndPreserveScrollPosition');
                    }

                    if (scrollTop < numberOfRowsInChunk * rowHeight * 0.75 && firstTableChunkIndex != 0) {
                        //console.log("refreshViewAndPreserveScrollPosition2");
                        $(ssTable).ssTable('refreshViewAndPreserveScrollPosition');
                    }

                    if (scrollTop > requiredDivHeight - (numberOfRowsInChunk * rowHeight * 0.75) && lastTableChunkIndex != numberOfChunks - 1) {
                        //console.log("refreshViewAndPreserveScrollPosition3");
                        $(ssTable).ssTable('refreshViewAndPreserveScrollPosition');
                    }

                    var middleRowIndex = Math.round(numberOfRowsInChunk / 2);
                    var topPositionOfMiddleTable = parseInt($($(divTableViewer).find('table.tableChunk').get(1)).css('top'));
                    var bottomPositionOfMiddleTable = topPositionOfMiddleTable + $($(divTableViewer).find('table.tableChunk').get(1)).outerHeight();
                    var centerYPositionOfMiddleTable = topPositionOfMiddleTable + ($($(divTableViewer).find('table.tableChunk').get(1)).outerHeight()) / 2;
                    var scrollDirection = 0;
                    //console.log("middleRowIndex: " + middleRowIndex);
                    //console.log("topPositionOfMiddleTable: " + topPositionOfMiddleTable);
                    //console.log("bottomPositionOfMiddleTable: " + bottomPositionOfMiddleTable);
                    //console.log("centerYPositionOfMiddleTable: " + centerYPositionOfMiddleTable);
                    //console.log("scrollDirection: " + scrollDirection);
                    if (topPositionOfMiddleTable < scrollTop) {
                        scrollDirection = 1;
                    }

                    if (bottomPositionOfMiddleTable > scrollBottom) {
                        scrollDirection = -1;
                    }

                    if (centerYPositionOfMiddleTable < scrollTop && scrollDirection == 1) {
                        var lastTableChunkID = $(divTableViewer).find('table.tableChunk').last().attr('data-id');
                        var lastTableChunkIndex = lastTableChunkID.split('tableChunk').pop();
                        //console.log("lastTableChunkIndex tableChunk.pop(): " + lastTableChunkIndex);

                        if (lastTableChunkIndex < numberOfChunks - 1) {
                            //console.log("lastTableChunkIndex < numberOfChunks - 1");
                            var lastTableChunckTop = parseInt($(divTableViewer).find('table.tableChunk').last().css('top'));
                            $this1.append(tableChunkHTMLString);
                            $(divTableViewer).find('table.tableChunk').last().attr('data-id', 'tableChunk' + (lastTableChunkIndex * 1 + 1));
                            $(divTableViewer).find('table.tableChunk').last().css('top', lastTableChunckTop + numberOfRowsInChunk * rowHeight);
                            $(ssTable).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').last());
                            $(divTableViewer).find('table.tableChunk').first().remove();
                        }
                    }

                    if (centerYPositionOfMiddleTable > scrollBottom && scrollDirection == -1) {
                        var firstTableChunkID = $(divTableViewer).find('table.tableChunk').first().attr('data-id');
                        var firstTableChunkIndex = firstTableChunkID.split('tableChunk').pop();
                        //console.log("lastTableChunkIndex tableChunk.pop(): " + firstTableChunkIndex);
                        if (firstTableChunkIndex > 0) {
                            //console.log("firstTableChunkIndex > 0");
                            var firstTableChunckTop = parseInt($(divTableViewer).find('table.tableChunk').first().css('top'));
                            $this1.prepend(tableChunkHTMLString);
                            $(divTableViewer).find('table.tableChunk').first().attr('data-id', 'tableChunk' + (firstTableChunkIndex * 1 - 1));
                            $(divTableViewer).find('table.tableChunk').first().css('top', firstTableChunckTop - numberOfRowsInChunk * rowHeight);
                            $(ssTable).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').first());
                            $(divTableViewer).find('table.tableChunk').last().remove();
                        }
                    }

                    $(ssTable).data('ssTable').scrollCallBackIsBusy = false;
                    $(ssTable).ssTable('_onScrollAdjustVertScrollSliderPosition', $this1);

                    if (typeof (afterScrollCallback) == 'function') {
                        afterScrollCallback();
                    }

                    $(divTableViewer).css('opacity', 1);
                    //console.log("done -------------------------");
                    //}, 1000);
                    if (typeof onCallBackScroll != 'undefined') {
                        onCallBackScroll();
                    }
                });

                $(document).bind('mouseup', function (e) {
                    var ssTable = $(document).data('ssTable');

                    if (ssTable == null) {
                        return;
                    }

                    $(ssTable).ssTable('_cancelMousemoveEvent');
                    $(document).data('ssTable', null);
                    return;
                });

                var divVertScrollSlider = null;
                var divHorizScrollSlider = null;

                if (!data) {
                    $(this).data('ssTable', {
                        target: $this,
                        aoDataAll: aoDataAll,
                        ngCompile: ngCompile,
                        rowRenderFn: rowRenderFn,
                        aoDataToSearch: aoDataToSearch,
                        whenComplete: whenComplete,
                        aoDataToRender: aoDataToRender,
                        bottomPositionReferenceElement: bottomPositionReferenceElement,
                        columnKeys: columnKeys,
                        numberOfRowsInChunk: numberOfRowsInChunk,
                        numberOfChunks: numberOfChunks,
                        numberOfRowsInLastChunk: numberOfRowsInLastChunk,
                        numberOfRowsToRender: numberOfRowsToRender,
                        rowHeight: rowHeight,
                        previousSearchString: previousSearchString,
                        ssTableContainer: ssTableContainer,
                        tableChunkHTMLString: tableChunkHTMLString,
                        requiredDivHeight: requiredDivHeight,
                        calculatedDivHeightToActualHeightRatio: calculatedDivHeightToActualHeightRatio,
                        useDivScrollScaling: useDivScrollScaling,
                        scrollCallBackIsBusy: scrollCallBackIsBusy,
                        afterScrollCallback: afterScrollCallback,
                        isSortBusy: isSortBusy,
                        inputSearch: inputSearch,
                        spanRecordCount: spanRecordCount,
                        divTableViewer: divTableViewer,
                        divWrapper: divWrapper,
                        sumOfColumnMinWidths: sumOfColumnMinWidths,
                        tableHeader: tableHeader,
                        divTableHeader: divTableHeader,
                        divVertScrollSlider: divVertScrollSlider,
                        divHorizScrollSlider: divHorizScrollSlider,
                        scrollControlShortEdgeDimension: scrollControlShortEdgeDimension,
                        tdStyleArray: tdStyleArray,
                        onSearchCallBack: onSearchCallBack
                    });
                }

                $(this).ssTable('initializeTables', false);
                $(this).ssTable('loadUserPreferences'); //In devel mode the cookie  makes debug difficult
                $(this).ssTable('scrollToRow', 0);
                $(this).ssTable('_appendScrollControls');

                var thisId = $(this).attr('id');
                var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
                if (isChrome) {
                    evalString = "$(window).bind('resize', function() {$('#" + thisId + "').ssTable('resize'); $('#" + thisId + "').ssTable('refreshViewAndPreserveScrollPosition');});";
                } else {
                    evalString = "$(window).bind('resize', function() {$('#" + thisId + "').ssTable('resize');});";
                }
                eval(evalString);
                $(this).ssTable('resize');
                //next lines check for empty table bug

                var aoDataAll = $(this).data('ssTable').aoDataAll;
                var dataLength = aoDataAll != null ? aoDataAll.length : 0;
                var divTableViewer = $(this).data('ssTable').divTableViewer;
                var trLength = $(divTableViewer).find('tr').length;
                if (dataLength > 0 && trLength == 0) {
                    $(this).ssTable('initializeTables');
                }

                //$('#viewContent').fli('init');
            });
        },

        _appendScrollControls: function () {
            var ssTableViewDiv = $(this).data('ssTable').divTableViewer;
            var ssTableViewDivHeight = $(ssTableViewDiv).outerHeight();
            var ssTableViewDivTop = $(ssTableViewDiv).position().top;
            var ssTableWrapperDiv = $(this).data('ssTable').divWrapper;
            var scrollControlLongEdgeDimension = 32;
            var scrollControlShortEdgeDimension = $(this).ssTable('_getCurrentBrowserScrollbarWidth');
            var wrapperId = $(this).parent().attr('id');

            $(ssTableWrapperDiv).append(
                '<div class="ssTableVertScrollbarDiv" style ="position:absolute; right:0px; background-color:#F0F0F0"></div>'
            );

            var ssTableVertScrollbarDiv = $('#' + wrapperId).find('.ssTableVertScrollbarDiv');

            $(ssTableVertScrollbarDiv).css('top', ssTableViewDivTop);
            $(ssTableVertScrollbarDiv).css('width', scrollControlShortEdgeDimension);

            $(ssTableVertScrollbarDiv).append(
                //'<div class="ssTableScrollbarPageUpOrDown" style="font-size:8px; top:0px; right:0px; bottom:0px; left:0px; position:absolute; text-align:center; overflow:hidden; ' +
                  //  '">&nbsp;</div>'
                '<div class="ssTableScrollbarPageUpOrDown" style="top:0px; right:0px; bottom:0px; left:0px;">&nbsp;</div>'
            );

            $(ssTableVertScrollbarDiv).append(
                //'<div class="ssTableScrollUpDiv" style="font-size:8px; top:0px; right:0px; position:absolute; text-align:center; overflow:hidden; ' +
                //    'background:url(\'/Images/uparrow.png\') no-repeat center; background-color:#F6F6F6;' +
                //    '">&nbsp;</div>'
                '<div class="ssTableScrollUpDiv"></div>'
            );

            $(ssTableVertScrollbarDiv).find('.ssTableScrollUpDiv').css('width', scrollControlShortEdgeDimension);
            $(ssTableVertScrollbarDiv).find('.ssTableScrollUpDiv').css('height', scrollControlLongEdgeDimension);

            $(ssTableVertScrollbarDiv).append(
                //'<div class="ssTableScrollDownDiv" style="font-size:8px; bottom:0px; right:0px; position:absolute; text-align:center;  overflow:hidden; ' +
                //    'background:url(\'/Images/downarrow.png\') no-repeat center; background-color:#F6F6F6;' +
                //    '">&nbsp;</div>'
                '<div class="ssTableScrollDownDiv"></div>'
            );

            $(ssTableVertScrollbarDiv).find('.ssTableScrollDownDiv').css('width', scrollControlShortEdgeDimension);
            $(ssTableVertScrollbarDiv).find('.ssTableScrollDownDiv').css('height', scrollControlLongEdgeDimension);

            $(ssTableVertScrollbarDiv).append(
                //'<div class="ssTableVertScrollSliderDiv" style="font-size:8px; background-color:#CFCFCF; top:32px; right:0px; position:absolute;">' +
                //    '&nbsp;' +
                //    '</div>'
                '<div class="ssTableVertScrollSliderDiv" style="top:32px;">&nbsp;</div>'
            );

            $(ssTableVertScrollbarDiv).find('.ssTableVertScrollSliderDiv').css('width', scrollControlShortEdgeDimension);
            var ssTableVertScrollbarSliderDivHeight = (ssTableViewDivHeight - scrollControlShortEdgeDimension - scrollControlLongEdgeDimension - scrollControlLongEdgeDimension) * (ssTableViewDivHeight / $(ssTableViewDiv).find('.ssTableExpanderDiv').outerHeight());
            ssTableVertScrollbarSliderDivHeight = Math.max(ssTableVertScrollbarSliderDivHeight, 32);
            $(ssTableVertScrollbarDiv).find('.ssTableVertScrollSliderDiv').css('height', ssTableVertScrollbarSliderDivHeight);

            //Append horizontal UI controls
            $(ssTableWrapperDiv).append(
                //'<div class="ssTableHorizScrollbarDiv" style ="position:absolute; left:0px; background-color:#F0F0F0;"></div>'
                '<div class="ssTableHorizScrollbarDiv" style ="left:0px;"></div>'
            );

            var ssTableHorizScrollbarDiv = $(ssTableWrapperDiv).find('.ssTableHorizScrollbarDiv');
            $(ssTableHorizScrollbarDiv).css('height', scrollControlShortEdgeDimension);

            $(ssTableHorizScrollbarDiv).append(
                '<div class="ssTableScrollLeftDiv" style="font-size:8px; background-color:#F6F6F6; top:0px; left:0px; position:absolute; overflow:hidden; text-align:center; ' +
                    'background:url(\'/Images/leftarrow.png\') no-repeat center; background-color:#F6F6F6;' +
                    '"></div>'
            );

            $(ssTableHorizScrollbarDiv).find('.ssTableScrollLeftDiv').css('width', scrollControlLongEdgeDimension);
            $(ssTableHorizScrollbarDiv).find('.ssTableScrollLeftDiv').css('height', scrollControlShortEdgeDimension);

            $(ssTableHorizScrollbarDiv).append(
                '<div class="ssTableScrollRightDiv" style="font-size:8px; background-color:#F6F6F6; bottom:0px; right:0px; position:absolute; overflow:hidden;  text-align:center;' +
                    'background:url(\'/Images/rightarrow.png\') no-repeat center; background-color:#F6F6F6;' +
                    '"></div>'
            );

            $(ssTableHorizScrollbarDiv).find('.ssTableScrollRightDiv').css('width', scrollControlLongEdgeDimension);
            $(ssTableHorizScrollbarDiv).find('.ssTableScrollRightDiv').css('height', scrollControlShortEdgeDimension);

            $(ssTableHorizScrollbarDiv).append(
                '<div class="ssTableHorizScrollSliderDiv" style="font-size:8px; background-color:#CFCFCF; top:0px; left:32px; position:absolute;">&nbsp;</div>'
            );

            $(ssTableHorizScrollbarDiv).find('.ssTableHorizScrollSliderDiv').css('height', scrollControlShortEdgeDimension);
            $(this).ssTable('_bindClickToScrollArrows');
            $(this).ssTable('_bindScrollSliderMouseEvents');
            $(this).data('ssTable').divVertScrollSlider = $(ssTableVertScrollbarDiv).find('.ssTableVertScrollSliderDiv');
            $(this).data('ssTable').divHorizScrollSlider = $(ssTableHorizScrollbarDiv).find('.ssTableHorizScrollSliderDiv');

            if ($('.ssTableViewDiv').height() < 150) {
                $('#' + wrapperId + ' .ssTableVertScrollSliderDiv').css('cssText', $('#' + wrapperId + ' .ssTableVertScrollSliderDiv').attr('style') + 'top:' + scrollControlLongEdgeDimension + 'px;');
                $('#' + wrapperId + ' .ssTableScrollUpDiv').css('cssText', $('#' + wrapperId + ' .ssTableScrollUpDiv').attr('style') + 'height:' + scrollControlLongEdgeDimension + 'px !important;');
                $('#' + wrapperId + ' .ssTableScrollDownDiv').css('cssText', $('#' + wrapperId + ' .ssTableScrollDownDiv').attr('style') + 'height:' + scrollControlLongEdgeDimension + 'px !important;');
            }
        },

        _bindClickToScrollArrows: function () {
            var ssTableWrapperDiv = $(this).data('ssTable').divWrapper;
            var ssTableVertScrollbarDiv = $(ssTableWrapperDiv).first().find('.ssTableVertScrollbarDiv');
            var ssTableHorizScrollbarDiv = $(ssTableWrapperDiv).first().find('.ssTableHorizScrollbarDiv');

            $(ssTableVertScrollbarDiv).find('.ssTableScrollDownDiv').bind('click', function () {
                var ssTable = $(this).parents('.ssTableWrapperDiv').parent().children('table');
                var divTableViewer = $(ssTable).data('ssTable').divTableViewer;
                var scrollTop = $(divTableViewer).scrollTop();
                $(divTableViewer).scrollTop(scrollTop + $(ssTable).data('ssTable').rowHeight);
            });

            $(ssTableVertScrollbarDiv).find('.ssTableScrollUpDiv').bind('click', function () {
                var ssTable = $(this).parents('.ssTableWrapperDiv').parent().children('table');
                var divTableViewer = $(ssTable).data('ssTable').divTableViewer;
                var scrollTop = $(divTableViewer).scrollTop();
                $(divTableViewer).scrollTop(scrollTop - $(ssTable).data('ssTable').rowHeight);
            });

            $(ssTableVertScrollbarDiv).find('.ssTableScrollbarPageUpOrDown').bind('click', function (e) {
                var clickTop = e.pageY;
                var vertScrollSliderTop = $(this).siblings('.ssTableVertScrollSliderDiv').offset().top;
                var ssTable = $(this).parents('.ssTableWrapperDiv').parent().children('table');
                var divTableViewer = $(ssTable).data('ssTable').divTableViewer;
                var scrollTop = $(divTableViewer).scrollTop();
                var divTableViewerHeight = $(divTableViewer).outerHeight() - $(ssTable).ssTable('_getCurrentBrowserScrollbarWidth');

                if (clickTop < vertScrollSliderTop) {
                    $(divTableViewer).scrollTop(scrollTop - divTableViewerHeight);
                } else {
                    $(divTableViewer).scrollTop(scrollTop + divTableViewerHeight);
                }
            });

            $(ssTableHorizScrollbarDiv).find('.ssTableScrollRightDiv').bind('click', function () {
                var scrollSlider = $(this).parent().find('.ssTableHorizScrollSliderDiv');
                var deltaX = $(scrollSlider).outerWidth();
                var thisSSTable = $(this).parents('.ssTableWrapperDiv').parent().children('table');
                $(thisSSTable).ssTable('_onMoveHorizSliderPosition', scrollSlider, deltaX);
            });

            $(ssTableHorizScrollbarDiv).find('.ssTableScrollLeftDiv').bind('click', function () {
                var scrollSlider = $(this).parent().find('.ssTableHorizScrollSliderDiv');
                var deltaX = $(scrollSlider).outerWidth();
                var thisSSTable = $(this).parents('.ssTableWrapperDiv').parent().children('table');
                $(thisSSTable).ssTable('_onMoveHorizSliderPosition', scrollSlider, -deltaX);
            });
        },

        _bindScrollSliderMouseEvents: function () {
            var ssTableWrapperDiv = $(this).data('ssTable').divWrapper;
            var ssTableVertScrollbarDiv = $(ssTableWrapperDiv).first().find('.ssTableVertScrollbarDiv');
            var ssTableHorizScrollbarDiv = $(ssTableWrapperDiv).first().find('.ssTableHorizScrollbarDiv');

            $(ssTableVertScrollbarDiv).find('.ssTableVertScrollSliderDiv').bind('mouseup', function (e) {
                var ssTable = $(this).parents('.ssTableWrapperDiv').parent().children('table');
                $(ssTable).ssTable('_cancelMousemoveEvent');
            });

            $(ssTableVertScrollbarDiv).find('.ssTableVertScrollSliderDiv').bind('mousedown', function (e) {
                var ssTableWrapperDivParent = $(this).parents().find('.ssTableWrapperDiv');
                var thisSSTable = $(this).parents('.ssTableWrapperDiv').parent().children('table');
                var divTableViewer = $(thisSSTable).data('ssTable').divTableViewer;

                $(divTableViewer).css('opacity', '0.5');
                $(thisSSTable).ssTable('_disableTextSelection', ssTableWrapperDivParent);

                var scrollSlider = $(this);

                $(document).data('scrollSlider', scrollSlider);
                $(document).data('initialMouseXPosition', e.pageX);
                $(document).data('ssTable', thisSSTable);
                $(document).unbind('mousemove');
                $(document).bind('mousemove', function (e) {
                    e.stopPropagation;
                    var mouseDownYPosition = e.pageY;
                    var scrollSlider = $(document).data('scrollSlider');
                    var thisSSTable = $(scrollSlider).parents('.ssTableWrapperDiv').parent().children('table');
                    var initialMouseXPosition = $(document).data('initialMouseXPosition');
                    var currentMouseXPosition = e.pageX;
                    var currentMouseYPosition = e.pageY;
                    var currentSliderTop = $(scrollSlider).offset().top;
                    var currentSliderBottom = $(scrollSlider).offset().top + $(scrollSlider).outerHeight;
                    if (Math.abs(currentMouseYPosition - currentSliderBottom) > 128) {
                        $(thisSSTable).ssTable('_cancelMousemoveEvent');
                        return;
                    }
                    if (Math.abs(currentSliderTop - currentMouseYPosition) > 128) {
                        $(thisSSTable).ssTable('_cancelMousemoveEvent');
                        return;
                    }
                    if (Math.abs(initialMouseXPosition - currentMouseXPosition) > 48) {
                        $(thisSSTable).ssTable('_cancelMousemoveEvent');
                        return;
                    }
                    var lastMouseDownYPosition = $(scrollSlider).data('lastMouseDownYPosition');
                    if (lastMouseDownYPosition != null) {
                        var deltaY = mouseDownYPosition - lastMouseDownYPosition;
                        (thisSSTable).ssTable('_onMoveVertSliderPosition', scrollSlider, deltaY);
                    }

                    $(scrollSlider).data('lastMouseDownYPosition', mouseDownYPosition);
                    var lastSliderTop = $(scrollSlider).data('lastSliderTop');
                    $(scrollSlider).data('lastSliderTop', currentSliderTop);
                    if (lastSliderTop == currentSliderTop) {
                        $(divTableViewer).css('opacity', '1');
                    } else {
                        $(divTableViewer).css('opacity', '0.5');
                    }

                });
                $(this).css('background-color', '#8F8F8F');
            });

            $(ssTableHorizScrollbarDiv).find('.ssTableHorizScrollSliderDiv').bind('mousedown', function (e) {
                var ssTableWrapperDivParent = $(this).parents().find('.ssTableWrapperDiv');
                var thisSSTable = $(this).parents('.ssTableWrapperDiv').parent().children('table');
                $(thisSSTable).ssTable('_disableTextSelection', ssTableWrapperDivParent);
                var scrollSlider = $(this);
                $(document).data('scrollSlider', scrollSlider);
                $(document).data('initialMouseYPosition', e.pageY);
                $(document).bind('mousemove', function (e) {
                    e.stopPropagation;
                    var mouseDownXPosition = e.pageX;
                    var scrollSlider = $(document).data('scrollSlider');
                    var thisSSTable = $(scrollSlider).parents('.ssTableWrapperDiv').parent().children('table');
                    var initialMouseYPosition = $(document).data('initialMouseYPosition');
                    var currentMouseYPosition = e.pageY;
                    if (Math.abs(initialMouseYPosition - currentMouseYPosition) > 48) {
                        $(thisSSTable).ssTable('_cancelMousemoveEvent');
                    }
                    var lastMouseDownXPosition = $(scrollSlider).data('lastMouseDownXPosition');
                    if (lastMouseDownXPosition != null) {
                        var deltaX = mouseDownXPosition - lastMouseDownXPosition;
                        $(thisSSTable).ssTable('_onMoveHorizSliderPosition', scrollSlider, deltaX);
                    }
                    $(scrollSlider).data('lastMouseDownXPosition', mouseDownXPosition);
                });
                $(this).css('background-color', '#8F8F8F');
            });
        },

        _cancelMousemoveEvent: function () {
            $(document).unbind('mousemove');
            var scrollSlider = $(document).data('scrollSlider');

            if (scrollSlider == null) {
                return;
            }

            $(scrollSlider).data('lastMouseDownYPosition', null);
            $(scrollSlider).data('lastMouseDownXPosition', null);
            $(scrollSlider).css('background-color', '#CFCFCF');

            var ssTableWrapperDivParent = $(scrollSlider).parents().find('.ssTableWrapperDiv');
            var thisSSTable = $(scrollSlider).parents('.ssTableWrapperDiv').parent().children('table');
            var divTableViewer = $(thisSSTable).data('ssTable').divTableViewer;

            $(divTableViewer).css('opacity', '1');
            $(thisSSTable).ssTable('_enableTextSelection', ssTableWrapperDivParent);
            $(document).unbind('mousemove');
            $(document).data('lastScrollToRowIndex', null);
            $(document).data('scrollSlider', null);
        },

        _disableTextSelection: function (ssTableWrapperDiv) {
            $('body').bind('selectstart', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        },

        _enableTextSelection: function (ssTableWrapperDiv) {
            $('body').unbind('selectstart');
        },

        _onMoveVertSliderPosition: function (scrollSlider, deltaY) {
            var thisTop = $(scrollSlider).position().top;
            var newTopPosition = thisTop + deltaY;
            var scrollSliderParent = $(scrollSlider).parent();
            var minScrollSliderTop = $(scrollSliderParent).find('.ssTableScrollUpDiv').outerHeight();

            var maxScrollSliderTop = $(scrollSliderParent).outerHeight() -
                $(scrollSliderParent).find('.ssTableScrollDownDiv').outerHeight() -
                $(scrollSlider).outerHeight();

            newTopPosition = Math.max(minScrollSliderTop, newTopPosition);
            newTopPosition = Math.min(maxScrollSliderTop, newTopPosition);
            $(scrollSlider).css('top', newTopPosition);

            //determine the percent range of the scroll bar.
            var totalSliderRange = maxScrollSliderTop - minScrollSliderTop;
            var adjustedSliderPosition = newTopPosition - minScrollSliderTop;
            var percentScroll = adjustedSliderPosition / totalSliderRange;

            percentScroll = Math.round(percentScroll * 1000) / 1000;
            $(document).data('lastScrollToRowIndex', null);

            var ssTableViewDiv = $(scrollSlider).parents('.ssTableWrapperDiv').find('.ssTableViewDiv');
            var ssTableViewDivScrollHeight = $(ssTableViewDiv)[0].scrollHeight;
            var scrollControlShortEdgeDimension = $(this).ssTable('_getCurrentBrowserScrollbarWidth');
            //LP I had trouble with the line below. Todo consider the height of ssTableExpanderDiv and realize that windows will let you scroll past the actual height but Mac will not. 

            $(ssTableViewDiv).scrollTop(percentScroll * (ssTableViewDivScrollHeight + scrollControlShortEdgeDimension - ($(ssTableViewDiv).outerHeight() - scrollControlShortEdgeDimension)));
        },

        _onMoveHorizSliderPosition: function (scrollSlider, deltaX) {
            var thisLeft = $(scrollSlider).position().left;
            var newLeftPosition = thisLeft + deltaX;
            var scrollSliderParent = $(scrollSlider).parent();
            var minScrollSliderLeft = $(scrollSliderParent).find('.ssTableScrollLeftDiv').outerWidth();

            var maxScrollSliderLeft = $(scrollSliderParent).outerWidth() -
                $(scrollSliderParent).find('.ssTableScrollRightDiv').outerWidth() -
                $(scrollSlider).outerWidth();

            newLeftPosition = Math.max(minScrollSliderLeft, newLeftPosition);
            newLeftPosition = Math.min(maxScrollSliderLeft, newLeftPosition);
            $(scrollSlider).css('left', newLeftPosition);

            var totalSliderRange = maxScrollSliderLeft - minScrollSliderLeft;
            var adjustedSliderPosition = newLeftPosition - minScrollSliderLeft;
            var percentScroll = adjustedSliderPosition / totalSliderRange;
            var ssTableViewDiv = $(scrollSlider).parents('.ssTableWrapperDiv').find('.ssTableViewDiv');
            var scrollControlShortEdgeDimension = $(this).ssTable('_getCurrentBrowserScrollbarWidth');
            $(ssTableViewDiv).scrollLeft(percentScroll * ($(ssTableViewDiv)[0].scrollWidth - $(ssTableViewDiv).outerWidth() + scrollControlShortEdgeDimension));
        },

        refresh: function (aoData) {
            if ($(this).data('ssTable') == null) {
                return;
            }
            var columnKeys = [];

            if (aoData == null || aoData.length == 0) {
                aoData = [];
                $(this).data('ssTable').aoDataAll = [{}];
                $(this).data('ssTable').aoDataToSearch = [{}];
                $(this).data('ssTable').aoDataToRender = [{}];
            } else {
                $.each(aoData[0], function (key, value) { columnKeys.push(key); });
                $(this).data('ssTable').aoDataAll = aoData;
                $(this).data('ssTable').aoDataToSearch = aoData;
                $(this).data('ssTable').aoDataToRender = aoData;
            }

            $(this).data('ssTable').columnKeys = columnKeys;
            $(this).ssTable('initializeTables', false);
            $(this).ssTable('scrollToRow', 0);
            $(this).ssTable('resize');
            $(this).ssTable('_onMoveVertSliderPosition', $(this).data('ssTable').divVertScrollSlider, 0); //clean up scrollbar weirdness

            //next lines check for empty table bug
            var aoDataAll = $(this).data('ssTable').aoDataAll;
            var dataLength = aoDataAll != null ? aoDataAll.length : 0;
            var divTableViewer = $(this).data('ssTable').divTableViewer;
            var trLength = $(divTableViewer).find('tr').length;
            if (dataLength > 0 && trLength == 0) {
                $(this).ssTable('initializeTables');
            }
        },

        scrollToRowByKeyValuePair: function (key, value, afterScrollCallback) {
            if ($(this).data('ssTable') == null) {
                return; //bad caller. Did you init first ?
            }

            if (typeof (afterScrollCallback) != 'function') {
                afterScrollCallback = function () { };
            }

            var rowIndex = null;

            var aoDataToRender = $(this).data('ssTable').aoDataToRender;

            if (aoDataToRender == null || aoDataToRender.length == 0) {
                return;
            }

            var isKeyValid = false;
            var pKey = key;
            $.each(aoDataToRender[0], function (key, value) {
                if (key == pKey) {
                    isKeyValid = true;
                }
            });

            if (isKeyValid == false) {
                return;
            }


            for (var i = 0; i < aoDataToRender.length; i++) {
                var item = aoDataToRender[i];
                var propertyValue = eval('item.' + key);
                if (propertyValue == value) {
                    rowIndex = i;
                    break;
                }
            }

            if (rowIndex == null) {
                return; // didn't find a match
            }

            var divTableViewer = $(this).data('ssTable').divTableViewer;
            var rowHeight = $(this).data('ssTable').rowHeight;
            var scrollTop = $(divTableViewer).scrollTop();
            var rowTop = rowHeight * rowIndex;

            //it was determined that the scrolled to row is a little easier to notice if it isn't at the top of the table.
            //so we push it down a few rows when possible.
            if (rowTop > scrollTop && rowTop < scrollTop + ($(divTableViewer).outerHeight() - rowHeight)) {
                afterScrollCallback();
            } else {
                $(this).data('ssTable').afterScrollCallback = afterScrollCallback;
                var rowTopBias = Math.max(-1 * $(divTableViewer).outerHeight() / 2 + rowHeight, -1 * rowIndex * rowHeight);
                rowTop = rowTop + rowTopBias;
                $(divTableViewer).scrollTop(rowTop); //this may or may not trigger a scroll (and .trigger('scroll') doesn't force execution of the event handler either -- so whoever executes afterScrollCallback should delete it after use to prevent multiple executions.
                afterScrollCallback = $(this).data('ssTable').afterScrollCallback; //yes! this is intentional -- look in the scroll event handler
                if (typeof (afterScrollCallback) == 'function') {
                    afterScrollCallback();
                    // $(this).data('ssTable').afterScrollCallback = null; //LP: I tried to get this right -- adding to back log
                }
            }

            return;
        },

        scrollToRow: function (rowIndex) {
            //issue: this method removes all filters and searches  
            //putting in a patch for scroll to first row and last row -- see below
            if ($(this).data('ssTable') == null) { }

            if (rowIndex == null) {
                return;
            }

            //lastScrollToRowIndex below is set in the _onMoveVertSliderPosition handler.
            //the code below is really to ensure the display doesn't keep refreshing if 
            //the user has already scrolled to the top or bottom
            var lastScrollToRowIndex = $(document).data('lastScrollToRowIndex'); //would have been better to call it previousScr...Index

            if (lastScrollToRowIndex == rowIndex) {
                return;
            }

            $(document).data('lastScrollToRowIndex');
            var inputSearch = $(this).data('ssTable').inputSearch;
            var aoDataAll = $(this).data('ssTable').aoDataAll;

            if (rowIndex > aoDataAll.length - 1) {
                return;
            }

            var divTableViewer = $(this).data('ssTable').divTableViewer;
            $(this).ssTable('initializeNumberOfRowsInChunkAndRowHeight');
            var numberOfRowsInChunk = $(this).data('ssTable').numberOfRowsInChunk;
            var tableChunkHTMLString = $(this).data('ssTable').tableChunkHTMLString;
            var rowHeight = $(this).data('ssTable').rowHeight;

            //$(inputSearch).val('');
            $(this).data('ssTable').aoDataToSearch = $(this).data('ssTable').aoDataAll;
            $(this).data('ssTable').aoDataToRender = $(this).data('ssTable').aoDataAll;
            var totalNumberOfRows = aoDataAll.length;
            var numberOfChunks = Math.ceil(totalNumberOfRows / numberOfRowsInChunk);
            var rowChunkIndex = Math.floor(rowIndex / numberOfRowsInChunk) + 1;

            if (rowChunkIndex < 1) {
                rowChunkIndex = 1;
            }

            $(divTableViewer).find('table.tableChunk').each(function () { $(this).remove(); });
            $(divTableViewer).append(tableChunkHTMLString);
            $(divTableViewer).append(tableChunkHTMLString);
            $(divTableViewer).append(tableChunkHTMLString);
            $($(divTableViewer).find('table.tableChunk').get(0)).attr('data-id', 'tableChunk' + (rowChunkIndex * 1 - 1));
            $($(divTableViewer).find('table.tableChunk').get(1)).attr('data-id', 'tableChunk' + rowChunkIndex);
            $($(divTableViewer).find('table.tableChunk').get(2)).attr('data-id', 'tableChunk' + (rowChunkIndex * 1 + 1));
            $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').get(0));
            $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').get(1));
            $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').get(2));
            // $(divTableViewer).scrollTop(rowIndex % numberOfRowsInChunk * rowHeight + rowHeight);// + 1000);// + rowHeight);
            //if row is in last chunk and last chunk doesn't have numberOfRowsInChunk
            var numberOfRowsInLastChunk = totalNumberOfRows % numberOfRowsInChunk;
            var isTargetRowInLastChunk = false;

            if (rowIndex > (numberOfChunks - 1) * numberOfRowsInChunk - 1) {
                isTargetRowInLastChunk = true;
            }

            if (isTargetRowInLastChunk && numberOfRowsInLastChunk != numberOfRowsInChunk) {
                $(divTableViewer).scrollTop(rowIndex % numberOfRowsInChunk * rowHeight + $(this).ssTable('_getCurrentBrowserScrollbarWidth'));
            } else {
                $(divTableViewer).scrollTop(rowIndex % numberOfRowsInChunk * rowHeight);
            }

            $(this).ssTable('refreshScrollPositionAndPreserveView');
        },

        onTHMouseDownTimeout: function () {
            //add a left & right arrow image to each header 
            var tableHeader = $(this).data('ssTable').tableHeader;
            var ssTable = $(this);
            var ssTableID = $(ssTable).attr('id');
            window.setTimeout("$('#" + ssTableID + "').ssTable('endTHMouseDownEvent');", 3000);
            var divTableHeader = $(this).data('ssTable').divTableHeader;
            $(divTableHeader).find('.ssTableResizeHandleDiv').css('visibility', 'hidden');

            $(tableHeader).find('th').each(function (index) {
                var thisHTML = $(this).html();
                $(this).css('overflow', 'visible');
                var leftHTML = '<img class="imgSwapLeft" style="margin-left:-16px;margin-right:10px;"src = "../../Content/images/collapse.png">'
                var rightHTML = '<img class="imgSwapRight" style="margin-left:10px;margin-right:10px;" src = "../../Content/images/expand.png">';

                if (index == 0) {
                    leftHTML = '';
                }

                if (index == $(this).parent().find('th').length - 1) {
                    rightHTML = "";
                }

                $(this).html(leftHTML + thisHTML + rightHTML);
            });

            //set the timer to remove in 2 seconds
            $('.imgSwapRight').bind('click', function () {
                var thisTH = $(this).parent();
                var thisTHParent = $(thisTH).parent();
                var tableHeaderWrapperDiv = $(this).parents().find('.ssTableHeaderWrapperDiv');
                var thIndex = $(thisTH).parent().find('th').index(thisTH);
                var detachTH = $(thisTH).detach();

                $($(thisTHParent).find('th').get(thIndex)).after(detachTH);
                $(ssTable).ssTable('refreshViewAndPreserveScrollPosition');
                $(ssTable).ssTable('endTHMouseDownEvent');
            });

            $('.imgSwapLeft').bind('click', function () {
                var thisTH = $(this).parent();
                var thisTHParent = $(thisTH).parent();
                var tableHeaderWrapperDiv = $(this).parents().find('.ssTableHeaderWrapperDiv');
                var thIndex = $(thisTH).parent().find('th').index(thisTH);

                if (thIndex == 1) { //you will die at the thIndex - 2 a few lines below. That's the reason for this if block
                    $($(thisTHParent).find('th').get(0)).find('.imgSwapRight').trigger('click');
                    return;
                }

                var detachTH = $(thisTH).detach();
                $($(thisTHParent).find('th').get(thIndex - 2)).after(detachTH);
                $(ssTable).ssTable('endTHMouseDownEvent');
            });
        },

        endTHMouseDownEvent: function () {
            var tableHeader = $(this).data('ssTable').tableHeader;
            var divTableHeader = $(this).data('ssTable').divTableHeader;

            $('.imgSwapLeft').remove();
            $('.imgSwapRight').remove();

            $(divTableHeader).find('.ssTableResizeHandleDiv').remove();
            $(divTableHeader).find('th').each(function (index) {
                if (index == 0 || index > $(tableHeader).find('th').length - 1) {
                    return;
                }
                var thLeftPosition = $(this).position().left;
                var columnResizeDiv = $('<div class="ssTableResizeHandleDiv" style="position:absolute; top:0px; left:0px;  height:100%;"></div>'); // transparent
                $(this).parents('.ssTableHeaderWrapperDiv').append(columnResizeDiv);
                $(columnResizeDiv).css('left', thLeftPosition - 10);
                $(columnResizeDiv).data('thAdjacentLeft', $(tableHeader).find('th').get(index - 1));
                $(columnResizeDiv).data('thAdjacentRight', $(tableHeader).find('th').get(index));

            });

            var divTableViewer = $(this).data('ssTable').divTableViewer;
            $(this).ssTable('refreshViewAndPreserveScrollPosition');

            $(divTableViewer).scroll();
            $(tableHeader).find('th').each(function (index) {
                $(this).css('overflow', 'hidden');

            });

            $(this).ssTable('saveUserPreferences');
            $(this).ssTable('resize');
        },

        //Note columnNumber is the order in the object not the order of the array.
        sortByColumn: function (columnNumber, shouldSortNumerically) { //eliminated sortDirectionParam from 
            //data('ssTable').columnKeys is the order of the key in the object 
            //which may not match the rendered column order.
            //so you need to map
            // return;
            shouldSortNumerically = shouldSortNumerically == true ? shouldSortNumerically : false;
            var columnKeys = $(this).data('ssTable').columnKeys;
            var tableHeader = $(this).data('ssTable').tableHeader;
            var columnHeaderElement = $(tableHeader).find('th').get(columnNumber);
            var columnKey = $(columnHeaderElement).attr('data-key');
            var sortDesc = $(columnHeaderElement).hasClass('sortAsc'); //if last class is desc now make it asc.

            if (sortDesc) {
                sortDirection = 'desc';
            } else {
                sortDirection = 'asc';
            }

            $(tableHeader).find('th').removeClass('sortAsc');
            $(tableHeader).find('th').removeClass('sortDesc');

            var aoDataColumnIndex = null;

            for (var i = 0; i < columnKeys.length; ++i) {
                if (columnKeys[i] == columnKey) {
                    aoDataColumnIndex = i;
                }
            }

            var aoDataToRender = $(this).data('ssTable').aoDataToRender;

            if (aoDataColumnIndex == null && aoDataToRender != null && aoDataToRender.length > 1) { //greater than 1 because what's the point of 1 record sort
                if (gDebug) {
                    alert('Greetings Developer. Your data-key for this data-grid column is:' + columnKey + '. But it did not match any aoData column name. If you are displaying a value to the user that is a merged result of several pieces of data then it is OK to set a data-key attr for the th to use for sort purposes.');
                }

                var divTableViewer = $(this).data('ssTable').divTableViewer;
                $(divTableViewer).css('opacity', '1');
                var opacityTimeout = $(this).data('ssTable').opacityTimeout;

                if (opacityTimeout != null) {
                    window.clearTimeout($(this).data('ssTable').opacityTimeout);
                }

                $(this).data('ssTable').opacityTimeout = null;
                $(this).data('ssTable').isSortBusy = false;

                return;
            }
            columnNumber = aoDataColumnIndex; //now it is mapped
            var columnArrayWithIndex = [];
            var columnKeys = $(this).data('ssTable').columnKeys;


            for (var i = 0; i < aoDataToRender.length; ++i) {
                var row = aoDataToRender[i];
                eval('var element = row.' + columnKeys[columnNumber]);
                element = element == null ? '' : element + '';
                element.toLowerCase();
                var isNegative = element.indexOf('-') != -1;
                if (shouldSortNumerically && !isNegative && (!isNaN(element) || element == '')) { //we only correct the sorting issue with positive numbers for now.
                    element = element == null ? "0" : element;
                    element = element.replace(/[^0-9\.\-_]+/g, '');
                    if (element.indexOf('.') == -1) {
                        element = element + ".0"; //make it a decimal
                    }
                    var numberOfWholeDigits = element.indexOf('.');
                    for (var j = 0; j < numberOfWholeDigits + 1; j++) {
                        element = 'A' + element; // This approach allows us to use the native JS .sort method later.  We use .sort because it is fast. We 
                    }
                }
                var zeroPaddedIndex = i + "";
                i = i * 1; //just in case some browser did an unexpected typecast. 
                var paddingWidth = '7'; //will break if more than 10 million records to sort.
                zeroPaddedIndex = zeroPaddedIndex.length >= paddingWidth ? zeroPaddedIndex : new Array(paddingWidth - zeroPaddedIndex.length + 1).join('0') + zeroPaddedIndex;
                if ($(columnHeaderElement).hasClass('ssDateTime')) {
                    element = Number(new Date(element.split("")[0]));
                }
                element = element + '_' + zeroPaddedIndex; //zeropadding ensures proper sorting (e.g, index 0002 comes before 0100)

                columnArrayWithIndex.push(element);
            }

            columnArrayWithIndex.sort();
            gcawi = columnArrayWithIndex;
            var aoSortedData = [];

            if (sortDirection == 'asc') {
                for (var i = 0; i < columnArrayWithIndex.length; ++i) {
                    var element = columnArrayWithIndex[i];
                    //if (shouldSortNumerically) {
                    //    element = element.s
                    // }
                    var index = element.split('_').pop();
                    index = parseInt(index, 10); //LP Remove zeropadding. The second parameter is for the radix and as per the documentation it should always be specified. 
                    aoSortedData.push(aoDataToRender[index]);
                }

                $(columnHeaderElement).addClass('sortAsc');
            } else {
                for (var i = columnArrayWithIndex.length - 1; i > -1; --i) {
                    var element = columnArrayWithIndex[i];
                    var index = element.split('_').pop();
                    index = parseInt(index, 10); //LP Remove zeropadding. The second parameter is for the radix and as per the documentation it should always be specified. 
                    aoSortedData.push(aoDataToRender[index]);
                }

                $(columnHeaderElement).addClass('sortDesc');
            }
            $(this).data('ssTable').aoDataToRender = aoSortedData;
            var divTableViewer = $(this).data('ssTable').divTableViewer;
            var divTableViewerID = $(divTableViewer).attr('id');
            $(divTableViewer).css('opacity', '1');
            var opacityTimeout = $(this).data('ssTable').opacityTimeout;

            if (opacityTimeout != null) {
                window.clearTimeout($(this).data('ssTable').opacityTimeout);
            }

            $(this).data('ssTable').opacityTimeout = null;
            $(this).data('ssTable').isSortBusy = false;
            $(this).ssTable('initializeTables');
            $(this).ssTable('saveUserPreferences');

            $(this).ssTable('resize');
        },

        resize: function (callBackResize) {
            if ($(this).data('ssTable') == null) {
                return;
            }

            $('#divViewTDOverflow').remove(); // just in case it is there
            var bottomPositionReferenceElement = $(this).data('ssTable').bottomPositionReferenceElement;
            var inputSearch = $(this).data('ssTable').inputSearch;
            var spanRecordCount = $(this).data('ssTable').spanRecordCount;
            var divTableViewer = $(this).data('ssTable').divTableViewer;
            var divWrapper = $(this).data('ssTable').divWrapper;
            var tableHeader = $(this).data('ssTable').tableHeader;
            var divTableHeader = $(this).data('ssTable').divTableHeader;
            var topPositionOfWrapper = $(tableHeader).outerHeight(); //+ $(this).parent().offset().top;
            var leftPositionOfWrapper = $(this).parent().offset().left - $(this).parent().offset().left;

            if (bottomPositionReferenceElement == null) {
                var bottomPositionOfWrapper = $(this).parent().outerHeight();
            } else {
                var bottomPositionOfWrapper = $(bottomPositionReferenceElement).position().top;
            }

            var heightOfWrapper = bottomPositionOfWrapper; //- topPositionOfWrapper;

            if (bottomPositionReferenceElement == null) {
                var widthOfWrapper = $(this).parent().outerWidth();
            } else {
                var widthOfWrapper = $(bottomPositionReferenceElement).outerWidth();
            }

            //first assume Search Bar is not visible then adjust in "if" block
            var heightOfSearchBar = 0;
            var topPositionOfDivTableHeader = 0;
            var topPositionOfTableViewer = $(divTableHeader).outerHeight();

            if ($(inputSearch).is(':visible')) {
                heightOfSearchBar = $(inputSearch).outerHeight();
                topPositionOfDivTableHeader = heightOfSearchBar + 5; //Magic number 5 needs to be cssparam
                topPositionOfTableViewer += heightOfSearchBar + 5; //Magic number 5 needs to be css param
            }
            //first assume Row Count is not visible then adjust in "if" block
            var heightOfRowCount = 0;
            var topPositionOfRowCount = heightOfWrapper;
            var heightOfTableViewer = heightOfWrapper - topPositionOfTableViewer;

            if ($(spanRecordCount).parent().is(':visible')) {
                heightOfRowCount = $(spanRecordCount).parent().outerHeight();
                topPositionOfRowCount = heightOfWrapper - heightOfRowCount;
                heightOfTableViewer = heightOfWrapper - topPositionOfTableViewer - heightOfRowCount - 5;
                var cssDisplayRowCount = '';
            }

            $(divWrapper).css('top', 0); // topPositionOfWrapper);
            $(divWrapper).css('left', leftPositionOfWrapper);
            $(divWrapper).css('width', widthOfWrapper);
            var scrollControlShortEdgeDimension = $(this).ssTable('_getCurrentBrowserScrollbarWidth');
            $(divTableHeader).css('top', topPositionOfDivTableHeader);
            $(divTableHeader).css('width', widthOfWrapper);
            $(divTableViewer).css('top', topPositionOfTableViewer);
            $(divTableViewer).css('height', heightOfTableViewer);
            $(divTableViewer).css('width', widthOfWrapper);
            $(spanRecordCount).parent().css('top', topPositionOfRowCount);
            $(spanRecordCount).parent().css('height', heightOfRowCount);

            var tableHeader = $(this).data('ssTable').tableHeader;
            //var trWidthReferenece = $(this).siblings('.ssTableWrapperDiv').find('.ssTableHeaderTable').find('thead').find('tr');
            var trWidthReferenece = $(tableHeader).find('tr').first();
            var sumOfColumnMinWidths = 0;
            if ($(this).hasClass('jsShouldNotDynamicallyStyleTds')) {
                var sumOfColumnMinWidths = $(this).data('ssTable').sumOfColumnMinWidths;
                if (sumOfColumnMinWidths == null) {
                    $(trWidthReferenece).find('th').each(function () {
                        sumOfColumnMinWidths += parseFloat($(this).css('min-width'));  //wasteful to run this ever time resize is called.

                    });
                    $(this).data('ssTable').sumOfColumnMinWidths = sumOfColumnMinWidths;
                }
                $(this).data('ssTable').sumOfColumnMinWidths;
            } else {
                $(trWidthReferenece).find('th').each(function () {
                    // sumOfColumnMinWidths += parseFloat($(this).css('min-width'));
                    sumOfColumnMinWidths += parseFloat($(this).outerWidth());
                });
            }
            //we assume padding left is the same for all th's and padding-right is 0;
            var cellPaddingLeft = parseInt($(trWidthReferenece).find('th').first().css('padding-left'));
            var divTableViewerWidth = $(divTableViewer).outerWidth() - scrollControlShortEdgeDimension; //-- To do: Investigate why this always doesn't work (I have hacked it with 2X): LP
            if (divTableViewerWidth > sumOfColumnMinWidths) {
                //proportionally scale widths of columns that do NOT have 
                //a max-width set, based on their min-widths.
                var widthScale = 1;
                var widthDelta = divTableViewerWidth - sumOfColumnMinWidths;

                var sumOfColummMinWidthsThatHaveNoMaxWidth = 0;

                $(trWidthReferenece).find('th').each(function () {
                    if (isNaN(parseInt($(this).css('max-width'))) && parseInt($(this).css('max-width')) != 0) {
                        sumOfColummMinWidthsThatHaveNoMaxWidth += parseInt($(this).css('min-width'));
                    }
                });

                if (sumOfColummMinWidthsThatHaveNoMaxWidth > 0) {
                    widthScale = 1 + (widthDelta / sumOfColummMinWidthsThatHaveNoMaxWidth);
                }

                $(divTableViewer).find('.tableChunk').each(function () {

                    /*   $(this).find('tbody tr').first().addClass('ssTableTrHasTdWidthsSet');
                       //$(this).find('tbody tr').first().find('td').each(function (index) {
                       $(this).find('tbody tr').each(function (index) {
                           if($($(divTableViewer).data('ssTable')).hasClass('jsShouldNotDynamicallyStyleTds') == false) {
                               $(this).find('td').each(function(index) {
                                   var thWidthReference = $(trWidthReferenece).find('th').get(index);
                                   if (isNaN(parseInt($(thWidthReference).css('max-width'))) && parseInt($(thWidthReference).css('max-width')) != 0) {
                                       var width = parseInt($(thWidthReference).css('min-width'));
                                       // $(this).css('min-width', $(thWidthReference).css('min-width'));
                                       $(this).css('width', width * widthScale - cellPaddingLeft); // - cellPaddingLeft * widthScale);
                                       $(thWidthReference).css('width', width * widthScale - cellPaddingLeft);
                                       $(this).css('white-space', 'nowrap');
                                   } else {
                                       // $(this).css('min-width', $(thWidthReference).css('min-width'));
                                       //!$(this).css('max-width', $(thWidthReference).css('max-width'));
                                       $(this).css('width', $(thWidthReference).css('max-width'));
                                   }
                                   var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
                                   if (isChrome) {
                                       $(this).css('max-width', $(thWidthReference).outerWidth() - cellPaddingLeft * 2);
                                       $(this).css('width', $(thWidthReference).outerWidth() - cellPaddingLeft * 2);
                                   }
                               });
                           }
                       }); */
                });
                $(trWidthReferenece).parents('.ssTableHeaderTable').css('width', divTableViewerWidth); // scrollControlShortEdgeDimension);
                $(divTableViewer).find('.tableChunk').css('width', $(trWidthReferenece).outerWidth()); //divTableViewerWidth);//- scrollControlShortEdgeDimension);
            } else {

                $(divTableViewer).find('.tableChunk').each(function () {
                    if ($($(divTableViewer).data('ssTable')).hasClass('jsShouldNotDynamicallyStyleTds') == false) {

                        /*   $(this).find('tbody tr').each(function (index) {
                               $(this).find('td').each(function (index) {
                                   var thWidthReference = $(trWidthReferenece).find('th').get(index);
                                   var width = parseInt($(thWidthReference).css('min-width'));
                                   $(this).css('width', width - cellPaddingLeft);
                                   $(thWidthReference).css('width', width - cellPaddingLeft);
                                   $(this).css('min-width', $(thWidthReference).css('min-width'));
                                   $(this).css('max-width', $(thWidthReference).css('max-width'));
                                   var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
   
                                   if (isChrome) {
                                       $(this).css('max-width', $(thWidthReference).innerWidth() - cellPaddingLeft * 2);
                                       $(this).css('width', $(thWidthReference).innerWidth() - cellPaddingLeft * 2);
                                   }
                               });
                           });*/
                    }
                });
                $(trWidthReferenece).parents('.ssTableHeaderTable').css('width', sumOfColumnMinWidths); //scrollControlShortEdgeDimension); 
                $(divTableViewer).find('.tableChunk').css('width', $(trWidthReferenece).outerWidth()); //sumOfColumnMinWidths);//- scrollControlShortEdgeDimension);
            }

            //add the resize handlers and define the thWidths Array
            var divTableHeader = $(this).data('ssTable').divTableHeader;
            // var thWidths = $(this).data('ssTable').thWidths;
            var tdStyleArray = $(this).data('ssTable').tdStyleArray;
            var hiddenField = '';
            tdStyleArray = [];
            
            $(tableHeader).find('th').each(function (index) {


                var paddingLeft = $(this).css('padding-left').replace('px', '');
                var paddingRight = $(this).css('padding-right').replace('px', '');
                var padding = 0;
                if (paddingLeft != null && paddingLeft != '' && paddingLeft > 0) {
                    padding += parseInt(paddingLeft);
                }
                
                if (paddingRight != null && paddingRight != '' && paddingRight > 0) {
                    padding += parseInt(paddingRight);
                }
                
                var dataKey = $(this).attr('data-key');
                if (dataKey != null && dataKey != '') {
                    var thisWidth = parseFloat($(this).width()+padding);
                    thisWidth = thisWidth.toFixed(2);
                    hiddenField = '';

                    if (thisWidth == 0.00) {
                        hiddenField = 'padding: 0 !important;';
                    }

                    //if (d) {
                    //    //debugger;
                    //}
                    
                    
                    tdStyleArray[dataKey] = hiddenField + 'overflow:hidden; white-space:nowrap; width:' + thisWidth + 'px !important; max-width:' + thisWidth + 'px !important; min-width:' + thisWidth + 'px !important;';
                }

                if (index > 0 && index < $(tableHeader).find('th').length - 1) {
                    var thLeftPosition = $(this).position().left;
                    var columnResizeDiv = $(divTableHeader).find('.ssTableResizeHandleDiv').get(index - 1);
                    $(columnResizeDiv).css('left', thLeftPosition - 10);
                }
            });
            $(this).data('ssTable').tdStyleArray = tdStyleArray;

            $(this).ssTable('_resizeScrollbars');
            var ssTableVertScrollbarDiv = $(divTableViewer).parent().find('.ssTableVertScrollbarDiv');
            var foo = $(ssTableVertScrollbarDiv).length;
            var ssTableViewDiv = $(ssTableVertScrollbarDiv).parent().find('.ssTableViewDiv'); //LP: Could eliminate this var and use divTableViewer above

            $(this).ssTable('_removeOrAddVertScrollArrows', divTableViewer);
            $(this).ssTable('_onScrollAdjustVertScrollSliderPosition', divTableViewer);
            $(this).ssTable('_onScrollAdjustHorizScrollSliderPosition', divTableViewer);
            $(this).ssTable('refreshViewAndPreserveScrollPosition');
            if (typeof callBackResize != 'undefined') {
                setTimeout(callBackResize, 0);
            }

            if ($('.ssTableViewDiv').height() < 150) {
                var wrapperId = $(this).parent().attr('id');
                $('#' + wrapperId + ' .ssTableVertScrollSliderDiv').css('cssText', $('#' + wrapperId + ' .ssTableVertScrollSliderDiv').attr('style') + 'top:32px;');
                $('#' + wrapperId + ' .ssTableScrollUpDiv').css('cssText', $('#' + wrapperId + ' .ssTableScrollUpDiv').attr('style') + 'height:32px !important;');
                $('#' + wrapperId + ' .ssTableScrollDownDiv').css('cssText', $('#' + wrapperId + ' .ssTableScrollDownDiv').attr('style') + 'height:32px !important;');
            }
        },

        _resizeScrollbars: function () {
            var divWrapper = $(this).data('ssTable').divWrapper;
            var ssTableVertScrollbarDiv = $(divWrapper).find('.ssTableVertScrollbarDiv');
            //$(ssTableVertScrollSliderDiv).show();
            if ($(ssTableVertScrollbarDiv).length == 0) {
                return;
            }

            var scrollControlShortEdgeDimension = $(this).ssTable('_getCurrentBrowserScrollbarWidth');
            var scrollControlLongEdgeDimension = 32;
            var ssTableViewDiv = $(ssTableVertScrollbarDiv).parent().find('.ssTableViewDiv');
            var ssTableViewDivHeight = $(ssTableViewDiv).outerHeight();
            $(ssTableVertScrollbarDiv).css('height', ssTableViewDivHeight - scrollControlShortEdgeDimension);

            var ssTableVertScrollSliderDiv = $(ssTableVertScrollbarDiv).find('.ssTableVertScrollSliderDiv');
            var ssTableVertScrollSliderDivHeight = (ssTableViewDivHeight - scrollControlShortEdgeDimension - scrollControlLongEdgeDimension - scrollControlLongEdgeDimension) * ((ssTableViewDivHeight - scrollControlShortEdgeDimension) / $(ssTableViewDiv).find('.ssTableExpanderDiv').outerHeight());

            ssTableVertScrollSliderDivHeight = Math.min(ssTableVertScrollSliderDivHeight, ssTableViewDivHeight - scrollControlShortEdgeDimension - scrollControlLongEdgeDimension - scrollControlLongEdgeDimension);
            ssTableVertScrollSliderDivHeight = Math.max(ssTableVertScrollSliderDivHeight, scrollControlLongEdgeDimension);
            $(ssTableVertScrollSliderDiv).css('height', ssTableVertScrollSliderDivHeight);

            var ssTableHorizScrollbarDiv = $(divWrapper).find('.ssTableHorizScrollbarDiv');
            $(ssTableHorizScrollbarDiv).children().css('visibility', 'visible');

            if ($(ssTableHorizScrollbarDiv).length == 0) {
                return;
            }

            var ssTableViewDivWidth = $(ssTableViewDiv).outerWidth();
            $(ssTableHorizScrollbarDiv).css('width', ssTableViewDivWidth - scrollControlShortEdgeDimension);
            var ssTableViewDivTop = $(ssTableViewDiv).position().top;
            var ssTableHorizScrollbarDivTop = ssTableViewDivHeight - scrollControlShortEdgeDimension + ssTableViewDivTop;
            $(ssTableHorizScrollbarDiv).css('top', ssTableHorizScrollbarDivTop);

            var ssTableHorizScrollSliderDiv = $(ssTableHorizScrollbarDiv).find('.ssTableHorizScrollSliderDiv');
            var ssTableHorizScrollbarSliderWidth = ($(ssTableViewDiv).outerWidth() - scrollControlShortEdgeDimension - scrollControlLongEdgeDimension - scrollControlLongEdgeDimension)
                * ($(ssTableViewDiv).outerWidth() / $(ssTableViewDiv)[0].scrollWidth);

            var ssTableHorizScrollbarSliderMaxWidth = $(ssTableViewDiv).outerWidth() - scrollControlShortEdgeDimension - scrollControlLongEdgeDimension - scrollControlLongEdgeDimension;
            ssTableHorizScrollbarSliderWidth = Math.max(ssTableHorizScrollbarSliderWidth, 32);
            ssTableHorizScrollbarSliderWidth = Math.min(ssTableHorizScrollbarSliderWidth, ssTableHorizScrollbarSliderMaxWidth);
            $(ssTableHorizScrollSliderDiv).css('width', ssTableHorizScrollbarSliderWidth);

            if ($('.tableChunk ').first().outerWidth() <= $(ssTableViewDiv).outerWidth() - scrollControlShortEdgeDimension) {
                $(ssTableHorizScrollbarDiv).children().css('visibility', 'hidden');
            }
        },

        _removeOrAddVertScrollArrows: function (ssTableViewDiv) {
            var ssTableViewDivHeight = $(ssTableViewDiv).outerHeight();
            var scrollUpDiv = $(ssTableViewDiv).parent().find('.ssTableScrollUpDiv');
            var scrollDownDiv = $(ssTableViewDiv).parent().find('.ssTableScrollDownDiv');

            if (ssTableViewDivHeight < 128) {
                $(scrollUpDiv).css('height', 0);
                $(scrollDownDiv).css('height', 0);
            } else {
                $(scrollUpDiv).css('height', 32);
                $(scrollDownDiv).css('height', 32);
            }

            $(this).ssTable('_resizeScrollbars');
        },

        _onScrollAdjustVertScrollSliderPosition: function (ssTableViewDiv) {
            //ignore if scroll is caused by moving a slider.
            var scrollSlider = $(document).data('scrollSlider');

            if (scrollSlider != null) {
                return;
            }

            var scrollTop = $(ssTableViewDiv).scrollTop();

            if ($(ssTableViewDiv)[0] == null) {
                return;
            }

            var ssTableViewDivScrollHeight = $(ssTableViewDiv)[0].scrollHeight;
            var ssTableViewDivHeight = $(ssTableViewDiv).outerHeight();
            var scrollControlShortEdgeDimension = $(this).ssTable('_getCurrentBrowserScrollbarWidth');
            var percentScroll = scrollTop / (ssTableViewDivScrollHeight + scrollControlShortEdgeDimension - ssTableViewDivHeight);
            $(this).ssTable('_adjustVertScrollSliderPosition', ssTableViewDiv, percentScroll);
        },

        _onScrollAdjustHorizScrollSliderPosition: function (ssTableViewDiv) {
            //ignore if scroll is caused by moving a slider.
            var scrollSlider = $(document).data('scrollSlider');

            if (scrollSlider != null) {
                return;
            }

            var scrollLeft = $(ssTableViewDiv).scrollLeft();

            if ($(ssTableViewDiv)[0] == null) {
                return;
            }

            var ssTableViewDivScrollWidth = $(ssTableViewDiv)[0].scrollWidth;
            var ssTableViewDivWidth = $(ssTableViewDiv).outerWidth();
            var scrollControlShortEdgeDimension = $(this).ssTable('_getCurrentBrowserScrollbarWidth');
            var percentScroll = scrollLeft / (ssTableViewDivScrollWidth + scrollControlShortEdgeDimension - ssTableViewDivWidth);
            $(this).ssTable('_adjustHorizScrollSliderPosition', ssTableViewDiv, percentScroll);
        },

        _adjustVertScrollSliderPosition: function (ssTableViewDiv, percentScroll) {
            var scrollSlider = $(ssTableViewDiv).parent().find('.ssTableVertScrollSliderDiv');
            var scrollBarHeight = $(scrollSlider).parent().outerHeight();
            var scrollUpDivHeight = $(scrollSlider).parent().find('.ssTableScrollUpDiv').outerHeight();

            if (scrollUpDivHeight == null || scrollUpDivHeight == '') { //LP: the arrows should collapse to 0px high for small tables. There is no need for this.
                scrollUpDivHeight = 0;
            }

            var scrollSliderMinTop = scrollUpDivHeight;
            var scrollDownDivHeight = $(scrollSlider).parent().find('.ssTableScrollDownDiv').outerHeight();

            if (scrollDownDivHeight == null || scrollDownDivHeight == '') { //LP: the arrows should collapse to 0px high for small tables. There is no need for this.
                scrollDownDivHeight = 0;
            }

            var scrollSliderHeight = $(scrollSlider).outerHeight();
            var scrollSliderMaxTop = scrollBarHeight - scrollDownDivHeight - scrollSliderHeight;
            var scrollSliderRangeInPixels = scrollSliderMaxTop - scrollSliderMinTop;
            var scrollSliderNewTopPosition = scrollSliderMinTop + scrollSliderRangeInPixels * percentScroll;
            $(scrollSlider).css('top', scrollSliderNewTopPosition);
        },

        _adjustHorizScrollSliderPosition: function (ssTableViewDiv, percentScroll) {
            var scrollSlider = $(ssTableViewDiv).parent().find('.ssTableHorizScrollSliderDiv');
            var scrollBarWidth = $(scrollSlider).parent().outerWidth();
            var scrollLeftDivWidth = $(scrollSlider).parent().find('.ssTableScrollLeftDiv').outerWidth();

            if (scrollLeftDivWidth == null || scrollLeftDivWidth == '') { //LP: the arrows should collapse to 0px high for small tables. There is no need for this.
                scrollLeftDivWidth = 0;
            }

            var scrollSliderMinLeft = scrollLeftDivWidth;
            var scrollRightDivWidth = $(scrollSlider).parent().find('.ssTableScrollRightDiv').outerWidth();

            if (scrollRightDivWidth == null || scrollRightDivWidth == '') { //LP: the arrows should collapse to 0px high for small tables. There is no need for this.
                scrollRightDivWidth = 0;
            }

            var scrollSliderWidth = $(scrollSlider).outerWidth();
            var scrollSliderMaxLeft = scrollBarWidth - scrollRightDivWidth - scrollSliderWidth;
            var scrollSliderRangeInPixels = scrollSliderMaxLeft - scrollSliderMinLeft;
            var scrollSliderNewLeftPosition = scrollSliderMinLeft + scrollSliderRangeInPixels * percentScroll;
            $(scrollSlider).css('left', scrollSliderNewLeftPosition);
        },

        initializeTables: function (shouldCreateTBody) {
            if (shouldCreateTBody == null) {
                shouldCreateTBody = true;
            }
            var tableChunkHTMLString = $(this).data('ssTable').tableChunkHTMLString;
            var divTableViewer = $(this).data('ssTable').divTableViewer;

            $(divTableViewer).find('table.tableChunk').each(function () { $(this).remove(); });
            $(divTableViewer).append(tableChunkHTMLString);
            $(divTableViewer).append(tableChunkHTMLString);
            $(divTableViewer).append(tableChunkHTMLString);
            $($(divTableViewer).find('table.tableChunk').get(0)).attr('data-id', 'tableChunk0');
            $($(divTableViewer).find('table.tableChunk').get(1)).attr('data-id', 'tableChunk1');
            $($(divTableViewer).find('table.tableChunk').get(2)).attr('data-id', 'tableChunk2');

            $(this).ssTable('initializeNumberOfRowsInChunkAndRowHeight'); //the container div size may have changed. 
            if (shouldCreateTBody) {// this bool is used to prevent unnecessary rendering during init since the table will be redrawn once userPreferences are loaded 
                $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').get(0));
                $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').get(1));
                $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').get(2));
            }
            var rowHeight = $(this).data('ssTable').rowHeight;
            var aoDataToRender = $(this).data('ssTable').aoDataToRender;
            $(this).data('ssTable').numberOfRowsToRender = aoDataToRender.length;
            var requiredDivHeight = $(this).data('ssTable').numberOfRowsToRender * rowHeight;

            //-- todo = this is a scroll issue with the Apple devices. I am not sure if there is a cleaning way to do this.
            if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                requiredDivHeight += 20;
            }
            if (window.navigator.platform.indexOf('Mac') != -1) {
                requiredDivHeight = requiredDivHeight + $(this).ssTable('_getCurrentBrowserScrollbarWidth');
            }
            var calculatedDivHeight = requiredDivHeight;

            var calculatedDivHeightToActualHeightRatio = 1;
            var useDivScrollScaling = false;
            //console.log("requiredDivHeight: " + requiredDivHeight);
            //if (requiredDivHeight > 100000) {
            //    requiredDivHeight = 100000; //shrink it because HMTL has poor support beyond 1M pixels
            //    calculatedDivHeightToActualHeightRatio = calculatedDivHeight / requiredDivHeight; //always greater than 1
            //    useDivScrollScaling = true;
            //}

            $(this).data('ssTable').rowHeight = rowHeight;
            $(this).data('ssTable').requiredDivHeight = requiredDivHeight;
            $(this).data('ssTable').calculatedDivHeightToActualHeightRatio = calculatedDivHeightToActualHeightRatio;
            $(this).data('ssTable').useDivScrollScaling = useDivScrollScaling;

            $(divTableViewer).find('.ssTableExpanderDiv').css('height', requiredDivHeight);
            $(this).ssTable('setTableChunkTopPosition', $(divTableViewer).find('table.tableChunk').get(0));
            $(this).ssTable('setTableChunkTopPosition', $(divTableViewer).find('table.tableChunk').get(1));
            $(this).ssTable('setTableChunkTopPosition', $(divTableViewer).find('table.tableChunk').get(2));

            var aoDataToRender = $(this).data('ssTable').aoDataToRender;
            var aoDataAll = $(this).data('ssTable').aoDataAll;

            if (aoDataToRender.length == aoDataAll.length) {
                $('#spanRecordSearchTime').text('NA');
                var recordCount = aoDataToRender.length;

                if (recordCount == 1 && jQuery.isEmptyObject(aoDataToRender[0])) {
                    recordCount = 0;
                }

                $($(this).data('ssTable').spanRecordCount).text(recordCount);
            }

            //$(divTableViewer).scrollTop(0);

            if ($($(divTableViewer).find('table.tableChunk').get(2)).find('tr').length > 0) {
                //$(this).ssTable('initializeNumberOfRowsInChunkAndRowHeight');
                //$(this).ssTable('refreshViewAndPreserveScrollPosition');
            }
        },

        initializeNumberOfRowsInChunkAndRowHeight: function () {
            var rowRenderFn = $(this).data('ssTable').rowRenderFn;
            var columnKeys = $(this).data('ssTable').columnKeys;
            var aoDataToRender = $(this).data('ssTable').aoDataToRender;
            var divTableViewer = $(this).data('ssTable').divTableViewer;
            var htmlString = "no results.";

            if (aoDataToRender.length < 1) {
                return; //----------------------- RETURN ----------------------//
            }

            var rowData = aoDataToRender[0];
            var i = 0;
            var isForHeightCalculation = true; //this was never implemented

            //var tdStyleArray = $(this).data('ssTable').tdStyleArray;
            //tdStyleArray = [];
            //var tableHeader = $(this).data('ssTable').tableHeader;
            //$(tableHeader).find('th').each(function (index) {
            //    var dataKey = $(this).attr('data-key');
            //    if (dataKey != null && dataKey != '') {
            //        tdStyleArray[dataKey] = '';
            //    }
            //});
            //$(this).data('ssTable').tdStyleArray = tdStyleArray;


            var rowString = rowRenderFn(i, rowData, columnKeys, []);//, isForHeightCalculation);
            htmlString = rowString;
            $($(divTableViewer).find('table.tableChunk').get(0)).find('tbody').append(htmlString);

            var rowHeight = 32;//$($(divTableViewer).find('table.tableChunk').get(0)).find('tr').first().outerHeight();
            $($(divTableViewer).find('table.tableChunk').get(0)).find('tbody').empty();
            $(this).data('ssTable').rowHeight = rowHeight;
            var divTableViewerHeight = $(divTableViewer).innerHeight();
            var numberOfRowsInChunk = Math.ceil(1 * divTableViewerHeight / rowHeight);

            //make sure row chunk is even in case of alternate shading
            if (numberOfRowsInChunk * 3 > aoDataToRender.length) {
                numberOfRowsInChunk = Math.ceil(aoDataToRender.length / 2) - 1;
            }

            if (numberOfRowsInChunk < 1) {
                numberOfRowsInChunk = 1;
            }

            if (numberOfRowsInChunk % 2 != 0) {
                numberOfRowsInChunk += 1;
            }

            $(this).data('ssTable').numberOfRowsInChunk = numberOfRowsInChunk;
            $(this).data('ssTable').numberOfRowsInLastChunk = aoDataToRender.length % numberOfRowsInChunk;
        },

        createTBodyStr: function (tableChunk) {
            //this is for masteroption assing origtopvalue to the top attribute
            var gettableOrigTopValue = $('.clsOrigtopValue');
            if (gettableOrigTopValue.length > 0) {
                var topValue = $('.clsOrigtopValue').attr('origtopvalue');
                $('.clsOrigtopValue').css('top', parseInt(topValue));
            }
            //end
            var aoDataToRender = $(this).data('ssTable').aoDataToRender;
            $(this).data('ssTable').numberOfRowsToRender = aoDataToRender.length;

            var numberOfRowsToRender = $(this).data('ssTable').numberOfRowsToRender;
            var numberOfRowsInChunk = $(this).data('ssTable').numberOfRowsInChunk;
            $(this).data('ssTable').numberOfChunks = Math.ceil(numberOfRowsToRender / numberOfRowsInChunk);

            var numberOfChunks = $(this).data('ssTable').numberOfChunks;
            var tableChunkID = $(tableChunk).attr('data-id');
            var chunkIndex = tableChunkID.split('tableChunk').pop();
            var fromRecordIndex = chunkIndex * numberOfRowsInChunk;
            var toRecordIndex = fromRecordIndex + numberOfRowsInChunk;

            if (fromRecordIndex < 0) {
                return;
            }

            if (fromRecordIndex > $(this).data('ssTable').numberOfRowsToRender) {
                return;
            }

            if (toRecordIndex > $(this).data('ssTable').numberOfRowsToRender) {
                toRecordIndex = aoDataToRender.length;
            }

            var rowRenderFn = $(this).data('ssTable').rowRenderFn;
            var columnKeys = $(this).data('ssTable').columnKeys;
            var searchString = $($(this).data('inputSearch')).val();

            searchString = searchString + '';
            var searchStringArrayTemp = searchString.split(' ');
            var searchStringArray = [];
            $.each(searchStringArrayTemp, function () {
                var item = this + '';
                if (item.length > 0) {
                    searchStringArray.push(item);
                }
            });
            var htmlString = '';
            var tableHeader = $(this).data('ssTable').tableHeader;
            var rowRenderColumnKeys = [];
            $(tableHeader).find('th').each(function () {
                var columnKey = $(this).attr('data-key');
                rowRenderColumnKeys.push(columnKey);
            });
            var tdStyleArray = $(this).data('ssTable').tdStyleArray;
            for (var i = fromRecordIndex; i < toRecordIndex; i++) {
                var rowData = aoDataToRender[i];
                var rowString = '';

                if ($.isEmptyObject(rowData) == false) {
                    rowString = rowRenderFn(i, rowData, rowRenderColumnKeys, tdStyleArray);
                }

                if (rowString != '' && rowString != null) {
                    htmlString += rowString;
                }
            }

            if ($(this).data('ssTable').ngCompile) {
                $(tableChunk).find('tbody').hide(); //don't show the nasty uncompiled angular html
                $(tableChunk).find('tbody').append(htmlString);
                $(tableChunk).find('tr:even').addClass('ssTableTrEven');
                $(tableChunk).find('tr:odd').addClass('ssTableTrOdd');
                //var trThatHasTdWidthsSet = $(tableChunk).parent().find('.ssTableTrHasTdWidthsSet').first();

                var compile = $(this).data('ssTable').ngCompile[0];
                var scope = $(this).data('ssTable').ngCompile[1];
                var timeout = $(this).data('ssTable').ngCompile[2];
                timeout(function () {
                    compile($(tableChunk).find('tbody').contents())(scope);
                    $(tableChunk).find('tbody').show(); //we're done compiling, show the goods.
                }, 0);
            } else {
                $(tableChunk).find('tbody').append(htmlString);
                $(tableChunk).find('tr:even').addClass('ssTableTrEven');
                $(tableChunk).find('tr:odd').addClass('ssTableTrOdd');
                //var trThatHasTdWidthsSet = $(tableChunk).parent().find('.ssTableTrHasTdWidthsSet').first();
            }

            /* if ($(trThatHasTdWidthsSet).length == 0) {
                 $(this).ssTable('resize');
             } else {
                 //no longer sure if the code block below is reachable -- This is definitely reached TS
                 $(tableChunk).css('width', $(trThatHasTdWidthsSet).outerWidth()); //Probably should just be table chunk
                 //var targetTr = $(tableChunk).find('tbody').find('tr').first();
                 $(tableChunk).find('tbody').find('tr').each(function() {
                     var targetTr = $(this);
                     var w = 0;
                     $(targetTr).addClass('ssTableTrHasTdWidthsSet');
                     $(trThatHasTdWidthsSet).find('td').each(function (index) { //The code below may seem redundant, but we need the properties explictly added. 
                         //todo Width issue needs to be addressed.
                         var min_width = $(this).css('min-width');
                         //var width = $(this).css('width');
                         var width = $(this).css('width');
                         var white_space = $(this).css('white-space');
                         var targetTd = $(targetTr).find('td').get(index);
                         // $(targetTd).css('min-width', min_width);
                         //$(targetTd).css('width', width);
                         $(targetTd).css('width', ssTableValues.thWidthsArray[w]);
                         //$(targetTd).css('min-width', ssTableValues.thMinimumWidth);
                         $(targetTd).css('white-space', white_space);
                         //$(tableChunk).find('tbody').find('tr').first().
                         //var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
 
                         //if (isChrome) {
                             //$(this).css('max-width', width);
                             //$(this).css('max-width', ssTableValues.thMaximumWidth);
                         //}
                         w++;
                     });
                 });
             }
             
             var whenComplete = $(this).data('ssTable').whenComplete;
             
             if (whenComplete != null) {
                 whenComplete();
            }*/
        },

        onKeyup: function () {
            var ssTable = $(this); //.data('ssTable');
            $($(ssTable).data('ssTable').divTableViewer).css('opacity', '1');
            var opacityTimeout = $(ssTable).data('ssTable').opacityTimeout;

            if (opacityTimeout != null) {
                window.clearTimeout($(ssTable).data('ssTable').opacityTimeout);
                $(ssTable).data('ssTable').opacityTimeout = null;
            }

            var inputSearch = $(ssTable).data('ssTable').inputSearch;
            var previousSearchString = $(ssTable).data('ssTable').previousSearchString;
            var searchString = $(inputSearch).val(); //need to get the input's val

            if (searchString == previousSearchString) {
                return; //this could happen if change is triggered but input wasn't updated.
            }

            if (searchString.length == 0) { //no need to search, the user is just clearing the searchString
                $(ssTable).data('ssTable').aoDataToSearch = $(ssTable).data('ssTable').aoDataAll;
                $(ssTable).data('ssTable').aoDataToRender = $(ssTable).data('ssTable').aoDataAll;
                $(ssTable).data('ssTable').previousSearchString = searchString;
                $(ssTable).ssTable('initializeTables');
                $(ssTable).ssTable('_resizeScrollbars');
                if (typeof $(this).data('ssTable').onSearchCallBack != 'undefined') {
                    $(this).data('ssTable').onSearchCallBack();
                }

            } else {
                if (searchString.indexOf(previousSearchString) != 0 || searchString.indexOf(' ') != -1) {
                    //TO DO: Need a smarter way to handle AND/OR of terms separated by a space
                    //User typed a totally new string. So we can no longer search subsets
                    $(ssTable).data('ssTable').aoDataToSearch = $(ssTable).data('ssTable').aoDataAll;
                    $(ssTable).data('ssTable').previousSearchString = searchString;
                    $(ssTable).ssTable('searchRecords', searchString);
                } else {
                    $(ssTable).data('ssTable').previousSearchString = searchString;
                    $(ssTable).ssTable('searchRecords', searchString);
                }
            }
        },

        setTableChunkTopPosition: function (thisTable) { //thisTable is a table chunk
            //to support scroll scaling we need to only compute the top for the first table
            //if it is not the first table then it's position should be relative to the table 
            //above it in the DOM.
            var divTableViewer = $(this).data('ssTable').divTableViewer;
            var thisTableIndex = $($(this).data('ssTable').divTableViewer).find('table').index(thisTable);

            if (thisTableIndex == 0) {
                var thisTableID = $(thisTable).attr('data-id');
                var chunkIndex = thisTableID.split('tableChunk').pop();
                var numberOfRowsInChunk = $(this).data('ssTable').numberOfRowsInChunk;
                var rowHeight = $(this).data('ssTable').rowHeight;
                var top = Math.round(chunkIndex * numberOfRowsInChunk * rowHeight);

                $(thisTable).css('top', top);
                $($(divTableViewer).find('table.tableChunk').get(1)).css('top', top + numberOfRowsInChunk * rowHeight);
                $($(divTableViewer).find('table.tableChunk').get(2)).css('top', top + 2 * numberOfRowsInChunk * rowHeight);
            } else {
                var previousTable = $(divTableViewer).find('table[data-id="tableChunk' + (chunkIndex - 1) + '"]');
                var previousTableTopPos = parseInt($(previousTable).css('top'));
                var numberOfRowsInChunk = $(this).data('ssTable').numberOfRowsInChunk;
                var rowHeight = $(this).data('ssTable').rowHeight;
                $($(divTableViewer).find('table.tableChunk').get(thisTableIndex)).css('top', previousTableTopPos + numberOfRowsInChunk * rowHeight);
            }
        },

        filterRecords: function (filterObj) {
            //need to figure out how this would work with search
            //FYI: the filters are cumulative; filter object = null will remove past filters
            if ($(this).data('ssTable') == null) {
                return;
            }
            $(this).ssTable('scrollToRow', 0);
            var inputSearch = $(this).data('ssTable').inputSearch;
            $(inputSearch).val('');
            var aoDataAll = $(this).data('ssTable').aoDataAll;
            if (filterObj == null) {
                $(this).data('ssTable').aoDataToRender = $(this).data('ssTable').aoDataAll;
                $(this).data('ssTable').aoDataToSearch = $(this).data('ssTable').aoDataAll;
                var aoDataToRender = $(this).data('ssTable').aoDataToRender;

                if (aoDataToRender == null) {
                    return;
                }

                var recordCount = aoDataToRender.length;

                if (recordCount == 1 && jQuery.isEmptyObject(aoDataToRender[0])) {
                    recordCount = 0;
                }

                $($(this).data('ssTable').spanRecordCount).text(recordCount);
                $(this).ssTable('initializeTables');
                $(this).ssTable('_resizeScrollbars');
                return;
            }

            var searchString = filterObj.filterString + '';
            var columnKey = filterObj.columnKey;
            var aoDataToRender = [];

            for (var i = 0; i < aoDataAll.length; ++i) {
                var rowData = aoDataAll[i];
                eval('var item = rowData.' + columnKey);

                if (item == null) {
                    item = '';
                }

                item = item + '';

                if (item.indexOf(searchString) != -1) {
                    aoDataToRender.push(rowData);
                }
            }

            $(this).data('ssTable').aoDataToRender = aoDataToRender;
            $(this).data('ssTable').aoDataToSearch = aoDataToRender; //this way we just keep searching the subset on next key press
            var recordCount = aoDataToRender.length;

            if (recordCount == 1 && jQuery.isEmptyObject(aoDataToRender[0])) {
                recordCount = 0;
            }

            $($(this).data('ssTable').spanRecordCount).text(recordCount);
            $(this).ssTable('initializeTables');
            $(this).ssTable('_resizeScrollbars');
        },

        searchRecords: function (searchString) {

            if (searchString == null || searchString == "") {
                return;
            }

            //TODO: Do we need an abort search on keyup ? Probably not necessary, the search is computationally intense and blocks the UI. 
            //Limitations: this code does not call your rowRenderFn.  So derived data (like dates) may not appear in a match and data that is ignored by the rowRenderFn may match since it is in the rowData. 
            //We may get around the limitation above if we have the rowRenderFn markup the search terms instead of changing the data as we currently do. 
            //Note1: This code would be a lot faster if we didn't mark up the search term with em and strong. (why not have rowRenderFn do this)
            //Note2: We never markup the ID since we often use that in our row render function in the row's html id.

            //There is repeated code in the top level if and else block that should be consolidated. 
            var aoDataToSearch = $(this).data('ssTable').aoDataToSearch;
            var columnKeys = $(this).data('ssTable').columnKeys; //these are the keys of your objects in aoData, not the th's data-keys.
            var aoDataToRender = [];
            var itemToLowerCaseSplitArray = [];
            var rowRenderFn = $(this).data('ssTable').rowRenderFn;
            var tableHeader = $(this).data('ssTable').tableHeader;
            var rowRenderColumnKeys = [];
            $(tableHeader).find('th').each(function () {
                var columnKey = $(this).attr('data-key');
                rowRenderColumnKeys.push(columnKey);
            });

            for (var i = 0; i < aoDataToSearch.length; ++i) {
                var rowData = aoDataToSearch[i];
                var newRowData = {};
                var matchFound = false;

                for (var j = 0; j < columnKeys.length; ++j) {
                    if (columnKeys[j].length > 1) {
                        var columnKey = columnKeys[j].toLowerCase();
                        if (columnKey.substring(columnKey.length - 2, columnKey.length) == 'id' ||
                            columnKey == 'LastUser' || columnKey == 'LastChanged') {
                            //Never match ID's, or Audit columns. Abort this loop iteration. 
                            continue; //------------------------ CONTINUE ------------------------//
                        }
                    }
                    var item = eval('rowData.' + columnKeys[j]);
                    if (item == null || item === true || item === false) {
                        //Abort this loop iteration. 
                        continue; //----------
                    }
                    item = item + ''; //cast to string
                    if (item.indexOf('Date(') != -1) {
                        //Never match timestamps. Abort this loop iteration. 
                        continue; //--------------------- CONTINUE -----------------------//
                    }

                    item = item.split('<strong><em>').join('');
                    item = item.split('</em></strong>').join('');
                    eval('newRowData.' + columnKeys[j] + ' = item;');

                    //convert case but understand that you will need to find the indexes of split 
                    //and operate on the original string
                    var itemToLowerCase = item.toLowerCase();
                    var searchStringToLowerCase = searchString.toLowerCase();
                    var indexOfSearchString = itemToLowerCase.indexOf(searchStringToLowerCase);

                    if (indexOfSearchString != -1) {
                        //get the original text that matched the search string
                        var originalMatchedString = item.substring(indexOfSearchString, indexOfSearchString + searchString.length);
                        var itemToLowerCaseSplitArray = itemToLowerCase.split(searchStringToLowerCase);
                        var itemWithMarkup = '';
                        var previousSplitIndex = 0;
                        //if item is a number -- we will not markup the data.  This isn't optimal but it is clean. Ideally, developer would us ssCurrency and ssCurrency would handle markup(i.e., <strong><em>) cleanup.
                        if (isNaN(item)) {
                            for (var k = 0; k < itemToLowerCaseSplitArray.length; ++k) {
                                itemWithMarkup += item.substring(previousSplitIndex, previousSplitIndex + itemToLowerCaseSplitArray[k].length);
                                previousSplitIndex = previousSplitIndex + itemToLowerCaseSplitArray[k].length;
                                if (k < itemToLowerCaseSplitArray.length - 1) {
                                    itemWithMarkup += '<strong><em>' + originalMatchedString + '</em></strong>';
                                    previousSplitIndex += originalMatchedString.length;
                                }
                            }
                        } else {
                            itemWithMarkup = item + '';//  * 1; //TT - with the "* 1" it was stripping off the zero if it is a decimal
                        }

                        eval('newRowData.' + columnKeys[j] + ' = itemWithMarkup');

                        if (matchFound) {
                            aoDataToRender.pop(); //This ensures we don't push the same row more than once.
                        }


                        //add properties that may be missing from newRowData
                        $.each(rowData, function (key, value) {
                            eval('var newItem = newRowData.' + key);
                            if (newItem == null) {
                                eval('newRowData.' + key + '= rowData.' + key);
                            }
                        });

                        //The code above is pure JS and effecient. It will eliminate the majority of non-matches. 
                        //The code below uses jQuery.text() which likely performs a DOM insertion and the developer's rowRenderFn may have unpredictable execution times.
                        //But that is OK since the code above aborts the majority of loop iterations.
                        var rowHtml = rowRenderFn(0, rowData, rowRenderColumnKeys, []);
                        var rowText = jQuery(rowHtml).text().toLowerCase(); //strips html markup. 
                        var indexOfSearchString = rowText.indexOf(searchStringToLowerCase);
                        if (indexOfSearchString != -1) {
                            aoDataToRender.push(newRowData);
                            matchFound = true;
                        }

                    }
                }
            }


            $(this).data('ssTable').aoDataToRender = aoDataToRender;
            $(this).data('ssTable').aoDataToSearch = aoDataToRender; //this way we just keep searching the subset on next key press

            //TODO: Preserve old search objects? This way we can handle case of delete key. Perhaps associative array based on search string if it is fast enough. 
            var recordCount = aoDataToRender.length;

            if (recordCount == 1 && jQuery.isEmptyObject(aoDataToRender[0])) {
                recordCount = 0;
            }

            $($(this).data('ssTable').spanRecordCount).text(recordCount);
            $(this).ssTable('initializeTables');
            $(this).ssTable('_resizeScrollbars');


            if (typeof $(this).data('ssTable').onSearchCallBack != 'undefined') {
                $(this).data('ssTable').onSearchCallBack();
            }
        },

        refreshViewAndPreserveScrollPosition: function () {
            var requiredDivHeight = $(this).data('ssTable').requiredDivHeight;
            var numberOfChunks = $(this).data('ssTable').numberOfChunks; //this is ceil(aoDataToRender.length / numOfRowsInChunk)
            var tableChunkHTMLString = $(this).data('ssTable').tableChunkHTMLString;
            var numberOfRowsInChunk = $(this).data('ssTable').numberOfRowsInChunk;
            var rowHeight = $(this).data('ssTable').rowHeight;
            var divTableViewer = $(this).data('ssTable').divTableViewer;
            var numberOfRowsInLastChunk = $(this).data('ssTable').numberOfRowsInLastChunk;
            var useDivScrollScaling = $(this).data('ssTable').useDivScrollScaling;
            var scrollTop = $(divTableViewer).scrollTop();
            var scrollBottom = scrollTop - (parseInt($(divTableViewer).height() - $(this).ssTable('_getCurrentBrowserScrollbarWidth')));
            var scrollCenter = (scrollTop + scrollBottom) / 2;
            var percentScroll = scrollCenter / requiredDivHeight;
            var totalScrollableHeight = requiredDivHeight - (parseInt($(divTableViewer).height() - $(this).ssTable('_getCurrentBrowserScrollbarWidth')));
            percentScroll = scrollTop / totalScrollableHeight;

            var middleChunkIndex = Math.round(percentScroll * (numberOfChunks - 1));

            if (middleChunkIndex < 1) {
                middleChunkIndex = 1;
            }

            if (middleChunkIndex > numberOfChunks - 2) {
                middleChunkIndex = numberOfChunks - 2;
            }

            $(divTableViewer).find('table.tableChunk').each(function () { $(this).remove(); }); // remove all
            $(divTableViewer).append(tableChunkHTMLString);
            $(divTableViewer).find('table.tableChunk').attr('data-id', 'tableChunk' + middleChunkIndex);
            $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk'));
            var tableChunkHeight = numberOfRowsInChunk * rowHeight;
            var middleTableChunkTop = middleChunkIndex * tableChunkHeight;

            $(divTableViewer).find('table.tableChunk').css('top', middleTableChunkTop); //assume window is always 1.5 table chunks high 
            $(divTableViewer).prepend(tableChunkHTMLString);
            $(divTableViewer).find('table.tableChunk').first().attr('data-id', 'tableChunk' + (middleChunkIndex * 1 - 1));
            $(divTableViewer).find('table.tableChunk').first().css('top', middleTableChunkTop - numberOfRowsInChunk * rowHeight); //assume window is always 1.5 table chunks high 
            $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').first());

            $(divTableViewer).append(tableChunkHTMLString);
            $(divTableViewer).find('table.tableChunk').last().attr('data-id', 'tableChunk' + (middleChunkIndex * 1 + 1));
            $(divTableViewer).find('table.tableChunk').last().css('top', middleTableChunkTop + numberOfRowsInChunk * rowHeight);
            $(this).ssTable('createTBodyStr', $(divTableViewer).find('table.tableChunk').last());
        },

        refreshScrollPositionAndPreserveView: function () {
            var requiredDivHeight = $(this).data('ssTable').requiredDivHeight;
            var numberOfChunks = $(this).data('ssTable').numberOfChunks; //this is ceil(aoDataToRender.length / numOfRowsInChunk)
            var calculatedDivHeightToActualHeightRatio = $(this).data('ssTable').calculatedDivHeightToActualHeightRatio;
            var numberOfRowsInChunk = $(this).data('ssTable').numberOfRowsInChunk;
            var rowHeight = $(this).data('ssTable').rowHeight;
            var divTableViewer = $(this).data('ssTable').divTableViewer;
            var scrollTop = $(divTableViewer).scrollTop();
            var firstTableChunkTopPosition = parseInt($($(divTableViewer).find('table.tableChunk').get(0)).css('top'));
            var firstTableChunkTopPositionDelta = scrollTop - firstTableChunkTopPosition; //always positive;
            var firstTableChunkID = $($(divTableViewer).find('table.tableChunk').get(0)).attr('data-id');
            var firstTableChunkIndex = firstTableChunkID.split('tableChunk').pop();
            var firstTableChunkNonScaledTopPosition = firstTableChunkIndex * numberOfRowsInChunk * rowHeight;
            var firstTableChunkScaledTopPosition = Math.round(firstTableChunkNonScaledTopPosition / calculatedDivHeightToActualHeightRatio);

            $($(divTableViewer).find('table.tableChunk').get(0)).css('top', firstTableChunkScaledTopPosition);
            $($(divTableViewer).find('table.tableChunk').get(1)).css('top', firstTableChunkScaledTopPosition + numberOfRowsInChunk * rowHeight);
            $($(divTableViewer).find('table.tableChunk').get(2)).css('top', firstTableChunkScaledTopPosition + 2 * numberOfRowsInChunk * rowHeight);
            $($(this).data('ssTable').divTableViewer).scrollTop(firstTableChunkScaledTopPosition + firstTableChunkTopPositionDelta);

            //if block below is clean up in case the row is in the last table chunk.
            if ($($(divTableViewer).find('table.tableChunk').get(1)).find('tr').length == 0) {
                firstTableChunkTopPositionDelta = firstTableChunkTopPositionDelta - $(divTableViewer).innerHeight() + rowHeight;
            }

            $($(this).data('ssTable').divTableViewer).scrollTop(firstTableChunkScaledTopPosition + firstTableChunkTopPositionDelta);
            $(this).data('ssTable').scrollCallBackIsBusy = false;
        },

        loadUserPreferences: function () {
            //get column order and width:
            var tableName = $(this).attr('id');
            var ssTable = $(this);
            var columnSortAndDirection = ssCookie.read(tableName + '_columnSortAndDirection');
            var columnOrdersCSV = ssCookie.read(tableName + '_columnOrdersCSV');
            var columnWidthsCSV = null; // ssCookie.read(tableName + '_columnWidthsCSV'); #LP the column width adjustment needs review
            var tableHeader = $(this).data('ssTable').tableHeader;

            if (columnOrdersCSV != null) {
                try {
                    var columnOrders = columnOrdersCSV.split(',');

                    if (columnOrders.length == $(tableHeader).find('th').length) {
                        var thElements = [];

                        for (var i = 0; i < columnOrders.length; ++i) {
                            columnKey = columnOrders[i];
                            var thElement = $(tableHeader).find('th[data-key="' + columnKey + '"]').detach();
                            thElements.push(thElement);
                        }

                        var trHeader = $(tableHeader).find('tr');

                        for (var i = 0; i < thElements.length; ++i) {
                            var thElement = thElements[i];
                            $(trHeader).append(thElement);
                        }
                    }
                } catch (err) {
                    //No cookie :(
                }
            }

            if (columnWidthsCSV != null) {
                try {
                    var columnWidths = columnWidthsCSV.split(',');

                    if (columnWidths.length == $(tableHeader).find('th').length) {
                        $(tableHeader).find('th').each(function (index) {
                            $(this).css('width', columnWidths[index] + 'px');
                        });
                    }
                } catch (err) {
                    //No cookie :(
                }
            }

            if (columnSortAndDirection != null) {
                try {
                    var sortColumnKey = columnSortAndDirection.split(',')[0];
                    var sortDirection = columnSortAndDirection.split(',')[1];
                    $(tableHeader).find('th').removeClass('sortDesc');
                    $(tableHeader).find('th').removeClass('sortAsc');
                    $(tableHeader).find('th').each(function () {
                        var columnKey = $(this).attr('data-key');
                        if (columnKey == sortColumnKey) {
                            if (sortDirection == 'asc') {

                                $(this).addClass('sortDesc');

                            } else {
                                $(this).addClass('sortAsc');
                            }
                            $(this).trigger('click');
                            return false; //end the iteration
                        }
                    });
                } catch (err) {
                    //No cookie :(
                }
            }

            $(this).ssTable('endTHMouseDownEvent'); //this refreshes resize handles
        },

        saveUserPreferences: function () {
            //get column order and width:
            var columnOrders = [];
            var columnWidths = [];
            var tableHeader = $(this).data('ssTable').tableHeader;
            $(tableHeader).find('th').each(function () {
                var columnKey = $(this).attr('data-key');
                columnOrders.push(columnKey);
                var columnWidth = $(this).width();
                columnWidths.push(columnWidth);
            });
            var columnOrdersCSV = columnOrders.join(',');
            var columnWidthsCSV = columnWidths.join(',');
            var tableName = $(this).attr('id');

            ssCookie.save(tableName + '_columnOrdersCSV', columnOrdersCSV, null);
            ssCookie.save(tableName + '_columnWidthsCSV', columnWidthsCSV, null);

            var sortColumnKey = '';
            var sortDirection = '';
            var sortColumnElement = $(tableHeader).find('.sortAsc');

            if (sortColumnElement.length == 0) {
                sortColumnElement = $(tableHeader).find('.sortDesc');
            }

            if (sortColumnElement.length != 0) {
                sortColumnKey = $(sortColumnElement).attr('data-key');

                if ($(sortColumnElement).hasClass('sortAsc')) {
                    sortDirection = 'asc';
                } else {
                    sortDirection = 'desc';
                }
            }

            var columnSortAndDirection = sortColumnKey + ',' + sortDirection;
            ssCookie.save(tableName + '_columnSortAndDirection', columnSortAndDirection, null);
        },

        _getCurrentBrowserScrollbarWidth: function () {
            var scrollControlShortEdgeDimension = $(this).data('ssTable').scrollControlShortEdgeDimension;

            if (scrollControlShortEdgeDimension == null) {
                var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
                // Append our div, do our calculation and then remove it 
                $('body').append(div);
                var w1 = $('div', div).innerWidth();
                div.css('overflow-y', 'scroll');
                var w2 = $('div', div).innerWidth();

                $(div).remove();
                scrollControlShortEdgeDimension = w1 - w2;

                if (scrollControlShortEdgeDimension == 0 || scrollControlShortEdgeDimension == null || isNaN(scrollControlShortEdgeDimension)) {
                    scrollControlShortEdgeDimension = 17; //magic number time.
                }

                return scrollControlShortEdgeDimension;
            } else {
                return scrollControlShortEdgeDimension;
            }
        }
    };

    $.fn.ssTable = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ssTable');
        }
    };
})(jQuery);

//LP code below is marked for deletion. see styleAttributeForTableCells instead
var ssTableValues = new function () {
    var thWidthsArray = [];

    return {
        thWidthsArray: thWidthsArray
    };
};