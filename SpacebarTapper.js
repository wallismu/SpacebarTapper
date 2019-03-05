class SpacebarTapper {
	constructor(sentence, audio) {
		console.log("pls works");
		this.regions = [0];
		this.colors = ['rgba(250,162,27',
					   'rgba(4,184,237',
					   'rgba(0,165,116',
					   'rgba(243,231,55',
					   'rgba(0,120,184',
					   'rgba(242,101,34',
					   'rgba(229,128,174']
		
		// Really lazy way to expand colors
		// Enough for a 28 word sentence
		// If a sentence is 29 words?
		// ¯\_(ツ)_/¯
		// I could write something very nice and elegant to handle this but EH
		for (let i=0; i<3; i++) {
			for (let c=0; c<7; c++) {
				this.colors.push(this.colors[c]);
			}
		}

		this.sentenceChunks = sentence.split(" ");
		this.makeButtons();

		console.log(this.sentenceChunks);

		this.wavesurfer = WaveSurfer.create({
		    container: '#waveform',
	        plugins: [
	            WaveSurfer.regions.create({
	            	showTime: false,
	            	color: '#ff0c00'
	            })
	        ]
		});

		this.wavesurfer.load(audio);

		// Stuff to make audio not sound like butts when it's slowed down
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

	buttonPress(i) {
		/*console.log(this.sentenceChunks[i]);
		console.log(this.regions);
		let length = this.wavesurfer.getDuration();
		this.wavesurfer.seekTo(this.regions[i]/length);
		this.wavesurfer.playPause();*/
		console.log(this.wavesurfer.regions.list[i]);
		this.wavesurfer.regions.list[i].play();

	}

	makeButtons () {
		for (let i=0; i<this.sentenceChunks.length; i++) {
			var buttonToolbar = document.getElementById("tools-words");
			var btn = document.createElement('button');
			btn.setAttribute('class','word-button btn btn-primary');
			btn.setAttribute('id', 'word-' + i)
			btn.appendChild(document.createTextNode(this.sentenceChunks[i]));
			buttonToolbar.appendChild(btn);
			this.btns = $('.word-button');
		}
		
		for (let i=0; i<this.btns.length; i++) {
			$("#word-" + i).click(function () {
				this.buttonPress(i+1);
			}.bind(this));
		}
	}

	/*makeARegion() {
		console.log("making a range");
		let s = this.regions[this.regions.length-1];
		let e = this.wavesurfer.getCurrentTime();
		this.colors.push(this.getRandomColor());
		this.regions.push(e);
		this.wavesurfer.addRegion({
			id: this.regions.length - 2,
			start: s,
			end: e,
			color: this.colors[this.colors.length-1] + ', 0.5'
		});
		this.recolorButtons();
	}*/

	// When M key is pressed
	addMarker() {
		if (this.regions.length > this.sentenceChunks.length) {
			this.regions.pop();
		}
		this.regions.push(this.wavesurfer.getCurrentTime());
		this.makeRegions()
	}

	// Erase existing regions
	// Loop thru and recreate
	// Useful if a new division is made in the middle somewhere
	// Maintain correct order
	// Bloop
	makeRegions() {
		this.wavesurfer.clearRegions();
		this.regions.sort(this.compare);
		for (let i=1; i<this.regions.length; i++) {
			this.wavesurfer.addRegion({
				id: i,
				start: this.regions[i-1],
				end: this.regions[i],
				color: this.colors[i-1] + ', 0.5)'
			});
			this.recolorButtons();
		}
	}

	recolorButtons() {
		for (let r=0; r<this.regions.length-1; r++) {
			$('#word-' + r).css('background-color', this.colors[r]);
		}
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

	  return('rgba(' + r + ', ' + g + ', ' + b);
	}

	compare(a, b) {
		return a-b;
	}

	getRegions() {
		return this.regions;
	}

	writeRegionsToFile() {
		//console.log("Writing to a file :3c");
		const fs = require('fs');
		let data = "Test file contents";
		fs.writeFile('regions.txt', data, (err) => {
			if (err) throw err;
		})
	}
}