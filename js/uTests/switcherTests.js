function runSwitcherTests() {
  	console.assert(basicInstanceWorks(), "basicInstanceWorks");
  	console.assert(invertWorks(), "invertWorks");
  	console.assert(worksFineWithStrings(), "worksFineWithStrings");
  	console.assert(canBeReutilised(), "canBeReutilised");
}

function basicInstanceWorks() {
	let a = 1;
	let b = 2;

	swit.default();

	if(swit(a, b) != a){
		return false;
	}
	if(swit(a, b) != b){
		return false;
	}
	if(swit(a, b) != a){
		return false;
	}
	if(swit(a, b) != b){
		return false;
	}

  	return true;
}
function invertWorks() {
	let a = 1;
	let b = 2;

	swit.invert();

	if(swit(a, b) != b){
		return false;
	}
	if(swit(a, b) != a){
		return false;
	}
	if(swit(a, b) != b){
		return false;
	}

  	return true;
}
function worksFineWithStrings() {
	let a = "cell";
	let b = "612";

	if(swit(a, b) != a){
		return false;
	}
	if(swit(a, b) != b){
		return false;
	}
	if(swit(a, b) != a){
		return false;
	}
	if(swit(a, b) != b){
		return false;
	}

  	return true;
}
function canBeReutilised() {
	let a = 1;
	let b = 2;

	if(swit(a, b) != a){
		return false;
	}
	if(swit(a, b) != b){
		return false;
	}

	a = "cell";
	b = "kudamono";

	if(swit(a, b) != a){
		return false;
	}
	if(swit(a, b) != b){
		return false;
	}

  	return true;		
}