let sprites = [];

sprites[0] = "img/pineapple-character/svg/001-happy.svg";
sprites[1] = "img/pineapple-character/svg/030-reading.svg";
sprites[2] = "img/pineapple-character/svg/001-happy.svg";
sprites[3] = "img/pineapple-character/svg/034-listening.svg";
sprites[4] = "img/pineapple-character/svg/009-cool.svg";
sprites[5] = "img/pineapple-character/svg/009-cool.svg";
sprites[6] = "img/pineapple-character/svg/009-cool.svg";
sprites[7] = "img/pineapple-character/svg/009-cool.svg";
sprites[8] = "img/pineapple-character/svg/009-cool.svg";
sprites[9] = "img/pineapple-character/svg/009-cool.svg";

let SpriteManager = {
	getSpriteSrcByCellCode: function (cell_code) {
		return sprites[cell_code];
	}
}