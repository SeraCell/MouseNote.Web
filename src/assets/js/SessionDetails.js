class SessionDetails {
    constructor() {
        this.name = "";
        this.groups = [];
        this.observations = [];
    }
}
class Observation {
    constructor() {
        this.name = '';
        this.hotkey = '';
        this.singlePoint = false;
        this.referencePoint = false;
    }
}

(function UploadSessionDetails() {
    console.log("Upload function initial run");
    var input = document.getElementById("sessionInput");
    var sessionString;
    readInput = function () {
        var fr = new FileReader();
        fr.onload = function () {
            sessionString = fr.result;
            window.opener.sessionDetails = JSON.parse(sessionString);
            if (!window.opener.sessionDetailsWindow.closed) {
                window.opener.sessionDetailsWindow.close();
            }
            window.opener.$("#sessionButton").trigger("click");
        }
        fr.readAsBinaryString(input.files[0]);
    };
    input.addEventListener("change", readInput);
})()
if ($("#SessionPage").length) {

    var loadedDetails = new SessionDetails();

    var groupLabelRow = "groupLabelRow";
    var observationLabelRow = "observationLabelRow";
    var observationRefRow = "observationRefRow";
    var observationSPRow = "observationSPRow";
    var observationHotkeyRow = "observationHotkeyRow";
    var observationHotkeyNameRow = "observationHotkeyNameRow";
    var observationOptionRow = "observationOptionRow";
    var groupLabelInput = "groupLabelInput";
    var observationLabelInput = "observationLabelInput";
    var observationRefInput = "observationRefInput";
    var observationSPInput = "observationSPInput";
    var observationLabelInput = "observationLabelInput";
    var observationHotkeyInput = "observationHotkeyInput";
    var observationHotkeyName = "observationHotkeyName";
    var sessionNameInput = "sessionNameInput";
    var groupCountInput = "groupCountInput";
    var observationCountInput = "observationCountInput";


    $("#clearButton").click(function () {
        ClearSessionDetails();
    });
    $("#downloadButton").click(function () {
        window.opener.DownloadSessionDetails(`${$("#sessionNameInput").val()}_SessionDetails`);
    });
    $("#uploadButton").click(function () {
        //ClearSessionDetails();
        $("#sessionInput").val("");
        console.log("upload click");
        //$("#sessionInput").trigger("click");
        document.getElementById('sessionInput').click()
        // window.opener.$("#sessionInput").val("");
        // window.opener.$("#sessionInput").trigger("click");
    });

    $("#groupCountInput").change(function () {
        var existingGroups = GetGroups();
        if (existingGroups.length > 0) {
            loadedDetails.groups = existingGroups;
        }
        $(".groupLabelRow").remove();
        for (let i = $("#groupCountInput").val() - 1; i >= 0; i--) {
            $(`<tr id="${groupLabelRow}${i}" class="${groupLabelRow}">` +
                `<td><label style="margin-left:25px;">Group ${i + 1} Label</label></td>` +
                `<td><input id="${groupLabelInput}${i}" class="${groupLabelInput}" type="text" /></td></tr>`
            ).insertAfter("#groupCountInputRow");
        }

        FillGroups();
    });
    $("#observationCountInput").change(function () {
        var existingObs = GetObservations();
        if (existingObs.length > 0) {
            loadedDetails.observations = existingObs;
        }
        $(".observationOptionRow").remove();
        for (let i = $("#observationCountInput").val() - 1; i >= 0; i--) {
            $(
                `<tr id="${observationLabelRow}${i}" class="${observationOptionRow} ${observationLabelRow}">` +
                `<td><label style="margin-left:25px;">Observation ${i + 1} Label</label></td>` +
                `<td><input id="${observationLabelInput}${i}" class="${observationLabelInput}" type="text" /></td></tr>` +

                `<tr id="${observationHotkeyRow}${i}" class="${observationOptionRow}">` +
                `<td><label style="margin-left:50px;">Observation ${i + 1} Hotkey Value</label></td>` +
                `<td><input id="${observationHotkeyInput}${i}" class="${observationHotkeyInput}" type="text" readonly/></td>` +
                `</tr>` +

                `<tr id="${observationHotkeyNameRow}${i}" class="${observationOptionRow}">` +
                `<td><label style="margin-left:50px;">Observation ${i + 1} Hotkey Name</label></td>` +
                `<td><label id="${observationHotkeyName}${i}" class="${observationHotkeyName}" /></td>` +
                `</tr>` +

                `<tr id="${observationRefRow}${i}" class="${observationOptionRow}">` +
                `<td><label style="margin-left:50px;">Observation ${i + 1} Reference Point?</label></td>` +
                `<td><input id="${observationRefInput}${i}" class="${observationRefInput}" type="checkbox" /></td>` +
                `</tr>` +

                `<tr id="${observationSPRow}${i}" class="${observationOptionRow}">` +
                `<td><label style="margin-left:50px;">Observation ${i + 1} Single Point?</label></td>` +
                `<td><input id="${observationSPInput}${i}" class="${observationSPInput}" type="checkbox" /></td></tr>` +

                ""

            ).insertAfter("#observationCountInputRow");
        }
        FillObservations();
    });

    $("body").on("click", `.${observationHotkeyInput}`, function () {
        $(this).addClass("selectedGrouping");
    });

    $("body").on("click", `.${observationRefInput}`, function () {
        var index = String($(this).prop("id")).substring(observationRefInput.length);
        console.log(index);
        if ($(this).prop("checked") == true) {
            $(`#${observationSPInput}${index}`).prop("checked", true).prop("disabled", true);
        }
        else {
            $(`#${observationSPInput}${index}`).prop("checked", false).prop("disabled", false);
        }
    });

    function LoadSessionDetails() {
        if (window.opener.sessionDetails == null) {
            window.opener.sessionDetails = new SessionDetails();
            window.opener.sessionDetails.groups = [];
            window.opener.sessionDetails.observations = [];
        }
        loadedDetails = window.opener.sessionDetails;
        $(`#${groupCountInput}`).val(window.opener.Floor(loadedDetails.groups.length, 1));
        $(`#${observationCountInput}`).val(window.opener.Floor(loadedDetails.observations.length, 1));
        $(`#${sessionNameInput}`).val(loadedDetails.name);
        $("#groupCountInput").trigger("change");
        $("#observationCountInput").trigger("change");

        FillGroups();
        FillObservations();

    }
    function SaveSessionDetails() {
        var deets = new SessionDetails;
        deets.name = $("#sessionNameInput").val();
        deets.groups = GetGroups();
        deets.observations = GetObservations();

        console.log("Observations");
        console.log(deets.observations);

        window.opener.sessionDetails = deets;
        window.opener.LaneCountChanged();
    }
    function ClearSessionDetails() {

        $(".groupLabelInput").val("");
        $(".observationLabelInput").val("");
        $(".observationHotkeyInput").val("");
        $(`.${observationSPInput}`).prop('checked', false);
        window.opener.sessionDetails = null;
        LoadSessionDetails();
    }

    function FillGroups() {
        for (let index = 0; index < loadedDetails.groups.length; index++) {
            $(`#${groupLabelInput}${index}`).val(loadedDetails.groups[index]);
        }
    }
    function GetGroups() {
        var groups = [];
        $(`.${groupLabelInput}`).each(function () {
            groups.push($(this).val());
        });
        return groups;
    }

    function FillObservations() {
        for (let index = 0; index < loadedDetails.observations.length; index++) {
            var obsv = loadedDetails.observations[index];
            $(`#${observationLabelInput}${index}`).val(obsv.name);
            $(`#${observationHotkeyInput}${index}`).val(obsv.hotkey);
            $(`#${observationHotkeyName}${index}`).html(`"${String.fromCharCode(obsv.hotkey)}"`);
            $(`#${observationSPInput}${index}`).prop('checked', obsv.singlePoint);
            $(`#${observationRefInput}${index}`).prop('checked', obsv.referencePoint);
        }
    }
    function GetObservations() {
        var observations = [];
        for (let index = 0; index < $(`.${observationLabelRow}`).length; index++) {
            var obs = new Observation();
            obs.name = $(`#${observationLabelInput}${index}`).val();
            obs.hotkey = $(`#${observationHotkeyInput}${index}`).val();
            obs.singlePoint = $(`#${observationSPInput}${index}`).is(":checked");
            obs.referencePoint = $(`#${observationRefInput}${index}`).is(":checked");
            observations.push(obs);
            console.log("Ref Checked:");
            console.log($(`#${observationRefInput}${index}`).prop("checked"));
        }
        return observations;
    }

    document.onkeydown = checkKey;
    function checkKey(e) {

        e = e || window.event;
        console.log(e.key);
        var index = $(".selectedGrouping").first().attr("id").substring(observationHotkeyInput.length);
        console.log(index);
        $(`#${observationHotkeyName}${index}`).html(`"${e.key.toUpperCase()}"`);
        $(".selectedGrouping").each(function () {
            $(this).val(e.keyCode);
            $(this).trigger("change");
            console.log(window.opener.sessionDetails);
        });
        $(".selectedGrouping").removeClass("selectedGrouping");
    }



    (function Initialize() {

        $("body").on("change", "input", SaveSessionDetails);
        LoadSessionDetails();
    })();


    function DownloadSessionDetails(name) {
        console.log("1");
        DownloadJSON(name, JSON.stringify(sessionDetails));
    }


}


