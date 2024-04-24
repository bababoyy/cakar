/** @type {number} */
window.callbacks = {};
window.callback_ids = [];
window.pitch = false;
class CakarSound {
    createNativeAudio() {
        this.nativeAudio = new Audio(this.filename);
    }
    async createPitchedAudio() {
        this.pitches = Array(5).fill(0).map(_ => Math.random() * 2);
        await Tone.start();
        /** @type {Tone.Player[]} */
        this.pitchedAudios = [];
        for (let pitch of this.pitches) {
            const player = new Tone.Player({
                url: URL.createObjectURL(await this.blob),
                loop: false,
                autostart: false
            })
            const pitchShift = new Tone
                .PitchShift({ pitch });
            player.connect(pitchShift.toDestination());
            this.pitchedAudios.push(player)
        }
    }
    createAudio() {
        this.blob = fetch(this.filename).then(r => r.blob());
        this.createNativeAudio();
        this.createPitchedAudio();
    }
    addEventListeners() {
        this._onmousedown = () => _mousedown(this.id);
        this._onmouseup = () => _mouseup(this.id);
        /*if (navigator.userAgentData.mobile) {
            this.dom.addEventListener('mousedown', this._onmousedown)
            return;
        }; */
        this.dom.addEventListener('mousedown', (e) => {
            if (e.which === 2) {
                this.ms = 50;
                window._play(this.id);
            } else if (e.which === 3) {
                this.ms = 30;
                window._mousedown(this.id);
            } else {
                this.ms = 50;
                window._mousedown(this.id)
            }
        });
        this.dom.addEventListener('mouseup', function() {
            _mouseup(this.id);
        })
    }
    static add_sound(filename, ms, id) {
        const cakarSound = new CakarSound(filename, ms, id);
        callback_ids.push(id);
        callbacks[id] = cakarSound;
    }
    constructor(filename, ms, id) {
        this.state = false;
        this.filename = filename;
        this.ms = ms;
        this.id = id;
        this.dom = document.getElementById(this.id);
        this.createAudio();
        this.addEventListeners();
    }
}
let i = 0;
window._play = (id) => {
    if (window.pitch) {
        callbacks[id].pitchedAudios[Math.floor(Math.random() * callbacks[id].pitchedAudios.length)].start();
    } else {
        callbacks[id].nativeAudio.currentTime = 0;
        if (callbacks[id].nativeAudio.paused) callbacks[id].nativeAudio.play();
    }
};
setInterval(function() {
    for (let entry_id of callback_ids) {
        /** @type {CakarSound} */
        const entry = callbacks[entry_id];
        if ((entry.state === true) && (i % entry.ms) === 0) {
            console.log('a')
            window._play(entry_id);
        }
    }
    i += 5;
}, 5);
document.onclick = function() {
    CakarSound.add_sound('a.mp3', 40, 'bass');
    CakarSound.add_sound('b_test.mp3', 45, 'siren');
    CakarSound.add_sound('a1.mp3', 45, 'bass1');
    CakarSound.add_sound('a2.mp3', 50, 'bass2');
    CakarSound.add_sound('p.mp3', 45, 'puff');
    document.onclick = false;
}
document.getElementById('pitch').addEventListener('click', function() {
    pitch = !pitch;
    document.getElementById('pitch').style.backgroundColor = pitch?'#0ef10e':'#f10e0e';
})
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});
document.addEventListener('contextmenu', e => {
    e.preventDefault();
});