var playing = false;
var freq;
var gain;
var oscillator;
var envelopeOn = false;
var WIDTH = 800;
var HEIGHT = 600;
var loaded = false;

// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var canvasCtx;

window.onload = function () {
    canvasCtx = document.getElementById("demoCanvas");
    document.getElementById("freqLabel").innerHTML = "Frequency: " + 30 + "hz";
    document.getElementById("gainLabel").innerHTML = "Gain: " + 0;
    loaded = true;
};


// create Oscillator node and gain node
//var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();

// connect oscillator to gain node to speakers

//oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

//visualizer
var analyser = audioCtx.createAnalyser();

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

//update();

// draw an oscilloscope of the current audio source



function draw() 
{

	if(loaded)
	{
	  drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      //canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.lineTo(WIDTH, HEIGHT/2);
      canvasCtx.stroke();
    };

    draw();
}

      
//visualizer

function playWave(pType) 
{
	playing = !playing;
	if(playing)
	{
		oscillator = audioCtx.createOscillator();
		oscillator.connect(gainNode);
		//oscillator.type = 'sawtooth';
		oscillator.type = pType;
		oscillator.frequency.value = 30;
		oscillator.start();
	}
	else
		oscillator.stop();
    //document.getElementById("demo").style.color = "red";
}

//http://stackoverflow.com/questions/13896685/html5-slider-with-onchange-function
function updateFreqSlider(slideAmount) {
    //sliderDiv.innerHTML = slideAmount;
    freq = slideAmount * 30;
    if(oscillator)
		oscillator.frequency.value = freq;
    document.getElementById("freqLabel").innerHTML = "Frequency: " + freq + "hz";
}

//http://www.softsynth.com/webaudio/gainramp.php
function updateGainSlider(slideAmount) {
    //sliderDiv.innerHTML = slideAmount;
    gain = slideAmount;
    if(oscillator)
    	gainNode.gain.value = gain;
    document.getElementById("gainLabel").innerHTML = "Gain: " + gain;
}


function startTone( mode )
{
    var now = audioCtx.currentTime;
    envelopeOn = !envelopeOn;
    //gainNode.gain.cancelScheduledValues( now );
    
    // Anchor beginning of ramp at current value.
    //gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    if( mode == 1 )
    {
        // Ramp slowly up with a 1 second duration.
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        gainNode.gain.linearRampToValueAtTime(gain, now + 3.0);
    }
    else if( mode == 2 )
    {
        now = audioCtx.currentTime;
	// Ramp up and down.
    gainNode.gain.linearRampToValueAtTime(gain, now + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, now + 1.0);
    gainNode.gain.linearRampToValueAtTime(gain, now + 1.5);
    gainNode.gain.linearRampToValueAtTime(0.0, now + 2.0);
    gainNode.gain.linearRampToValueAtTime(gain, now + 2.5);
    }
    else if( mode == 3 )
    {
        // Ramp quickly up.
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        gainNode.gain.linearRampToValueAtTime(gain, now + 1.0);
    }
}



