//const canvas = document.getElementById("canvas");
//canvas.width = canvas.clientWidth;
//canvas.height = canvas.width * 1/3;
const timelineContainer = document.getElementById("timeline");
//const ctx = canvas.getContext("2d");
const dayms = 1000*60*60*24;
const yearms = 365*dayms;

window.timeline = {
	elements: [],
	startDisplay: new Date(),
	endDisplay: new Date(new Date() - yearms),
};

function Timeframe(date1, date2, title) {
	this.start = date1;
	this.end = date2;
	this.z = 0;
	this.title = title;
}

function addDates() {
	const date1 = new Date(document.getElementById('date1').value);
	const date2 = new Date(document.getElementById('date2').value);

	const title = document.getElementById('textInput').value;

	if (isNaN(date1) || isNaN(date2)) {
		alert("Please enter valid dates.");
		return;
	}

	window.timeline.elements.push(new Timeframe(date1, date2, title));

	renderTimeline();
}

function renderTimeline() {
	if (timeline.elements.length > 0) timeline.endDisplay = timeline.elements.sort((a, b) => (a.start.getTime() - b.start.getTime()))[0].start;

	let c = 0;
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	timelineContainer.innerHTML = "";
	timelineContainer.style.position = "relative";
	timelineContainer.style.display = "flex";
	timelineContainer.style.flexDirection = "column";

	/*for (let i = timeline.endDisplay.getTime(); i <= timeline.startDisplay.getTime(); i += dayms) {
		let day = new Date(i);
		let dayEnd = new Date(i + dayms);
		const col = day.getYear()%2 + day.getMonth()%2 + day.getDay()%2;
		ctx.fillStyle = (['#fff', '#eee', '#ddd', '#ccc'])[col];
		ctx.fillRect(dateToX(day), 0, dateToX(day) - dateToX(dayEnd), canvas.height);
		c++;
		c %= 2;
	}*/

	formatTimeline();
	addMarkers();

	for (let timeframe of timeline.elements) {
		let eventDiv = document.createElement("div");
		eventDiv.style.position = "absolute";
		eventDiv.style.left = 100 * dateToX(timeframe.start) + "%";
		console.log(eventDiv.style.left);
		eventDiv.style.top = (timeframe.z * 30 + 3) + "px";
		console.log(eventDiv.style.top);
		eventDiv.style.width = 100 * (dateToX(timeframe.end) - dateToX(timeframe.start)) + "%";
		eventDiv.style.height = "24px";
		eventDiv.style.backgroundColor = "rgba(82, 108, 237, 0.78)";
		eventDiv.style.border = "1px solid rgba(0, 0, 0, 0.3)";
		eventDiv.style.borderRadius = "6px";

		eventDiv.title = timeframe.title;

		timelineContainer.appendChild(eventDiv);
	}
}

function formatTimeline() {
	let unformattedElements = [...timeline.elements].sort((a, b) => a.start - b.start); // Sort once
	let z = 0;

	while (unformattedElements.length > 0 && z < 10) {
		let t = timeline.endDisplay.getTime();
		let remainingElements = [];

		for (let i = 0; i < unformattedElements.length; i++) {
			let e = unformattedElements[i];
			if (e.start.getTime() >= t) {
				e.z = z;
				t = e.end.getTime();
			} else {
				remainingElements.push(e);
			}
		}

		unformattedElements = remainingElements;
		z++;
	}
}

function addMarkers() {
	let range = timeline.startDisplay.getTime() - timeline.endDisplay.getTime();
	let interval;

	if (range > 2 * yearms) {
		interval = yearms;
	} else if (range > 2 * (yearms / 12)) {
		interval = yearms / 12;
	} else if (range > 2 * (dayms * 7)) {
		interval = dayms * 7;
	} else {
		interval = dayms;
	}

	let t = timeline.endDisplay.getTime();
	while (t < timeline.startDisplay.getTime()) {
		let markerDate = new Date(t);
		let x = dateToX(markerDate);

		let marker = document.createElement("div");
		marker.style.position = "absolute";
		marker.style.left = (100 * x) + "%";
		marker.style.bottom = "0px";
		marker.style.width = "1px";
		marker.style.height = "20px";
		marker.style.backgroundColor = "black";

		let label = document.createElement("span");
		label.style.position = "absolute";
		label.style.left = (100 * x + 0.5) + "%";
		label.style.bottom = "5px";
		label.style.fontSize = "12px";
		label.textContent = formatMarkerText(markerDate, interval);

		timelineContainer.appendChild(marker);
		timelineContainer.appendChild(label);

		t += interval;
	}
}

function formatMarkerText(date, interval) {
	if (interval === yearms) {
		return date.getFullYear();
	} else if (interval === yearms / 12) {
		return date.toLocaleString("default", { month: "short", year: "numeric" });
	} else if (interval === dayms * 7) {
		return `Week ${getWeekNumber(date)}, ${date.getFullYear()}`;
	} else {
		return date.toLocaleDateString();
	}
}

function getWeekNumber(date) {
	let firstDay = new Date(date.getFullYear(), 0, 1);
	let pastDays = (date - firstDay) / dayms;
	return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}

function dateToX(date) {
	let datems = date.getTime();
	let startms = window.timeline.startDisplay.getTime();
	let endms = window.timeline.endDisplay.getTime();

	let t = (datems-endms)/(startms-endms);

	return /*timelineContainer.clientWidth**/t;
}

renderTimeline();
