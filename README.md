## SpacebarTapper
For the tapping of spacebars (manually separating words in an audio file)

#### About
At Pubbly, a lot of our clients requested the ability for "highlighting" in our books. As the narrator reads each word, it lights up to indicate the reader's place in the text. This can be difficult to time correctly, as words in the English language all take a different amount of time to say. 

My supervisor created a [number of algorithms](https://github.com/PubblyDevelopment/pubbly_engine_feature-SpokenFields/) to "guess" when to highlight the next word, using tactics like average word length. While it works overall, there are always going to be small hiccups due to the nature of language. Different narrators can say the same words with wildy different timing and inflections. The most accurate way to implement "highlighting" is the cumbersome activity of manually piecing out the timing of each individual word. 
Knowing that, I wanted to tackle a system that might speed this up. **SpacebarTapper** (named so because I initially used the spacebar) was my solution. The idea is that as the person building out the interactive content (such as one of our designers) can hit a key at the end of each word, and then fine-tune the breakpoints in the audio. 

To accomplish this, I created a UI using Javascript, [Wavesurfer.js](https://wavesurfer-js.org/), and [Soundtouch-JS](https://libraries.io/github/jakubfiala/soundtouch-js). I used Wavesurfer to draw out the waveform of the audio, and Soundtouch to slow it down. Slowing down the audio makes it easier to piece out, and the built-in JS function for slowing down audio made it sound horribly pitched-down (and a little horror movie).

As the user taps the **M key** (no longer the spacebar!), I add that point in the audio to the array. As they continue, each new time is used to render a Wavesurfer _region_, the colored section on the waveform. The array of timepoints is maxed out as the number of words + 1. I then match up the WS region to a word, and color code appropriately. Clicking a word jumps to that point in the audio file, and plays only _that_ region. This makes it very easy to visually link up the sound with the word and confirm that it is the right length. 

#### Appendix
A note on the colors: My original implementation generated a random color for each region. Sometimes two colors next to each other would be very similar, and certain colors were indistinguishable for people with colorblindedness. We did some research, and with some help from a colorblind co-worker, chose a group of colors that were far easier to tell apart. A fully-colorblind system could use different symbols to diffrentiate region to region, but since this is just experimental, we figured this is "good for now." 

#### Demo
Click [here](https://wallispubbly.github.io/SpacebarTapper/) to take a look.
