var peer = new Peer();
peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
    var qrcode = new QRCode("qrcode", {
        text: id,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.Q
    });
});
let conn = undefined;
peer.on('connection', function(c) {
    conn = c;
    conn.on('data', function(data) {
        const [state, id] = data;
        console.log(id)
        if (id === "pitch") document.getElementById('pitch').click();
        if (state === 'mouseup') _mouseup(id);
        else if (state === 'mousedown') _mousedown(id);
        else console.log(data);
    });
    conn.on('close', function() {
        console.log('close')
        conn = undefined;
    })
})
window._mousedown = (id) => {
    callbacks[id].state = true;
    window._play(id);
}
window._mouseup = (id) => {
    callbacks[id].state = false;
}