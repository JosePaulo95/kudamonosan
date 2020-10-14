let means_the_first = true;
let swit = function (a, b) {
	means_the_first = !means_the_first;
	return means_the_first?b:a;
}
swit.invert = function () {
	means_the_first = false;
}
swit.default = function () {
	means_the_first = true;
}