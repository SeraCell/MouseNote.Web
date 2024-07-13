if ($("#entryLaneLabel").length) {
    var currentTime = 0;
    var entry = JSON.parse(localStorage.getItem("SelectedEntry"));
    var index = localStorage.getItem("SelectedIndex");
    $("#entryIndexLabel").html(index);
    $("#entryLaneLabel").html(entry.lane);
    $("#entryStartLabel").html(entry.start);
    $("#entryEndLabel").html(entry.end);

    localStorage.setItem("EntryUpdate", "");

    $("#editSaveButton").click(function () {
        var saveEntry = new Object();
        saveEntry.index = $("#entryIndexLabel").html();
        saveEntry.lane = $("#entryLaneLabel").html();
        saveEntry.start = $("#entryStartLabel").html();
        saveEntry.end = $("#entryEndLabel").html();
        localStorage.setItem("EntryUpdate", JSON.stringify(saveEntry));
        window.opener.GetEditWindowLocation();
        window.close();
    });

    $("#editCancelButton").click(function () {
        window.close();
    });

    $("#editAdjustStartButton").click(function(){
        $("#entryStartLabel").html(currentTime);
    });

    $("#editAdjustEndButton").click(function(){
        $("#entryEndLabel").html(currentTime);
    });

    window.setInterval(refreshCurrentTime, 50);
    function refreshCurrentTime() {
        currentTime = parseFloat(localStorage.getItem("currentTime"));
        $("#entryCurrentTime").html(currentTime);
    }
}
