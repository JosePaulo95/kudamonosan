let audios = [];

audios["bg"] = new Audio('audio/music/bensound-jazzyfrenchy.mp3');
audios["grab"] = new Audio('audio/kenney_interfacesounds/Audio/select_002.ogg');
audios["grab_nothing"] = new Audio('audio/kenney_interfacesounds/Audio/click_001.ogg');
audios["release"] = new Audio('audio/kenney_interfacesounds/Audio/maximize_006.ogg');
audios["error"] = new Audio('audio/kenney_interfacesounds/Audio/error_005.ogg');

let bg_is_playing = true;

let AudioController = {
	playSound: function (name, is_muted) {
		if(!is_muted){
			audios[name].play();

			if(!bg_is_playing){
				audios["bg"].play();
				bg_is_playing = true;
			}
		}
	}
}