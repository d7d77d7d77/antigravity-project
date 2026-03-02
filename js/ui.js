document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('playBtn');
    const masterVolume = document.getElementById('masterVolume');
    const masterVolumeValue = document.getElementById('masterVolumeValue');

    // Generator controls
    const baseFreq = document.getElementById('baseFreq');
    const baseFreqValue = document.getElementById('baseFreqValue');
    const binauralBeat = document.getElementById('binauralBeat');
    const binauralBeatValue = document.getElementById('binauralBeatValue');
    const warmth = document.getElementById('warmth');
    const warmthValue = document.getElementById('warmthValue');
    const echoAmount = document.getElementById('echoAmount');
    const echoAmountValue = document.getElementById('echoAmountValue');
    const breathRate = document.getElementById('breathRate');
    const breathRateValue = document.getElementById('breathRateValue');
    const noiseType = document.getElementById('noiseType');

    // Preset controls
    const presetSelect = document.getElementById('presetSelect');
    const presetDescription = document.getElementById('presetDescription');

    // Populate Presets
    function initPresets() {
        if (!window.therapeuticPresets) return;

        // Group presets by category
        const categories = {};
        window.therapeuticPresets.forEach((preset, index) => {
            if (!categories[preset.category]) {
                categories[preset.category] = [];
            }
            categories[preset.category].push({ preset, index });
        });

        presetSelect.innerHTML = '';

        for (const [category, items] of Object.entries(categories)) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;

            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.index;
                option.textContent = item.preset.name;
                optgroup.appendChild(option);
            });

            presetSelect.appendChild(optgroup);
        }

        // Set initial color theme
        if (categories && Object.values(categories)[0] && Object.values(categories)[0][0]) {
            window.activeColorTheme = Object.values(categories)[0][0].preset.colorTheme;
        } else {
            window.activeColorTheme = [122, 109, 232];
        }
    }

    initPresets();

    // Apply Preset Function
    function applyPreset(index) {
        if (!window.therapeuticPresets || !window.therapeuticPresets[index]) return;

        const config = window.therapeuticPresets[index];

        // Update Description Text
        presetDescription.textContent = config.description;

        // Expose color theme for visualizer
        window.activeColorTheme = config.colorTheme || [122, 109, 232];

        // Update UI Sliders
        baseFreq.value = config.baseFrequency;
        baseFreqValue.textContent = `${config.baseFrequency} Hz`;

        binauralBeat.value = config.binauralBeatHz;
        binauralBeatValue.textContent = `${config.binauralBeatHz.toFixed(1)} Hz`;

        warmth.value = config.warmth;
        warmthValue.textContent = `${config.warmth} Hz`;

        breathRate.value = config.breathRateHz;
        breathRateValue.textContent = `${config.breathRateHz.toFixed(2)} Hz`;

        echoAmount.value = config.echoAmount * 100;
        echoAmountValue.textContent = `${config.echoAmount * 100}%`;

        noiseType.value = config.noiseType;

        // Apply to Engine (if running, changes are smoothed)
        window.audioEngine.setBaseFrequency(config.baseFrequency);
        window.audioEngine.setBinauralBeat(config.binauralBeatHz);
        window.audioEngine.setWarmth(config.warmth);
        window.audioEngine.setBreathRate(config.breathRateHz);
        window.audioEngine.setEchoAmount(config.echoAmount);
        window.audioEngine.setNoiseType(config.noiseType);
    }

    // Preset Change Event
    presetSelect.addEventListener('change', (e) => {
        applyPreset(parseInt(e.target.value, 10));
    });

    // Play / Stop
    playBtn.addEventListener('click', async () => {
        if (!window.audioEngine.ctx) {
            await window.audioEngine.init();
        }

        if (window.audioEngine.isPlaying) {
            window.audioEngine.stop();
            playBtn.textContent = 'Start Generator';
            playBtn.classList.remove('playing');
        } else {
            // Apply current UI values before starting
            window.audioEngine.setBaseFrequency(parseFloat(baseFreq.value));
            window.audioEngine.setBinauralBeat(parseFloat(binauralBeat.value));
            window.audioEngine.setWarmth(parseFloat(warmth.value));
            window.audioEngine.setEchoAmount(parseFloat(echoAmount.value) / 100);
            window.audioEngine.setBreathRate(parseFloat(breathRate.value));
            window.audioEngine.setNoiseType(noiseType.value);

            window.audioEngine.start();
            playBtn.textContent = 'Stop Generator';
            playBtn.classList.add('playing');
        }
    });

    // Master Volume control
    masterVolume.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        masterVolumeValue.textContent = `${val}%`;
        window.audioEngine.setMasterVolume(val / 100);
    });

    // Audio engine parameter bindings
    baseFreq.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        baseFreqValue.textContent = `${val} Hz`;
        window.audioEngine.setBaseFrequency(val);
    });

    binauralBeat.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        binauralBeatValue.textContent = `${val.toFixed(1)} Hz`;
        window.audioEngine.setBinauralBeat(val);
    });

    warmth.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        warmthValue.textContent = `${val} Hz`;
        window.audioEngine.setWarmth(val);
    });

    echoAmount.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        echoAmountValue.textContent = `${val}%`;
        window.audioEngine.setEchoAmount(val / 100);
    });

    breathRate.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        breathRateValue.textContent = `${val.toFixed(2)} Hz`;
        window.audioEngine.setBreathRate(val);
    });

    noiseType.addEventListener('change', (e) => {
        window.audioEngine.setNoiseType(e.target.value);
    });
});
