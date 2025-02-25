const canvas = document.getElementById("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.width * 1/3;
const ctx = canvas.getContext("2d");
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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = timeline.endDisplay.getTime(); i <= timeline.startDisplay.getTime(); i += dayms) {
		let day = new Date(i);
		let dayEnd = new Date(i + dayms);
		ctx.fillStyle = (["#ddd", "#eee"])[c];
		ctx.fillRect(dateToX(day), 0, dateToX(day) - dateToX(dayEnd), canvas.height);
		c++;
		c %= 2;
	}

	formatTimeline();

	for (let i = 0; i < timeline.elements.length; i++) {
		const timeframe = timeline.elements[i];
		let start = dateToX(timeframe.start);
		let end = dateToX(timeframe.end);
		ctx.fillStyle = "blue";
		ctx.fillRect(start, timeframe.z*30, end-start, 30);
	}
}

function formatTimeline() {
	let unformattedElements = timeline.elements;
	let z = 0;
	while (unformattedElements.length > 0 && z < 10) {
		let t = timeline.endDisplay.getTime();
		while (t < timeline.startDisplay.getTime()) {
			let soonest = unformattedElements.sort((a, b) => a.start.getTime() - b.start.getTime())
			soonest = soonest.filter(e => e.start.getTime() > t);
			if (soonest.length == 0) break;
			soonest = soonest[0];
			soonest.z = z;
			t = soonest.end.getTime();
			const index = unformattedElements.indexOf(soonest);
			unformattedElements = unformattedElements.slice(0, index).concat(unformattedElements.slice(index + 1));
		}
		z++;
	}
}

function dateToX(date) {
	let datems = date.getTime();
	let startms = window.timeline.startDisplay.getTime();
	let endms = window.timeline.endDisplay.getTime();

	let t = (datems-endms)/(startms-endms);

	return canvas.width*t;
}

renderTimeline();
