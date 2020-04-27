import GuitarString from './GuitarString.js';
import { parseTab, tabNumToHz, textarea } from './tab.js';
const AudioContext = window.AudioContext || window.webkitAudioContext;

const sampleRate = 44100;
const hz = 440;
const duration = 10;

const bufferSize = sampleRate * duration;

const audioCtx = new AudioContext({sampleRate});

// one dash or number on a tab is 0.1 sec
const sliceDuration = 0.1;
const bufferLength = sampleRate * sliceDuration;

/**
 * Produce sound for one vertical line of tab at noteNum index.
 * Also puts '*' char at the current index into tabCopy for each of 6 strings.
 * @return array of 6 sound buffers (one for each guitar string)
 */
let previousNotes = [];
let playedNotes = [[], [], [], [], [], []];
function produceSound({tab, noteNum, tabCopy}) {

  // for each guitar string
  // put the sound in sound buffer
  let stringSounds = [];
  for (let s=0; s<6; s++) {
    let previousNoteShouldRing = Boolean(playedNotes[s][noteNum - 1]);
    const tabEntry = tab[s][noteNum];
    const isTabNote = /[0-9]/.test(tabEntry);
    const stringSound = new Float32Array(bufferLength);
    const isPreviousTabEntryADigit = /[0-9]/.test(tab[s][noteNum-1]);
    const isNextTabEntryADigit = /[0-9]/.test(tab[s][noteNum + 1]);

    if (isTabNote && !isPreviousTabEntryADigit) {
      const tabNoteNum = isNextTabEntryADigit ? parseInt(tab[s][noteNum] + tab[s][noteNum+1]) : parseInt(tabEntry);
      previousNotes[s] = tabNoteNum;
      const hz = tabNumToHz(tabNoteNum, s);
      const string = new GuitarString(hz);

      string.pluck();
      let j = 0;
      while (j < bufferLength) {
        stringSound[j] = string.sample();
        string.tic();
        j++;
      }
      playedNotes[s][noteNum] = string;
    } else if (previousNoteShouldRing) {
      const string = playedNotes[s][noteNum - 1];
      let j = 0;
      while (j < bufferLength) {
        stringSound[j] = string.sample();
        string.tic();
        j++;
      }
      playedNotes[s][noteNum] = string;
    }

    stringSounds[s] = stringSound;

    tabCopy[s][noteNum] = `<span style="color:red; font-weight:bold;">*</span>`.split();
  }


  return stringSounds;
}


function playBuffer(buffer, callback) {
  const audioBuffer = audioCtx.createBuffer(1, buffer.length, sampleRate);
  audioBuffer.copyToChannel(buffer, 0);
  const source = audioCtx.createBufferSource();
  source.connect(audioCtx.destination);
  source.buffer = audioBuffer;
  source.onended = callback;
  source.start();
}

let blocks;
let tabTextOriginal;
function playTab2() {
  tabTextOriginal = textarea.innerHTML;
  blocks = parseTab(textarea.innerHTML);
  console.log('blocks: ', blocks);
  playBlock(blocks[0]);
}

let blockNum = 0;
function playBlock(tab) {
  console.log('playting tab piece: ');
  console.log(tab);
  playedNotes = [[], [], [], [], [], []];

  let noteNum = 0;
  nextNote();

  /**
   * play next vertical line on a tab
   */
  function nextNote() {
    // if finished playing the current tab,
    // play the next one
    if (noteNum > tab[0].length) {
      blockNum++;
      playBlock(blocks[blockNum]);
      return;
    }

    const tabCopy = copyTab(tab);
    const stringSounds = produceSound({tab, noteNum, tabCopy});
    const soundSum = mixGuitarStringsSound(stringSounds);

    playBuffer(soundSum, nextNote);
    replaceTabText({tab, tabCopy});
}

// create a copy of original tab[string] in format
// of 2 dimensional array [][]
function copyTab(tab) {
    let tabCopy = [];
    tab.forEach((s, i) => {
      tabCopy[i] = [];
      for (let j=0; j<s.length; j++) {
        tabCopy[i][j] = s[j];
      }
    });
  return tabCopy;
}


function mixGuitarStringsSound(stringSounds) {
  // sum all strings sound (average sounds)
  let soundSum = new Float32Array(bufferLength);
  for (let i=0; i<bufferLength; i++) {
    let sum = 0;
    stringSounds.forEach(s => {
      sum += s[i];
    });
    const avg = sum / 6;
    soundSum[i] = avg;
  }
  return soundSum;
}

function replaceTabText({tab, tabCopy}) {
  const textarea2 = document.querySelector('#parsed-tab');
  // find the played tab in original tab text
  // and replace it with highlightinig
  const tab2Array = tabCopy.map(s => s.join(''));
  let newTabText = '';
  for (let s=0; s<6; s++) {
    const str = newTabText ? newTabText : tabTextOriginal;
    const foundLine = str.match(tab[s]);
    newTabText = str.replace(tab[s], tab2Array[s]);
  }
  textarea.innerHTML = newTabText;

  noteNum++;
}
}

document.querySelector('[data-action="playTab2"]').addEventListener('click', playTab2);
