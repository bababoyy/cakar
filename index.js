window.callbacks = {};
window.callback_ids = [];
window.pitch = false;
async function test(entry) {
    const pitchShift = new Tone
      .PitchShift({pitch: (Math.random()*2)})
    ;
    entry[4].disconnect();
    entry[4].connect(pitchShift.toDestination())
    entry[4].start();
}
window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
let mobileState = {};
async function add_sound(filename, ms, id) {
    const audio = new Audio(filename);
    await Tone.start();
    const player = new Tone.Player({
      url: filename,
      loop: false,
      autostart: false,
    });
    await Tone.loaded();
    callback_ids.push(id);
    callbacks[id] = [false, filename, ms, audio, player];
    const dom = document.getElementById(id)
    if (window.mobileCheck()) {
        dom.addEventListener('click', function() {
            mobileState[id] = !mobileState[id];
            (mobileState[id]?_mousedown:_mouseup)(id);
        })
        return;
    }
    dom.addEventListener('mousedown', function() {
        _mousedown(id);
    });
    dom.addEventListener('mouseup', function() {
        _mouseup(id);
    });
}
let i = 0;
setInterval(function() {
    for (let entry_id of callback_ids) {
        const entry = callbacks[entry_id];
        if (entry[0] === true && (i % entry[2]) === 0) {
            console.log('a')
            if (pitch) {
                test(entry)
            }
            else {
                entry[3].currentTime = 0;
                if (entry[3].paused) entry[3].play();
            }
        }
    }
    i += 5;
}, 5);
document.onclick = function() {
    add_sound('a.mp3', 40, 'bass');
    add_sound('b_test.mp3', 30, 'siren');
    add_sound('a1.mp3', 20, 'bass1');
    add_sound('a2.mp3', 50, 'bass2');
    add_sound('p.mp3', 25, 'puff');
    document.onclick = false;
}
document.getElementById('pitch').addEventListener('click', function() {
    pitch = !pitch;
    document.getElementById('pitch').style.backgroundColor = pitch?'#0ef10e':'#f10e0e';
})
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});