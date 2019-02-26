class SpacebarTapper {
	constructor() {
        this.regions = [0]

        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            plugins: [
                WaveSurfer.regions.create({})
            ]
        });

        this.wavesurfer.load('english.mp3');

        this.wavesurfer.on('ready', function() {
            var st = new window.soundtouch.SoundTouch(
                this.wavesurfer.backend.ac.sampleRate
            );
            var buffer = this.wavesurfer.backend.buffer;
            var channels = buffer.numberOfChannels;
            var l = buffer.getChannelData(0);
            var r = channels > 1 ? buffer.getChannelData(1) : l;
            var length = buffer.length;
            var seekingPos = null;
            var seekingDiff = 0;

            var source = {
                extract: function(target, numFrames, position) {
                    if (seekingPos != null) {
                        seekingDiff = seekingPos - position;
                        seekingPos = null;
                    }

                    position += seekingDiff;

                    for (var i = 0; i < numFrames; i++) {
                        target[i * 2] = l[i + position];
                        target[i * 2 + 1] = r[i + position];
                    }

                    return Math.min(numFrames, length - position);
                }
            }

            var soundtouchNode;

            this.wavesurfer.on('play', function() {
                seekingPos = ~~(this.wavesurfer.backend.getPlayedPercents() * length);
                st.tempo = this.wavesurfer.getPlaybackRate();

                if (st.tempo === 1) {
                    this.wavesurfer.backend.disconnectFilters();
                } else {
                    if (!soundtouchNode) {
                        var filter = new window.soundtouch.SimpleFilter(source, st);
                        soundtouchNode = window.soundtouch.getWebAudioNode(
                            this.wavesurfer.backend.ac,
                            filter
                        );
                    }
                    this.wavesurfer.backend.setFilter(soundtouchNode);
                }
            }.bind(this));

            this.wavesurfer.on('pause', function() {
                soundtouchNode && soundtouchNode.disconnect();
            }.bind(this));

            this.wavesurfer.on('seek', function() {
                seekingPos = ~~(this.wavesurfer.backend.getPlayedPercents() * length);
            }.bind(this));
        }.bind(this));

    }

    playPause () {
        this.wavesurfer.playPause();
    }

    setPlaybackRate (x) {
        this.wavesurfer.setPlaybackRate(x);
    }

    makeARegion() {
        console.log("making a range");
        let s = this.regions[this.regions.length-1];
        let e = this.wavesurfer.getCurrentTime();
        this.regions.push(e);
        this.wavesurfer.addRegion({
            start: s,
            end: e,
            color: this.getRandomColor()
        });
    }

    getRandomColor() {
        /*var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;*/
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);

        return('rgba(' + r + ', ' + g + ', ' + b + ', 0.5)');
    }

}
