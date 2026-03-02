class DeepSleepAudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;

        // Audio Nodes
        this.masterGain = null;
        this.analyser = null;

        // Generators & Effects
        this.baseOscL = null; // Left Channel (Base Freq)
        this.baseOscR = null; // Right Channel (Base Freq + Binaural Offset)
        this.merger = null;   // Merge L/R for Binaural Effect
        this.warmthFilter = null; // Lowpass filter
        this.echoDelay = null;    // Delay node
        this.echoFeedback = null; // Gain node for feedback

        // Default parameters
        this.params = {
            masterVolume: 0.5,
            baseFrequency: 174, // Solfeggio frequency
            binauralBeatHz: 2,  // Delta wave
            warmth: 800,        // Lowpass cutoff frequency
            echoAmount: 0.3,    // Reverb wet mix
            noiseType: 'brown', // 'none', 'pink', 'brown'
            breathRateHz: 0.1   // ~6 breaths per minute for LFO
        };
    }

    async init() {
        if (this.ctx) return;

        // Initialize Web Audio Context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Create Master Chain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.params.masterVolume;

        // Warmth Filter (Lowpass)
        this.warmthFilter = this.ctx.createBiquadFilter();
        this.warmthFilter.type = 'lowpass';
        this.warmthFilter.frequency.value = this.params.warmth;
        this.warmthFilter.Q.value = 0.5; // Slight resonance for "analog" feel

        // Background Noise generators
        this.noiseSource = null;
        this.noiseGain = this.ctx.createGain();
        this.noiseGain.gain.value = 0; // Starts muted
        this._initNoiseBuffers();

        // Echo (Delay + Feedback)
        this.echoDelay = this.ctx.createDelay(5.0); // Max delay 5s
        this.echoDelay.delayTime.value = 1.2; // 1.2s delay time

        this.echoFeedback = this.ctx.createGain();
        this.echoFeedback.gain.value = 0.4; // 40% feedback

        this.echoGain = this.ctx.createGain(); // Dry/Wet mix for echo
        this.echoGain.gain.value = this.params.echoAmount;

        // Routing: 
        // Noise -> Master Gain (bypasses warmth filter to stay broad)
        this.noiseGain.connect(this.masterGain);

        // Generators -> Warmth Filter -> (Dry + Delay) -> Master Gain
        this.warmthFilter.connect(this.masterGain); // Dry signal path

        // Delay loop path
        this.warmthFilter.connect(this.echoDelay);
        this.echoDelay.connect(this.echoFeedback);
        this.echoFeedback.connect(this.echoDelay);
        this.echoDelay.connect(this.echoGain);
        this.masterGain.connect(this.ctx.destination);

        // Analyser for visualizer
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 512;
        this.analyser.smoothingTimeConstant = 0.8;
        this.masterGain.connect(this.analyser);
    }

    _initNoiseBuffers() {
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise buffer
        this.pinkNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        this.brownNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);

        const pinkOutput = this.pinkNoiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        const brownOutput = this.brownNoiseBuffer.getChannelData(0);
        let lastOut = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;

            // Pink noise filtering
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            pinkOutput[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            pinkOutput[i] *= 0.11; // compensate gain
            b6 = white * 0.115926;

            // Brown noise filtering (integration)
            brownOutput[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = brownOutput[i];
            brownOutput[i] *= 3.5; // compensate gain
        }
    }

    _startOscillators() {
        // Binaural setup requires stereo panning
        this.merger = this.ctx.createChannelMerger(2);

        // Left Ear Oscillator (Base Freq)
        this.baseOscL = this.ctx.createOscillator();
        this.baseOscL.type = 'sine';
        this.baseOscL.frequency.value = this.params.baseFrequency;

        // Right Ear Oscillator (Base Freq + Binaural Beat)
        this.baseOscR = this.ctx.createOscillator();
        this.baseOscR.type = 'sine';
        this.baseOscR.frequency.value = this.params.baseFrequency + this.params.binauralBeatHz;

        // Connect to merger (0=Left, 1=Right)
        this.baseOscL.connect(this.merger, 0, 0);
        this.baseOscR.connect(this.merger, 0, 1);

        // Connect merger to first effect (Warmth)
        this.merger.connect(this.warmthFilter);

        this.baseOscL.start();
        this.baseOscR.start();

        this._startNoise();
    }

    _startNoise() {
        if (this.noiseSource) {
            this.noiseSource.stop();
            this.noiseSource.disconnect();
        }

        if (this.params.noiseType === 'none') return;

        this.noiseSource = this.ctx.createBufferSource();
        this.noiseSource.buffer = this.params.noiseType === 'pink' ? this.pinkNoiseBuffer : this.brownNoiseBuffer;
        this.noiseSource.loop = true;
        this.noiseSource.connect(this.noiseGain);

        // Gentle fade in for noise
        this.noiseGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.noiseGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 3); // Kept quiet specifically for sleep

        this.noiseSource.start();
    }

    _stopOscillators() {
        if (this.baseOscL) {
            this.baseOscL.stop(this.ctx.currentTime + 2.1);
        }
        if (this.baseOscR) {
            this.baseOscR.stop(this.ctx.currentTime + 2.1);
        }

        if (this.noiseSource) {
            this.noiseGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.noiseGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
            this.noiseSource.stop(this.ctx.currentTime + 2.1);
        }
    }

    start() {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        this._startOscillators();

        // Smooth fade in
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.params.masterVolume, this.ctx.currentTime + 3); // 3 second gentle fade in

        this.isPlaying = true;
    }

    stop() {
        if (!this.ctx || !this.isPlaying) return;

        // Smooth fade out
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2); // 2 second fade out

        this._stopOscillators();

        setTimeout(() => {
            if (this.ctx && this.ctx.state === 'running') {
                // Disconnect to clean up
                if (this.baseOscL) this.baseOscL.disconnect();
                if (this.baseOscR) this.baseOscR.disconnect();
                if (this.merger) this.merger.disconnect();

                this.ctx.suspend();
            }
        }, 2200);

        this.isPlaying = false;
    }

    setMasterVolume(value) {
        this.params.masterVolume = Math.max(0, Math.min(1, value));
        if (this.ctx && this.masterGain && this.isPlaying) {
            this.masterGain.gain.setTargetAtTime(this.params.masterVolume, this.ctx.currentTime, 0.1);
        }
    }

    setBaseFrequency(freq) {
        this.params.baseFrequency = freq;
        if (this.baseOscL && this.isPlaying) {
            this.baseOscL.frequency.setTargetAtTime(this.params.baseFrequency, this.ctx.currentTime, 0.1);
        }
        if (this.baseOscR && this.isPlaying) {
            this.baseOscR.frequency.setTargetAtTime(this.params.baseFrequency + this.params.binauralBeatHz, this.ctx.currentTime, 0.1);
        }
    }

    setBinauralBeat(hz) {
        this.params.binauralBeatHz = hz;
        if (this.baseOscR && this.isPlaying) {
            this.baseOscR.frequency.setTargetAtTime(this.params.baseFrequency + this.params.binauralBeatHz, this.ctx.currentTime, 0.1);
        }
    }

    setWarmth(cutoff) {
        this.params.warmth = cutoff;
        if (this.warmthFilter && this.isPlaying) {
            this.warmthFilter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.1);
        }
    }

    setEchoAmount(amount) {
        this.params.echoAmount = amount;
        if (this.echoGain && this.isPlaying) {
            this.echoGain.gain.setTargetAtTime(amount, this.ctx.currentTime, 0.1);
        }
    }

    setBreathRate(hz) {
        this.params.breathRateHz = hz;
        if (this.lfoOsc && this.isPlaying) {
            this.lfoOsc.frequency.setTargetAtTime(hz, this.ctx.currentTime, 0.1);
        }
    }

    setNoiseType(type) {
        this.params.noiseType = type;
        if (this.isPlaying) {
            // Fade out current noise
            this.noiseGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.noiseGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);

            setTimeout(() => {
                this._startNoise();
            }, 600);
        }
    }

    getAnalyserData() {
        if (!this.analyser) return null;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        return { data: dataArray, bufferLength: bufferLength };
    }
}

// Instantiate globally for UI to access
window.audioEngine = new DeepSleepAudioEngine();
