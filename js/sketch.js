/* CREDITS */
/* Base calculation code : https://thecodingtrain.com/CodingChallenges/125-fourier-series.html */

/* Global variables */
const maxTerms = 50;
const maxSpeed = 10;

let time = 0;
let path = [];
let targetWave = [];
let shouldDisplay = new Map();
let displayColor = new Map();
let defaultColor;

/* Number of terms */
let termsNumInfo;
let termsNum;
let termsNumValue;

/* Speed */
let speedInfo;
let speed;
let speedValue;

/* Targeted term */
let targetInputInfo;
let targetInput;
let targetColorInfo;
let targetColor;

/* Pre-calculation slider */
let precalcInfo;
let precalc;
let precalcValue;

/* Pre-calculation checkbox */
let precalcCheckbox

/* Buttons */
let submitButton;
let deleteButton;

let displayedList;

function setup() {
	createCanvas(windowWidth, windowHeight);
	/* Number of terms */
	termsNumInfo = createElement('h2', 'Number of terms')
	termsNumInfo.class('color-white');
	termsNumInfo.position(100, 40);
	termsNumValue = createElement('h2');
	termsNumValue.class('color-white');
	termsNumValue.position(250, 80);
	termsNum = createSlider(1, maxTerms, 5);
	termsNum.position(100, 100);

	/* Speed */
	speedInfo = createElement('h2', 'Speed')
	speedInfo.class('color-white');
	speedInfo.position(100, 110);
	speedValue = createElement('h2');
	speedValue.class('color-white');
	speedValue.position(250, 140);
	speed = createSlider(1, maxSpeed, 1);
	speed.position(100, 160);

	defaultColor = color(255, 255, 255);
	for(let i=0; i<maxTerms; i++) {
		targetWave.push([]);
		shouldDisplay.set(i, false);
		displayColor.set(i, defaultColor);
	}

	/* Targeted term */
	targetInputInfo = createElement('h2', 'Targeted term<br>(0 to delete all)');
	targetInputInfo.class('color-white');
	targetInputInfo.position(300, 20);
	targetInput = createInput('', 'number');
	targetInput.position(300, 100);

	targetColorInfo = createElement('h2', 'Targeted term color<br>(HEX color code)');
	targetColorInfo.class('color-white');
	targetColorInfo.position(530, 40);
	targetColor = createColorPicker('#FF0000');
	targetColor.position(530, 127);

	/* Pre-calculation */
	precalcInfo = createElement('h2', 'How many terms to precalculate')
	precalcInfo.class('color-white');
	precalcInfo.position(800, 40);
	precalcValue = createElement('h2');
	precalcValue.class('color-white');
	precalcValue.position(950, 80);
	precalc = createSlider(0, maxTerms, 0);
	precalc.position(800, 100);

	precalcCheckbox = createCheckbox('Exact amount', false);
	precalcCheckbox.class('color-white');
	precalcCheckbox.changed(precalcCheckboxEvent);
	precalcCheckbox.position(800, 130);

	/* Buttons */
	submitButton = createButton('Submit');
	submitButton.position(300, 130);
	submitButton.mousePressed(addColoredTerm);

	deleteButton = createButton('Delete');
	deleteButton.position(418, 130);
	deleteButton.mousePressed(deleteColoredTerm);

	displayedList = createElement('ul');
	displayedList.class('color-white');
	displayedList.position(0, 200);
}

function precalcCheckboxEvent() {
	if(this.checked() == false) {
		precalc.value(0);
	}
	else {
		precalc.value(termsNum.value());
	}
}

function addColoredTerm() {
	const targetTerm = parseInt(targetInput.value())-1;
	targetInput.value('');
	if(targetTerm > maxTerms || targetTerm < 0) alert('The number needs to be between 0 and ' + maxTerms + ' (Max possible terms shown)');
	shouldDisplay.set(targetTerm, true);
	displayColor.set(targetTerm, targetColor.color());
}

function deleteColoredTerm() {
	const targetTerm = parseInt(targetInput.value())-1;
	targetInput.value('');
	if(targetTerm == -1) { 
		for(let i=0; i<maxTerms; i++) shouldDisplay.set(i, false);
		return;
	}
	if(targetTerm > maxTerms || targetTerm < 0) {
		alert('The number needs to be between 0 and ' + maxTerms + ' (Max possible terms shown)');
		return;
	}
	shouldDisplay.set(targetTerm, false);
}

function draw() {
	background(0);
	translate(windowWidth*0.2, 400);

	let x = 0;
	let y = 0;
	termsNumValue.html(termsNum.value());
	speedValue.html(speed.value());
	precalcValue.html(precalc.value());
	displayedList.html('');

	let amountToCalculate;
	if(precalcCheckbox == true) amountToCalculate = precalc.value();
	else if(precalc.value() == 0) amountToCalculate = termsNum.value();
	else amountToCalculate = termsNum.value()+precalc.value();
	if(amountToCalculate > maxTerms) amountToCalculate = maxTerms;

	for (let i = 0; i < amountToCalculate; i++) {
		if(i != termsNum.value()-1 && displayColor.get(i) == defaultColor) shouldDisplay.set(i, false);
		if(shouldDisplay.get(i) && (i == termsNum.value()-1 || displayColor.get(i) != defaultColor)) displayedList.html('<li>'+(i+1)+' - <svg width="10" height="10"><rect width="10" height="10" style="fill:'+displayColor.get(i)+';" /></svg></li>', true);
		let prevx = x;
		let prevy = y;

		let n = i * 2 + 1;
		let radius = 75 * (4 / (n * PI))*windowWidth/900;
		x += radius * cos(n * time);
		y += radius * sin(n * time);

		let tempColor;
		if(shouldDisplay.get(i)) {
			tempColor = displayColor.get(i);
		}
		else {
			tempColor = defaultColor;
		}
		tempColor.setAlpha(200);
		stroke(tempColor);
		noFill();
		ellipse(prevx, prevy, radius * 2);

		//fill(255);
		stroke(255);
		line(prevx, prevy, x, y);
		//ellipse(x, y, 8);
		targetWave[i].unshift(y);
	}
	shouldDisplay.set(termsNum.value()-1, true);
	
	translate(350, 0);
	line(x - 350, y, 0, targetWave[termsNum.value()-1][0]);

	for(let t=0; t<termsNum.value(); t++) {
		if(targetWave[t].length > windowWidth) {
			targetWave[t].pop();
		}
		if(!shouldDisplay.get(t) || (t != termsNum.value()-1 && displayColor.get(t) == defaultColor)) continue;
		beginShape();
		noFill();
		stroke(displayColor.get(t));
		for(let i=0; i<targetWave[t].length; i++) {
			vertex(i, targetWave[t][i]);
		}
		endShape();
	}

	time += speed.value()/100;

	/* console.log(targetWave); */
	
}
