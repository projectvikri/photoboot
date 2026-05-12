const App = {
    // 1. Elemen UI
    elements: {
        video: document.getElementById('video'),
        canvas: document.getElementById('main-canvas'),
        countdown: document.getElementById('countdown'),
        flash: document.getElementById('flash'),
        screens: {
            idle: document.getElementById('screen-idle'),
            capture: document.getElementById('screen-capture'),
            review: document.getElementById('screen-review')
        }
    },

    // 2. Inisialisasi
    init() {
        document.getElementById('btn-start').onclick = () => this.startSession();
        document.getElementById('btn-retake').onclick = () => this.startSession();
        document.getElementById('btn-finish').onclick = () => this.showScreen('idle');
        this.setupCamera();
    },

    async setupCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 1280, height: 720 }, 
                audio: false 
            });
            this.elements.video.srcObject = stream;
        } catch (err) {
            alert("Kamera tidak ditemukan atau akses ditolak.");
        }
    },

    // 3. Alur Utama
    showScreen(key) {
        Object.values(this.elements.screens).forEach(s => s.classList.add('hidden'));
        this.elements.screens[key].classList.remove('hidden');
    },

    startSession() {
        this.showScreen('capture');
        this.runCountdown(10

        );
    },

    runCountdown(seconds) {
        let count = seconds;
        this.elements.countdown.innerText = count;
        
        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                this.elements.countdown.innerText = count;
            } else {
                clearInterval(timer);
                this.elements.countdown.innerText = "";
                this.takePhoto();
            }
        }, 1000);
    },

    takePhoto() {
        // Efek Flash
        this.elements.flash.classList.add('flash-active');
        setTimeout(() => this.elements.flash.classList.remove('flash-active'), 500);

        // Proses Capture ke Canvas
        const ctx = this.elements.canvas.getContext('2d');
        this.elements.canvas.width = this.elements.video.videoWidth;
        this.elements.canvas.height = this.elements.video.videoHeight;
        
        // Mirroring (opsional, agar seperti cermin)
        ctx.translate(this.elements.canvas.width, 0);
        ctx.scale(-1, 1);
        
        ctx.drawImage(this.elements.video, 0, 0);

        // Siapkan Download
        const dataURL = this.elements.canvas.toDataURL('image/png');
        document.getElementById('btn-download').href = dataURL;
        document.getElementById('btn-download').download = `photo_${Date.now()}.png`;

        // Pindah ke Review
        setTimeout(() => this.showScreen('review'), 600);
    }
};

// Jalankan sistem
App.init();