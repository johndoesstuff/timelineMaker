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
}

function addDates() {
	const date1 = new Date(document.getElementById('date1').value);
	const date2 = new Date(document.getElementById('date2').value);

	if (isNaN(date1) || isNaN(date2)) {
		alert("Please enter valid dates.");
		return;
	}

	window.timeline.elements.push(new Timeframe(date1, date2));
}

function renderTimeline() {
	const days = Math.ceil((timeline.startDisplay.getTime() - timeline.endDisplay.getTime()) / dayms);
	let c = 0;
	for (let i = timeline.endDisplay.getTime(); i < timeline.startDisplay.getTime(); i += dayms) {
		let day = new Date(i);
		let dayEnd = new Date(i + dayms);
		ctx.fillRect(dateToX(day), 0, dateToX(dayEnd), 100);
		c++;
		c %= 2;
		ctx.fillStyle = (["#ddd", "#eee"])[c];
	}
}

function dateToX(date) {
	let datems = date.getTime();
	let startms = window.timeline.startDisplay.getTime();
	let endms = window.timeline.endDisplay.getTime();

	let t = (datems-startms)/(endms-startms);

	return canvas.width*t;
}

renderTimeline();
