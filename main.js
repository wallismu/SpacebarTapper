times = []
$(document).ready(function(){
	console.log("Page loaded");
	
	// Don't mangle audio when changing playback speed
	// Sounds choppy but mostly works


	$("#playpause").click(function () {
		console.log("pause/play");
		st.playPause();
	});

	$("#full").click(function () {
		console.log("full");
		st.setPlaybackRate(1);
	});

	$("#half").click(function () {
		console.log("half");
		st.setPlaybackRate(.5);
	});

	$("#quarter").click(function () {
		console.log("half");
		st.setPlaybackRate(.25);
	});

    $("#write").click(function () {
        console.log("writetofile");
        st.writeRegionsToFile();
    })

	document.body.onkeyup = function(e){
	    if(e.keyCode == 77){
	        console.log("M pressed");
	        //makeARegion(wavesurfer, wavesurfer.getCurrentTime());
	        st.addMarker();
	    }
		if(e.keyCode == 32){
	        console.log("Spcebar pressed");
	        //makeARegion(wavesurfer, wavesurfer.getCurrentTime());
	        st.playPause();
	    }
	}
})