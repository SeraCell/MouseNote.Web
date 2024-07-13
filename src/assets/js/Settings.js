if ($("#SettingsPage").length) {

    //FILL PAGE
    $("#magnificationInput").val(window.opener.currentMagnification);
    $("#timelineZoomInput").val(window.opener.timelineZoom);
    $("#speedInput").val(window.opener.currentSpeed);
    //ATTACH EVENTS
    $("#magnificationInput").change(function () {
        var mag = window.opener.SetMagnification($(this).val());
        $(this).val(mag);
    });
    $("#timelineZoomInput").change(function () {
        if ($(this).val() > window.opener.maxZoom) {
            $(this).css("background", "pink");
        }
        else { 
            $(this).css("background", "transparent");
        }
        window.opener.timelineZoom = $(this).val();
        window.opener.BuildTimeline();
    });
    $("#speedInput").change(function () {
        var speed = window.opener.SetSpeed($(this).val());
        $(this).val(speed);
    });
}