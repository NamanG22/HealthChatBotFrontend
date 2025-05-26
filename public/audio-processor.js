// Audio Worklet Processor for handling real-time audio processing
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
    this.lastSendTime = 0;
    this.silenceThreshold = 0.01;
    this.silenceDuration = 0;
    this.isInSilence = false;
    
    // Log initialization
    console.log('AudioProcessor initialized with buffer size:', this.bufferSize);
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const channel = input[0];

    if (!channel) {
      console.warn('No input channel available');
      return true;
    }

    try {
      // Process incoming audio data
      for (let i = 0; i < channel.length; i++) {
        this.buffer[this.bufferIndex++] = channel[i];

        // Check if buffer is full
        if (this.bufferIndex >= this.bufferSize) {
          this.sendBufferToMain();
        }
      }

      // Check for silence
      const rms = Math.sqrt(channel.reduce((acc, val) => acc + val * val, 0) / channel.length);
      if (rms < this.silenceThreshold) {
        this.silenceDuration += channel.length / sampleRate;
        if (!this.isInSilence && this.silenceDuration > 1.0) { // 1 second of silence
          this.isInSilence = true;
          this.port.postMessage({
            type: 'audio',
            bufferInfo: {
              isEndOfSpeech: true,
              silenceDuration: this.silenceDuration
            }
          });
        }
      } else {
        this.silenceDuration = 0;
        this.isInSilence = false;
      }
    } catch (err) {
      console.error('Error in audio processing:', err);
    }

    return true;
  }

  sendBufferToMain() {
    try {
      // Convert float32 to int16
      const int16Buffer = new Int16Array(this.bufferSize);
      for (let i = 0; i < this.bufferSize; i++) {
        const s = Math.max(-1, Math.min(1, this.buffer[i]));
        int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      this.port.postMessage({
        type: 'audio',
        data: int16Buffer,
        bufferInfo: {
          isEndOfSpeech: false,
          silenceDuration: this.silenceDuration
        }
      }, [int16Buffer.buffer]);

      // Reset buffer
      this.buffer = new Float32Array(this.bufferSize);
      this.bufferIndex = 0;
      this.lastSendTime = currentTime;
    } catch (err) {
      console.error('Error sending buffer to main thread:', err);
    }
  }
}

try {
  // Register the processor
  registerProcessor('audio-processor', AudioProcessor);
  console.log('Audio processor registered successfully');
} catch (err) {
  console.error('Failed to register audio processor:', err);
} 