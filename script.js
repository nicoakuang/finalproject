// --- Inisialisasi Library Animasi ---

// 1. Animasi Fade In saat Halaman Dimuat

// 2. Inisialisasi Typed.js untuk Animasi Mengetik
document.addEventListener('DOMContentLoaded', function() {
    new Typed('#typed-text', {
        strings: ['Adagio', 'An Intelligent Music Search Engine'],
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 1200,
        startDelay: 500,
        loop: true,
        smartBackspace: true
    });
});

// 3. Inisialisasi Particles.js untuk Latar Belakang
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.5,
            "random": false
        },
        "size": {
            "value": 3,
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

// 4. Inisialisasi AOS (Animate On Scroll) Library
AOS.init({
    duration: 800,
    once: true,
    offset: 50,
});

// 5. Animasi Counter untuk Hasil
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.percentage');
    const speed = 1500; // Durasi total animasi dalam milidetik

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-count');
        const updateCount = () => {
            const current = +counter.innerText.replace('%', '');
            const increment = target / (speed / 10);

            if (current < target) {
                counter.innerText = `${Math.ceil(current + increment)}%`;
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = `${target}%`;
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Memicu saat 50% elemen terlihat
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
});

// --- FUNGSI UNTUK TOMBOL KEMBALI KE ATAS ---
const backToTopButton = document.getElementById("back-to-top-btn");
window.onscroll = function() {
    scrollFunction();
};
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
}
backToTopButton.addEventListener("click", function() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
});


// --- FUNGSI UNTUK MODAL GALERI GAMBAR ---
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-image");
const captionText = document.getElementById("caption");
const galleryImages = document.querySelectorAll(".gallery-grid img");
const span = document.getElementsByClassName("close-btn")[0];
galleryImages.forEach(img => {
    img.onclick = function(){
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    }
});
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// --- FUNGSI UNTUK LIVE AUDIO VISUALIZER ---
const visualizerButton = document.getElementById('visualizer-btn');
const canvas = document.getElementById('audio-canvas');
const canvasCtx = canvas.getContext('2d');
let audioCtx;
let analyser;
let source;
let animationFrameId;
let isVisualizerActive = false;

visualizerButton.addEventListener('click', function() {
    if (!isVisualizerActive) {
        startVisualizer();
    } else {
        stopVisualizer();
    }
});

function startVisualizer() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            function draw() {
                animationFrameId = requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);
                canvasCtx.fillStyle = '#1a1a1a';
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] * 1.5;
                    const r = barHeight + (25 * (i / bufferLength));
                    const g = 250 * (i / bufferLength);
                    const b = 50;
                    canvasCtx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
                    x += barWidth + 1;
                }
            }
            draw();
            isVisualizerActive = true;
            visualizerButton.textContent = 'Stop Visualizer';
            visualizerButton.classList.add('active');
        }).catch(function(err) {
            alert('Error accessing microphone: ' + err);
        });
}

function stopVisualizer() {
    cancelAnimationFrame(animationFrameId);
    if (source) {
        source.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioCtx) {
        audioCtx.close();
    }
    canvasCtx.fillStyle = '#1a1a1a';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    isVisualizerActive = false;
    visualizerButton.textContent = 'Start Visualizer';
    visualizerButton.classList.remove('active');
}

// --- Logika untuk Dark/Light Mode ---
const toggleSwitch = document.querySelector('#checkbox');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.body.classList.add(currentTheme);
    if (currentTheme === 'dark-mode') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

// --- Logika untuk Navigasi Aktif Saat Scroll ---
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5, // Memicu saat 50% section terlihat
        rootMargin: '-50px 0px -50px 0px' // Sedikit penyesuaian untuk akurasi
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});
