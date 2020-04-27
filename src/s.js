import GuitarString from './GuitarString.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const sampleRate = 44100;
const audioCtx = new AudioContext({sampleRate});

function playGuitarString() {
  const string = new GuitarString(440);
  string.pluck();


  //let data = buffer.getChannelData(0);

  //for (let i=0; i<string.sample.length; i++) {
  //  data[i] = string.sample[i];
  //}

  const duration = 5;
  const bufferLength = sampleRate * duration

  const source = audioCtx.createBufferSource();
  const buffer = audioCtx.createBuffer(1, bufferLength, sampleRate);
  const bufferData = buffer.getChannelData(0);

  let i = 0;
  while (i < bufferLength) {
    bufferData[i] = string.sample();
    string.tic();
    i++;
  }

  source.buffer = buffer;
  source.connect(audioCtx.destination);

  source.start();
}

document.querySelector('[data-action="playGuitarString"]').addEventListener('click', playGuitarString);
