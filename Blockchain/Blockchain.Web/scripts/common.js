//checkbox
$(document).ready(function () {

    $(document).delegate('.sort-modal', 'click', function (e) {
        e.preventDefault();
        e.stopPropagation();
    })

    $(document).delegate('.tabs a', 'click', function () {
        var options = {
            container: "body",
            toggle: "popover", 
            placement: "right",
            trigger: "hover",
        };
        $('.popovers').popover(options);
    })

});