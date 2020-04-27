class RingBuffer {
  constructor(capacity) {
    this.capacity = capacity; 
    this.array = new Float32Array(capacity);
    this.size = 0;
    this.first = 0;
    this.last = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  isFull() {
    return this.size === this.capacity;
  }

  enqueue(item) {
    if (this.size > 0) {
      this.last++;
    }
    if (this.last > this.capacity - 1) {
      this.last = 0;
    }
    this.array[this.last] = item;
    this.size++;
  }

  dequeue() {
    if (this.size === 0) {
      throw new Error('Trying to dequeue an empty RingBuffer');
    }
    const item = this.array[this.first];
    this.first++;
    if (this.first > this.capacity - 1) {
      this.first = 0;
    }
    this.size--;
    if (this.size === 0) {
      this.first = 0;
      this.last = 0;
    }
    return item;
  }

  peek() {
    return this.array[this.first];
  }
}

//module.exports = RingBuffer;
export default RingBuffer;
