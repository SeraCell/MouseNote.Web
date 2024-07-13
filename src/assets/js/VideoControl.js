/*	Tasks
 *	Make time entries merge if they overlap
 *
 *
 *
 */


var config;
var timeEntries = [];
var selectedEntry = null;
var selectedIndex = null;
var timelineZoom = 20;
var maxZoom = 49.5;
var timeFocusOffset = $("#sideScroll").width() / 2;
var rulerMajorTick = 5;
var rulerMinorTick = 1;
var minorTickThreshold = 10;
var wasPlaying = false;
// var editWindow;
var settingsWindow;
var configWindow;
var sessionDetailsWindow;
var laneToHide;
var hiddenLanes = [];

var editStart = false;
var editEnd = false;

var currentSpeed = 1;
var maxSpeed = 3;
var minSpeed = .1;
var currentMagnification = 1;
var maxMagnification = 3;

var sessionDetails = null;
var activeGroup = null;

var vid = document.getElementById("videoWindow");

//THEME
var barColor = "rgba(150,150,255,1)";


$(document).ready(function () {

	LoadConfig();
	LoadLastSession();
	currentMagnification = config.Magnification;
	SetMagnification(currentMagnification);

	vid.oncanplay = function () {
		wasPlaying = false;
		// if (!WindowOpen(editWindow)) {
		// 	BuildTimeline();
		// }
		InsertAutoRuler(rulerMajorTick, false);
		$("#scannerInput").prop("max", vid.duration);
	}

	vid.ontimeupdate = function () {
		$("#scannerInput").val(vid.currentTime);
	}

	$("body").on("click", ".timeEntryBlock", function () {
		StartEdit(this);
	});

	var autosaveString = localStorage.getItem("AutoSave");
	if (autosaveString.length > 1) {
		timeEntries = JSON.parse(autosaveString);
		BuildTimeline();
	}

});

function StartEdit(element) {
	if (selectedEntry != null) {
		return;
	}
	$("#editDiv").addClass("d-flex");
	$("#editDiv").removeClass("d-none");
	$("#maskDiv").removeClass("d-flex");
	$("#maskDiv").addClass("d-none");

	$(element).css("background", "green");
	var ind = $(">input:first", element).val();
	selectedEntry = timeEntries[ind];
	selectedIndex = ind;
	$("#startEditLabel").html(selectedEntry.start);
	$("#endEditLabel").html(selectedEntry.end);
	editStart = false;
	editEnd = false;
	vid.currentTime = selectedEntry.start;

	(function editUpdate() {
		if (selectedEntry != null) {
			if (editStart) {
				selectedEntry.start = vid.currentTime;
			}
			if (editEnd) {
				selectedEntry.end = vid.currentTime;
			}
			$("#startEditLabel").html(FormatTime(selectedEntry.start, 2));
			$("#endEditLabel").html(FormatTime(selectedEntry.end, 2));
			BuildTimeline();
			window.setTimeout(editUpdate, 100);
		}
		else {
			BuildTimeline();

		}
	})()
};
function EndEdit() {
	selectedIndex = null;
	selectedEntry = null;
	editStart = false;
	editEnd = false;

	$("#editDiv").removeClass("d-flex");
	$("#editDiv").addClass("d-none");
	$("#maskDiv").addClass("d-flex");
	$("#maskDiv").removeClass("d-none");

	$("#endEditLabel").css("background", "transparent");
	$("#startEditLabel").css("background", "transparent");
};

$("#startEditLabel").click(function () {
	if (selectedEntry != null) {
		editEnd = false;
		editStart = true;
		vid.currentTime = selectedEntry.start;
		$("#endEditLabel").css("background", "transparent");
		$("#startEditLabel").css("background", "coral");
	}
});

$("#endEditLabel").click(function () {
	if (selectedEntry != null) {
		editStart = false;
		editEnd = true;
		vid.currentTime = selectedEntry.end;
		$("#startEditLabel").css("background", "transparent");
		$("#endEditLabel").css("background", "coral");
	}
});

$("#adjustmentSaveButton").click(function () {
	EndEdit();
});

$("#deleteEntryButton").click(function () {
	timeEntries.splice(selectedIndex, 1);
	EndEdit();
});

$("#rulerContainer").click(function (e) {
	var parentOffset = $(this).offset();
	var relX = e.pageX - parentOffset.left;
	var relY = e.pageY - parentOffset.top;
	vid.currentTime = relX / timelineZoom;
});

$("#videoInput").change(function () {
	//timeEntries = [];
	BuildTimeline();
});

// $("#zoomIn").click(function () {
// 	timelineZoom += 1;
// 	if (timelineZoom > maxZoom) {
// 		timelineZoom = maxZoom;
// 	}
// 	//Add Ruler
// 	BuildTimeline();
// 	InsertAutoRuler(rulerMajorTick, false);
// });
// $("#zoomOut").click(function () {
// 	timelineZoom -= 1;
// 	if (timelineZoom < 1) {
// 		timelineZoom = 1;
// 	}
// 	//Add Ruler
// 	BuildTimeline();
// 	InsertAutoRuler(rulerMajorTick, false);
// });

//Shared controls
$("#sessionButton").click(function () {
	if (WindowOpen(sessionDetailsWindow)) {
		sessionDetailsWindow.focus();
		return
	}

	sessionDetailsWindow = window.open("SessionDetails.html", "popupWindow", "width=600, height=800, scrollbars=yes");
});

$("#settingsButton").click(function () {
	if (WindowOpen(settingsWindow)) {
		settingsWindow.focus();
		return
	}

	settingsWindow = window.open("Settings.html", "popupWindow", "width=600, height=400, scrollbars=yes");
});
$("#configButton").click(function () {
	if (WindowOpen(configWindow)) {
		configWindow.focus();
		return
	}
	configWindow = window.open("Config.html", "popupWindow", "width=600, height=400, scrollbars=yes");

});
$("#videoInputButton").click(function () {
	$("#videoInput").trigger("click");
});
$("#uploadProgressButton").click(function () {
	$("#progressInput").val("");
	$("#progressInput").trigger("click");
});
$("#downloadProgressButton").click(function () {
	DownloadProgressCSV();
});
$("#clearProgressButton").click(function () {
	timeEntries = [];
	BuildTimeline();
});
$("#dataExportButton").click(function(){
	console.log("click");
	DownloadResultsCSV();
});

var firstScroll = true;
$("#scrollUpButton").click(function () {
	$("#labelDiv").scrollTop($("#labelDiv").scrollTop() - 40);
});
$("#scrollDownButton").click(function () {
	$("#labelDiv").scrollTop($("#labelDiv").scrollTop() + 40);
});
$("#laneContainer").scroll(function () {
	if (firstScroll) {
		$("#labelDiv").scrollTop($(this).scrollTop());
		firstScroll = false;
	}
	else {
		firstScroll = true;
	}
});
$("#labelDiv").scroll(function () {
	if (firstScroll) {
		$("#laneContainer").scrollTop($(this).scrollTop());
		firstScroll = false;
	}
	else {
		firstScroll = true;
	}
});
$("#leftDiv").on("click", ".groupNameDiv", function () {
	$(".groupNameDiv").removeClass("selectedGrouping");
	$(".observationNameDiv").removeClass("selectedGrouping");
	$(this).addClass("selectedGrouping");
	var groupNum = $(this).attr("id").split("_")[1];
	$(".observationNameDiv").each(function (index) {
		if ($(this).attr("id").split("_")[1] == groupNum) {
			$(this).addClass("selectedGrouping");
		}
	});

	$("#laneContainer").scrollTop($("#labelDiv").scrollTop() - ($("#labelDiv").offset().top - $(this).offset().top));
	activeGroup = $(this).attr("id").split("_")[1];
});

function PauseVideo() {
	$("#playIcon").removeClass("d-none");
	$("#pauseIcon").addClass("d-none");
	vid.pause();
}
function PlayVideo() {
	$("#playIcon").addClass("d-none");
	$("#pauseIcon").removeClass("d-none");
	vid.play();
	BuildTimeline();
}

$("#playButton").click(function () {
	if (vid.paused) {
		PlayVideo();
	}
	else {
		PauseVideo();
	}
});
$("#pauseButton").click(function () {
	PauseVideo();
});
$("#stepBackButton").click(function () {
	PauseVideo();
	vid.currentTime -= 0.02;
});
$("#stepBack5Button").click(function () {
	PauseVideo();
	vid.currentTime -= 0.1;
});
$("#stepForwardButton").click(function () {
	PauseVideo();
	vid.currentTime += 0.02;
});
$("#stepForward5Button").click(function () {
	PauseVideo();
	vid.currentTime += 0.1;
});
$("#scannerInput").mousedown(function () {
	if (vid.readyState) {
		if (!vid.paused) {
			PauseVideo();
			wasPlaying = true;
		}
	}
});
$("#scannerInput").mouseup(function () {

});
$("#scannerInput").on('input', function () {
	vid.currentTime = $(this).val();
});

$("body").on("click", ".observationNameDiv", function () {
	var splitId = $(this).attr("id").split("_");
	var id = `${splitId[1]}_${splitId[2]}`;
	TriggerLane(id);
});

$("#hideButton").click(function () {
	var i = hiddenLanes.indexOf(laneToHide);
	if (i > -1) {
		hiddenLanes.splice(i, 1);
	}
	else {
		hiddenLanes.push(laneToHide);
	}
	BuildTimeline();

});

function TriggerLane(laneNumber) {
	var activeEntry = timeEntries.find(element => element.lane === laneNumber && element.active == true);
	if (typeof activeEntry == 'undefined' ) {
		var observation = laneNumber.split("_")[1];
		console.log(observation);
		console.log(sessionDetails.observations[observation]);
		if (sessionDetails.observations[observation].referencePoint) {
			for (let i = 0; i < timeEntries.length; i++) {
				const element = timeEntries[i];
				if(element.lane == laneNumber){
					return;
				}
			}
		}
		var newEntry = new TimeEntry();
		newEntry.lane = laneNumber;
		newEntry.start = vid.currentTime;
		if (sessionDetails.observations[observation].singlePoint) {
			newEntry.end = vid.currentTime + 0.5;
			newEntry.active = false;
			timeEntries.push(newEntry);
			BuildTimeline();
		}
		else if (!vid.paused) {
			newEntry.end = vid.currentTime;
			newEntry.active = true;
			timeEntries.push(newEntry);
		}
	}
	else {
		activeEntry.active = false;
		if (vid.currentTime < activeEntry.start) {
			timeEntries.splice(timeEntries.indexOf(activeEntry));
		}
		else {
			activeEntry.end = vid.currentTime;
		}
	}
	// BuildTimeline();
}

document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
	document.getElementById("contextMenu")
		.style.display = "none"
}

function rightClick(e) {
	if (e.path[0].className.split(" ").includes("observationNameDiv")) {
		var splitId = e.path[0].id.split("_");
		laneToHide = `${splitId[1]}_${splitId[2]}`;
		e.preventDefault();

		if (document.getElementById("contextMenu")
			.style.display == "block")
			hideMenu();
		else {
			var menu = document.getElementById("contextMenu")

			menu.style.display = 'block';
			menu.style.left = e.pageX + "px";
			menu.style.top = e.pageY + "px";
		}
	}
}

//Timer Updates
(function rulerUpdate() {
	InsertAutoRuler(rulerMajorTick, false);
	window.setTimeout(rulerUpdate, 10000 / vid.playbackRate);
})()

window.setInterval(updateTime, 10);
function updateTime() {

	$("#time").html(`${FormatTime(vid.currentTime, 2)} / ${FormatTime(vid.duration, 2)}   (${((vid.currentTime / vid.duration) * 100).toFixed(1)} %)`);
	if (typeof vid.duration != 'undefined') {
		MoveTimeline();
		UpdateActive();
	}
}

window.setInterval(autoSave, 5000);
function autoSave() {
	localStorage.setItem("AutoSave", JSON.stringify(timeEntries));
}


document.onkeydown = checkKey;

function checkKey(e) {

	e = e || window.event;

	var activeGroup = $(".groupNameDiv.selectedGrouping").first().attr("id").split("_")[1];
	var observation = null;


	for (let index = 0; index < sessionDetails.observations.length; index++) {
		const element = sessionDetails.observations[index];
		if (element.hotkey == e.keyCode) {
			observation = index;
		}
	}
	if (observation != null) {
		$(`#obs_${activeGroup}_${observation}`).trigger("click");
	}
	if (e.keyCode == config.HotKeys.stepSmallBack) {
		$("#stepBackButton").trigger("click");
	}
	if (e.keyCode == config.HotKeys.stepBigBack) {
		$("#stepBack5Button").trigger("click");
	}
	if (e.keyCode == config.HotKeys.stepSmallForward) {
		$("#stepForwardButton").trigger("click");
	}
	if (e.keyCode == config.HotKeys.stepBigForward) {
		$("#stepForward5Button").trigger("click");
	}
}

function BuildTimeline() {
	$("#currentTime").css("height", $("#laneVerticalContainer").css("height"));
	$("#wideLine").css("width", `${vid.duration * timelineZoom}px`);
	$(".lane").each(function (index) {
		$(this).empty();
	})
	timeEntries.forEach(function (element, index) {
		if (!hiddenLanes.includes(element.lane)) {
			var width = (element.end - element.start) * timelineZoom;
			if (width == 0) {
				width = (vid.currentTime - element.start) * timelineZoom;
				
			}
			var bar = barColor
			if (index == selectedIndex) {
				bar = "rgba(110,200,110,1.0)";
			}
			var el = `<div class="timeEntryBlock" style="background:${bar}; position:absolute; top:0;left:${element.start * timelineZoom}px; height:23px; width:${width}px"><input type="hidden" value="${index}"/></dv>`
			$(`#lane_${element.lane}`).append(el);
		}
	})
}

function MoveTimeline() {
	var ctime = (vid.currentTime * timelineZoom).toFixed(0);
	$("#currentTime").css("left", `${ctime}px`);
	$("#sideScroll").scrollLeft(ctime - timeFocusOffset);
}

function UpdateActive() {
	timeEntries.forEach(function (element, index) {
		if (element.active == true) {
			$(`#lane_${element.lane}`).find(`#input${index}`).parent(".timeEntryBlock").remove();
			var width = (element.end - element.start) * timelineZoom;
			if (width == 0) {
				width = (vid.currentTime - element.start) * timelineZoom;
			}
			var el = `<div class="timeEntryBlock" style="background:${barColor}; position:absolute; top:0;left:${element.start * timelineZoom}px; height:23px; width:${width}px"><input type="hidden" value="${index}"/></dv>`
			$(`#lane_${element.lane}`).append(el);
		}
	})
}

function InsertAutoRuler(interval, insertEntire = false) {
	var left = vid.currentTime - (timeFocusOffset / timelineZoom);
	var leftOffset = left % rulerMajorTick;
	left -= leftOffset;
	if (left < 0) {
		left = 0;
	}
	var right = left + ($("#sideScroll").width() / timelineZoom) + 20;
	if (insertEntire) {
		right = vid.duration;
		left = 0;
	}

	$("#rulerContainer").empty();
	InsertMinorRuler(interval, rulerMinorTick, left, right);
	//left = 0;
	InsertRuler(interval, left, right);
}
function InsertRuler(interval, start, end) {
	for (var i = start; i <= end; i += interval) {
		var position = i * timelineZoom;
		if (position > vid.duration * timelineZoom) {
			break;
		}
		var time = new Date(i * 1000).toISOString().substr(11, 8)
		var height = $("#rulerContainer").css("height");
		var majorTick = `<div style="background:black;  position:absolute; width:1px; height:${height}; top:0; left:${position}px;border-width: 1px;border-style: solid;border-top-color: rgba(33, 37, 41,0.3); z-index:1001"></div>`;
		var timeLabel = `<label class="unselectable" style=" position:absolute; top:0px; width:30px; height:${height}; left:${position + 2}px; z-index:1002;padding-top:0px; margin-top:0px;font-size: 10px;" >${time}</label>`;
		$("#rulerContainer").append(majorTick);
		$("#rulerContainer").append(timeLabel);
	}
}
function InsertMinorRuler(majorInterval, minorInterval, start, end) {
	if (timelineZoom >= minorTickThreshold) {
		for (var i = start; i <= end; i += minorInterval) {
			var position = i * timelineZoom;
			if (position > vid.duration * timelineZoom) {
				break;
			}
			if (true) {
				var height = $("#rulerContainer").height() / 2;
				var el = `<div style="background:black; position:absolute; width:1px; height:${height}px; bottom:0; left:${position}px; z-index:1001"></div>`
				$("#rulerContainer").append(el);
			}
		}
	}
}

function SetMagnification(mag) {
	var baseWidth = $(vid).prop("width");
	var baseHeight = $(vid).prop("height");
	currentMagnification = Ceiling(mag, maxMagnification);
	$(vid).css("width", baseWidth * currentMagnification);
	$(vid).css("height", baseHeight * currentMagnification);
	return currentMagnification;
}
function GetMagnification() {
	return currentMagnification;
}

function SetSpeed(speed) {
	currentSpeed = Constrain(speed, minSpeed, maxSpeed);
	vid.playbackRate = currentSpeed;
	return currentSpeed;
}
function GetSpeed() {
	return currentSpeed;
}

function Ceiling(number, max) {
	if (number > max) {
		number = max;
	}
	return number;
}

function Floor(number, min) {
	if (number < min) {
		number = min;
	}
	return number;
}

function Constrain(number, min, max) {
	return Floor(Ceiling(number, max), min);
}

function DownloadProgressCSV() {
	let csvContent = "";

	timeEntries.forEach(function (entry) {
		var row = `${entry.lane},${entry.start},${entry.end},0`;
		csvContent += row + "\n";
	});
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
	hiddenElement.target = '_blank';
	hiddenElement.download = `${$("#videoInput").val().substr(12)}.csv`;
	hiddenElement.click();
}

function DownloadSessionDetails(name) {
	console.log("1");
	DownloadJSON(name, JSON.stringify(sessionDetails));
}
// (function UploadSessionDetails() {
// 	console.log("upload");
// 	var input = document.getElementById("sessionInput");
// 	var sessionString;
// 	readInput = function () {
// 		var fr = new FileReader();
// 		fr.onload = function () {
// 			sessionString = fr.result;
// 			sessionDetails = JSON.parse(sessionString);
// 			if (!sessionDetailsWindow.closed) {
// 				sessionDetailsWindow.close();
// 			}
// 			$("#sessionButton").trigger("click");
// 		}
// 		fr.readAsBinaryString(input.files[0]);
// 	};
// 	input.addEventListener("change", readInput);
// })()

function DownloadResultsCSV(){
	var header = "Group,Observation,Start,Stop,Duration";
	var body = "";
	var obsNames = [];
	sessionDetails.observations.forEach(element => {
		if(element.referencePoint){
			header += `,From_${element.name}_Start`;
			//header += `,From_${element.name}_End`;
		}
	});
	header += "\n"

	var sortedEntries = timeEntries.sort((a,b) => (a.lane > b.lane) ? 1 : (a.lane === b.lane) ? ((a.start > b.start) ? 1 : -1) : -1);

	sortedEntries.forEach(element => {
		var group = sessionDetails.groups[element.lane.split("_")[0]];
		var observation = sessionDetails.observations[element.lane.split("_")[1]];
		body += `${group},${observation.name},`+
				`${element.start.toFixed(4)},`+
				`${(observation.singlePoint) ? "" : element.end.toFixed(4)},`+
				`${(observation.singlePoint) ? "" : (element.end - element.start).toFixed(4)}`
		for (let i = 0; i < sessionDetails.observations.length; i++) {
			const obs = sessionDetails.observations[i];
			if(obs.referencePoint){
				var ref = timeEntries.find(f => f.lane == `${element.lane.split("_")[0]}_${i}`);
				if(ref!= undefined){
					console.log(`${(element.start - ref.start).toFixed(4)}`)
					body += `,${(element.start - ref.start).toFixed(4)}`;
				}
			}
		}
		body += "\n"
	});
	DownloadCSV(`${sessionDetails.name || ""}_Results`, header + body);
}

function DownloadJSON(name, object) {
	console.log("2");
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURI(object);
	console.log(`href= ${hiddenElement.href}`);
	hiddenElement.target = '_blank';
	hiddenElement.download = `${name}.json`;
	hiddenElement.click();
}

function DownloadCSV(name, content) {
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(content);
	hiddenElement.target = '_blank';
	hiddenElement.download = `${name}.csv`;
	hiddenElement.click();
}

(function ReadProgressCSV() {
	var input = document.getElementById("progressInput");
	var progressString;
	readInput = function () {
		var fr = new FileReader();
		fr.onload = function () {
			progressString = fr.result;
			var rows = progressString.split("\n");
			timeEntries = [];
			rows.forEach(function (item, index) {
				var splitRow = item.split(",");
				var entry = new TimeEntry();
				entry.lane = splitRow[0];
				entry.start = splitRow[1];
				entry.end = splitRow[2];
				entry.active = splitRow[3];
				timeEntries.push(entry);
			});
			BuildTimeline();
		}
		fr.readAsBinaryString(input.files[0]);
	};
	input.addEventListener("change", readInput);
})();

function LoadConfig() {
	var configString = localStorage.getItem("Config");
	config = new Config();
	if (configString != null) {
		config = JSON.parse(configString);
	}
	SaveConfig();
};

function LoadLastSession() {
	var sessionString = localStorage.getItem("Session");
	if (sessionString != null) {
		sessionDetails = JSON.parse(sessionString);
		LaneCountChanged();
	}
	else {
		sessionDetails = new SessionDetails();
		sessionDetails.observations = [new Observation()];
		LaneCountChanged();
	}
}

function SaveConfig() {
	localStorage.setItem("Config", JSON.stringify(config));
}

function SaveCurrentSession() {
	localStorage.setItem("Session", JSON.stringify(sessionDetails));
}

function WindowOpen(window) {
	if (typeof window !== 'undefined' && !window.closed) {
		return true;
	}
	return false;
}

// function GetEditWindowLocation() {
// 	editWindowX = editWindow.screenX;
// 	editWindowY = editWindow.screenY;

// 	alert(`x:${editWindowX}  y:${editWindowY}`);
// }

function FormatTime(seconds, decimals) {
	var currentTimeTotal = seconds;
	var currentTimeSeconds = currentTimeTotal % 60;
	var currentTimeMinutes = (currentTimeTotal - currentTimeSeconds) / 60;
	return `${String(currentTimeMinutes).padStart(decimals, "0")}:${currentTimeSeconds.toFixed(2).padStart(3 + decimals, "0")}`
}

function LaneCountChanged() {
	SaveCurrentSession();
	$("#laneVerticalContainer").empty();
	$("#groupContainer").empty();
	$("#obsContainer").empty();
	for (let i = 0; i < sessionDetails.groups.length; i++) {
		const group = sessionDetails.groups[i];
		$("#groupContainer").append(`<div id="group_${i}" class="groupNameDiv text-nowrap" style="height: ${25 * sessionDetails.observations.length}px;width: 100%; min-width: 50px; border-width: 1px;border-style: solid; box-sizing: border-box;">${group}</div>`);

		for (let j = 0; j < sessionDetails.observations.length; j++) {
			const obs = sessionDetails.observations[j];
			$("#obsContainer").append(`<div id="obs_${i}_${j}" class="observationNameDiv text-nowrap noSelect" style="height: 25px;width: 100%; min-width: 50px; border-width: 1px;border-style: solid; box-sizing: border-box;">${obs.name}</div>`);
			$("#laneVerticalContainer").append(`<div id="lane_${i}_${j}" class="lane" style="height: 25px;width: 100%;border-width: 1px;border-style: solid; box-sizing: border-box; position: relative"></div>`);
		}
	}
	BuildTimeline();
	$(".groupNameDiv:first").trigger("click");
	return true;
};


//Models
class TimeEntry {
	constructor() {
		this.lane = 0;
		this.start = 0;
		this.end = 0;
		this.active = false;
	}
}

class Config {
	constructor() {
		this.HotKeys = new HotKeyDict();
		this.Magnification = 2;
		this.Speed = 1;
	}
}
class HotKeyDict {
	constructor() {
		this.stepSmallBack = '37';
		this.stepBigBack = '40';
		this.stepSmallForward = '39';
		this.stepBigForward = '38';
		this.play = '32';
	}
}





//Cookies
function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
function eraseCookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}