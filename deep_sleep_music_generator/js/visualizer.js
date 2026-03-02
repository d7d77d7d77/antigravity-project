// visualizer.js

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

let width, height;
let rings = [];

// Handle resizing
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Ring {
    constructor(radius, speed, color) {
        this.radius = radius;
        this.speed = speed;
        this.opacity = 1.0;
        this.color = color; // [r, g, b] array
    }

    update() {
        this.radius += this.speed;
        // Fade out as it expands
        this.opacity = Math.max(0, 1 - (this.radius / (Math.max(width, height) * 0.6)));
    }

    draw() {
        if (this.opacity <= 0) return;

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, this.radius, 0, Math.PI * 2);
        const [r, g, b] = this.color;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.6})`;
        ctx.lineWidth = 2 + (this.radius * 0.01);
        ctx.stroke();
    }
}

// Ensure there is a default color theme
if (!window.activeColorTheme) {
    window.activeColorTheme = [122, 109, 232];
}

let lastTime = 0;
let timeAccumulator = 0;
const ringSpawnInterval = 800; // ms

function animate(time) {
    requestAnimationFrame(animate);

    const deltaTime = time - lastTime;
    lastTime = time;

    // Faintly clear canvas to create a slight motion blur effect
    ctx.fillStyle = 'rgba(11, 7, 30, 0.2)'; // Matches deep background
    ctx.fillRect(0, 0, width, height);

    let currentVolume = 0;

    // Get audio data if engine is active
    if (window.audioEngine && window.audioEngine.isPlaying && window.audioEngine.getAnalyserData) {
        const audioData = window.audioEngine.getAnalyserData();
        if (audioData) {
            const data = audioData.data;
            let sum = 0;
            // Focus on lower frequencies for pulsing
            const count = Math.min(20, audioData.bufferLength);
            for (let i = 0; i < count; i++) {
                sum += data[i];
            }
            currentVolume = sum / count;
        }
    }

    timeAccumulator += deltaTime;

    // Spawn rings periodically, speed/size affected by volume
    if (timeAccumulator > ringSpawnInterval) {
        timeAccumulator = 0;
        const color = window.activeColorTheme || [122, 109, 232];

        // Base spawn radius depends slightly on volume
        const spawnRadius = 20 + (currentVolume * 0.5);
        // Expansion speed depends on volume (faster expansion for louder)
        const speed = 0.5 + (currentVolume * 0.01);

        rings.push(new Ring(spawnRadius, speed, color));
    }

    // Draw central pulsing core
    const coreRadius = 15 + (currentVolume * 0.3);
    const [cr, cg, cb] = window.activeColorTheme || [122, 109, 232];
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.8)`;

    // Add glow
    ctx.shadowBlur = 20 + (currentVolume * 0.2);
    ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, 1)`;
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Update and draw expanding rings
    for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.update();
        ring.draw();

        // Remove dead rings
        if (ring.opacity <= 0) {
            rings.splice(i, 1);
        }
    }
}

// Start visualizer loop
requestAnimationFrame(animate);
