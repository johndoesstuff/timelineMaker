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

function Timeframe(date1, date2) {
	this.start = date1;
	this.end = date2;
	this.z = 0;
}

function addDates() {
	const date1 = new Date(document.getElementById('date1').value);
	const date2 = new Date(document.getElementById('date2').value);

	if (isNaN(date1) || isNaN(date2)) {
		alert("Please enter valid dates.");
		return;
	}

	window.timeline.elements.push(new Timeframe(date1, date2));

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

	for (let timeframe of timeline.elements) {
		let eventDiv = document.createElement("div");
		eventDiv.style.position = "absolute";
		eventDiv.style.left = dateToX(timeframe.start) + "px";
		console.log(eventDiv.style.left);
		eventDiv.style.top = (timeframe.z * 30 + 3) + "px";
		console.log(eventDiv.style.top);
		eventDiv.style.width = (dateToX(timeframe.end) - dateToX(timeframe.start)) + "px";
		eventDiv.style.height = "24px";
		eventDiv.style.backgroundColor = "rgba(82, 108, 237, 0.78)";
		eventDiv.style.border = "1px solid black";
		eventDiv.style.borderRadius = "6px";

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


function dateToX(date) {
	let datems = date.getTime();
	let startms = window.timeline.startDisplay.getTime();
	let endms = window.timeline.endDisplay.getTime();

	let t = (datems-endms)/(startms-endms);

	return timelineContainer.clientWidth*t;
}

renderTimeline();
