// presets.js

const therapeuticPresets = [
    {
        name: "Custom (Manual)",
        category: "Manual",
        baseFrequency: 174,
        binauralBeatHz: 2.0,
        warmth: 800,
        breathRateHz: 0.1,
        echoAmount: 0.3,
        noiseType: "brown",
        colorTheme: [122, 109, 232], // Default Purple
        description: "Manually control all parameters using the sliders below."
    },
    // Solfeggio Frequencies
    {
        name: "174 Hz - Pain Relief & Foundation",
        category: "Solfeggio",
        baseFrequency: 174,
        binauralBeatHz: 2.0, // Delta for deep relaxation
        warmth: 600,
        breathRateHz: 0.08, // Very slow breath
        echoAmount: 0.4,
        noiseType: "brown",
        colorTheme: [224, 159, 62], // Warm Gold/Orange
        description: "The lowest of the tones appears to be a natural anaesthetic. It tends to reduce pain physically and energetically, giving your organs a sense of security, safety and love."
    },
    {
        name: "285 Hz - Tissue Repair",
        category: "Solfeggio",
        baseFrequency: 285,
        binauralBeatHz: 3.0,
        warmth: 800,
        breathRateHz: 0.1,
        echoAmount: 0.35,
        noiseType: "pink",
        colorTheme: [232, 172, 109], // Soft Orange
        description: "Helps returning tissue into its original form. It influences energy fields, sending them a message to restructure damaged organs."
    },
    {
        name: "396 Hz - Liberating Guilt & Fear",
        category: "Solfeggio",
        baseFrequency: 396,
        binauralBeatHz: 4.0, // Theta border
        warmth: 1000,
        breathRateHz: 0.12,
        echoAmount: 0.3,
        noiseType: "none",
        colorTheme: [217, 83, 79], // Deep Red/Clay
        description: "Turns grief into joy, liberating hidden blockages and subconscious negative beliefs. Excellent for grounding."
    },
    {
        name: "417 Hz - Undoing Situations",
        category: "Solfeggio",
        baseFrequency: 417,
        binauralBeatHz: 5.0, // Theta
        warmth: 1200,
        breathRateHz: 0.15,
        echoAmount: 0.25,
        noiseType: "brown",
        colorTheme: [240, 173, 78], // Bright Orange
        description: "Clears traumatic experiences and facilitates conscious change. Puts you in touch with an inexhaustible source of energy."
    },
    {
        name: "528 Hz - DNA Repair (Miracle Tone)",
        category: "Solfeggio",
        baseFrequency: 528,
        binauralBeatHz: 6.0,
        warmth: 1500,
        breathRateHz: 0.1,
        echoAmount: 0.45,
        noiseType: "none",
        colorTheme: [92, 184, 92], // Healing Green
        description: "The 'Miracle' tone. Used to return human DNA to its original, perfect state. Brings transformation and miracles into your life."
    },
    {
        name: "639 Hz - Connecting / Relationships",
        category: "Solfeggio",
        baseFrequency: 639,
        binauralBeatHz: 7.0, // High Theta
        warmth: 1800,
        breathRateHz: 0.12,
        echoAmount: 0.5,
        noiseType: "pink",
        colorTheme: [91, 192, 222], // Light Blue
        description: "Enhances communication, understanding, tolerance and love. Harmonizes intimate and social relationships."
    },
    {
        name: "741 Hz - Awakening Intuition",
        category: "Solfeggio",
        baseFrequency: 741,
        binauralBeatHz: 8.0, // Alpha border
        warmth: 2000,
        breathRateHz: 0.15,
        echoAmount: 0.4,
        noiseType: "none",
        colorTheme: [66, 139, 202], // Strong Blue
        description: "Cleans the cell from toxins. Leads to a healthier, simpler life, and helps with problem-solving and chronic infections."
    },
    {
        name: "852 Hz - Returning to Spiritual Order",
        category: "Solfeggio",
        baseFrequency: 852,
        binauralBeatHz: 2.0, // Down to Delta for grounding the high freq
        warmth: 2500,
        breathRateHz: 0.08,
        echoAmount: 0.6,
        noiseType: "brown",
        colorTheme: [156, 39, 176], // Spiritual Purple
        description: "Linked to the third eye. Awakens intuition and helps you return to spiritual order and unconditional love."
    },
    {
        name: "963 Hz - Divine Consciousness",
        category: "Solfeggio",
        baseFrequency: 963,
        binauralBeatHz: 1.5,
        warmth: 3000,
        breathRateHz: 0.06,
        echoAmount: 0.7,
        noiseType: "none",
        colorTheme: [255, 255, 255], // Pure White/Light
        description: "Awakens the Crown Chakra. Connects you with the Light and all-embracing Spirit. Returns any system to its original, perfect state."
    },

    // Rife Frequencies (Examples)
    {
        name: "Rife 20 Hz - Universal Healing",
        category: "Rife & Medical",
        baseFrequency: 20,
        binauralBeatHz: 0.5, // Low Delta
        warmth: 500,
        breathRateHz: 0.05,
        echoAmount: 0.2,
        noiseType: "brown",
        colorTheme: [46, 204, 113], // Emerald Green
        description: "A foundational Rife frequency often used for universal healing and balancing. Extremely low frequency, requires good subwoofers or headphones."
    },
    {
        name: "Rife 120 Hz - Fatigue Relief",
        category: "Rife & Medical",
        baseFrequency: 120,
        binauralBeatHz: 2.5,
        warmth: 800,
        breathRateHz: 0.1,
        echoAmount: 0.25,
        noiseType: "none",
        colorTheme: [241, 196, 15], // Energizing Yellow
        description: "Used in Rife therapy to help combat fatigue, stimulate vitality, and assist with muscle relaxation."
    },
    {
        name: "Rife 727 Hz - Anti-Inflammatory",
        category: "Rife & Medical",
        baseFrequency: 727,
        binauralBeatHz: 3.5,
        warmth: 1400,
        breathRateHz: 0.12,
        echoAmount: 0.3,
        noiseType: "pink",
        colorTheme: [52, 152, 219], // Cooling Blue
        description: "A very common Rife frequency used broadly for anti-inflammatory purposes and to boost the immune system."
    },

    // Brainwave Entrainment
    {
        name: "Deep Delta (1-4 Hz) - Dreamless Sleep",
        category: "Brainwave Entrainment",
        baseFrequency: 100, // Low, soothing carrier
        binauralBeatHz: 2.0,
        warmth: 400, // Very muffled
        breathRateHz: 0.08, // Slow, deep breathing
        echoAmount: 0.4,
        noiseType: "brown",
        colorTheme: [20, 30, 80], // Deep Night Blue
        description: "Delta waves are the slowest recorded brain waves in human beings. They are found most often in infants and young children, and are associated with the deepest levels of relaxation and restorative, healing sleep."
    },
    {
        name: "Theta State (4-8 Hz) - Deep Meditation",
        category: "Brainwave Entrainment",
        baseFrequency: 136.1, // OM frequency
        binauralBeatHz: 6.0,
        warmth: 800,
        breathRateHz: 0.12,
        echoAmount: 0.5,
        noiseType: "none",
        colorTheme: [142, 68, 173], // Mystical Purple
        description: "Theta brainwaves occur most often in sleep but are also dominant in deep meditation. It is an elusive state bridging the conscious and unconscious mind, perfect for creative insight and intuition."
    },
    {
        name: "High Frequency (40kHz) - Energetic Clearing",
        category: "Experimental",
        baseFrequency: 40000,
        binauralBeatHz: 0, // No binaural beat needed here usually
        warmth: 3000, // Max open
        breathRateHz: 0, // No tremolo
        echoAmount: 0,   // Pure tone
        noiseType: "none",
        colorTheme: [236, 240, 241], // Bright Silver/White
        description: "Ultra-high frequency (above human hearing limit of ~20kHz). Used experimentally for 'silent' energetic clearing. Your speakers/headphones may not physically produce this tone, and the browser audio engine may clamp it to your hardware's maximum format limit."
    }
];

// Attach to window for UI to access
window.therapeuticPresets = therapeuticPresets;
