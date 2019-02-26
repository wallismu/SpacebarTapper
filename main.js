times = []
$(document).ready(function(){
    console.log("Page loaded");

    st = new SpacebarTapper();
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

    document.body.onkeyup = function(e){
        if(e.keyCode == 77){
            console.log("M pressed");
            //makeARegion(wavesurfer, wavesurfer.getCurrentTime());
            st.makeARegion();
        }
    }
})

makeARegion = function(ws, time) {
    console.log(time);
    console.log("MAKING A REGION!!");
    if (times.length == 0) {
        ws.addRegion("poop", 0, time, false, true, true, "#ffffff");
    }
    else {
        times.push(time);
        ws.addRegion("poop", times[times.length-2], times[times.length-1], false, true, true, "#ffffff");
    }
    console.log(ws.regions.list.length);
}
