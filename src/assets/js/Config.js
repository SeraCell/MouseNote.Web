if ($("#ConfigPage").length) {


    $("#magnificationInput").change(function(){
        window.opener.config.Magnification = $(this).val();
        window.opener.SaveConfig();
    });
    $("#speedInput").change(function(){
        window.opener.config.Speed = $(this).val();
        window.opener.SaveConfig();
    });
    
    $("#BigStepBackInput").change(function(){
        window.opener.config.HotKeys.stepSmallBack = $(this).val();
        window.opener.SaveConfig();
    });
    $("#SmallStepBackInput").change(function(){
        window.opener.config.HotKeys.stepBigBack = $(this).val();
        window.opener.SaveConfig();
    });
    $("#BigStepForwardInput").change(function(){
        window.opener.config.HotKeys.stepSmallForward = $(this).val();
        window.opener.SaveConfig();
    });
    $("#SmallStepForwardInput").change(function(){
        window.opener.config.HotKeys.stepBigForward = $(this).val();
        window.opener.SaveConfig();
    });

    $("#magnificationInput").val(window.opener.config.Magnification);
    $("#speedInput").val(window.opener.config.Speed);
    $("#configLane1HotkeyInput").val(window.opener.config.HotKeys.lane1);
    $("#configLane2HotkeyInput").val(window.opener.config.HotKeys.lane2);
    $("#configLane3HotkeyInput").val(window.opener.config.HotKeys.lane3);
    $("#configLane4HotkeyInput").val(window.opener.config.HotKeys.lane4);
    $("#BigStepBackInput").val(window.opener.config.HotKeys.stepSmallBack);
    $("#SmallStepBackInput").val(window.opener.config.HotKeys.stepBigBack);
    $("#BigStepForwardInput").val(window.opener.config.HotKeys.stepSmallForward);
    $("#SmallStepForwardInput").val(window.opener.config.HotKeys.stepBigForward);


    


    function RecordKey(key){
        RecordIfFocused("configLane1HotkeyInput", key);
        RecordIfFocused("configLane2HotkeyInput", key);
        RecordIfFocused("configLane3HotkeyInput", key);
        RecordIfFocused("configLane4HotkeyInput", key);
        RecordIfFocused("BigStepBackInput", key);
        RecordIfFocused("SmallStepBackInput", key);
        RecordIfFocused("BigStepForwardInput", key);
        RecordIfFocused("SmallStepForwardInput", key);
    }
    function RecordIfFocused(inputId, key){

        if(document.getElementById(inputId) === document.activeElement){
            $(`#${inputId}`).val(`${key.keyCode}`);
            $(`#${inputId}`).trigger("change");
        }
    }

    document.onkeydown = checkKey;

    function checkKey(e) {
        e = e || window.event;
        RecordKey(e);
    }
}