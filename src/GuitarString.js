import RingBuffer from './RingBuffer.js';

const samplingRate = 44100;

class GuitarString {
  constructor(frequency, ringBuffer) {
    this.ringBuffer = ringBuffer || new RingBuffer(Math.floor(samplingRate / frequency));
    let i = 0;
    while(!this.ringBuffer.isFull()) {
      this.ringBuffer.enqueue(0);
      i++
    }
  }

  length() {
    return this.ringBuffer.size;  
  }

  pluck() {
    for (let i = 0; i < this.ringBuffer.capacity; i++) {
      this.ringBuffer.enqueue(Math.random() * 2 - 1);
    }
  }

  tic() {
    const avg = (this.ringBuffer.dequeue() + this.ringBuffer.peek()) / 2 * .996;
    this.ringBuffer.enqueue(avg);
  }

  sample() {
    return this.ringBuffer.peek();
  }
}

export default GuitarString;
