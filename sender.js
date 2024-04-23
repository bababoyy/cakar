let peer;
var conn;
var lastPeerId;
function initialize() {
  // Create own peer object with connection to shared PeerJS server
  peer = new Peer(null, {
    debug: 2,
  });

  peer.on("open", function (id) {
    // Workaround for peer.reconnect deleting previous id
    if (peer.id === null) {
      console.log("Received null id from peer open");
      peer.id = lastPeerId;
    } else {
      lastPeerId = peer.id;
    }

    console.log("ID: " + peer.id);
  });

  peer.on("disconnected", function () {
    console.log("Connection lost. Please reconnect");

    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
  });
  peer.on("close", function () {
    conn = null;
    console.log("Connection destroyed");
  });
  peer.on("error", function (err) {
    console.log(err);
    alert("" + err);
  });
}
initialize()
/**
 * Triggered once a connection has been achieved.
 * Defines callbacks to handle incoming data and connection events.
 */
function ready() {
  conn.on("data", function (data) {
    console.log("Data recieved", data);
  });
  conn.on("close", function () {
    console.log("Connection reset<br>Awaiting connection...");
    conn = null;
  });
}
connectbutton.onclick = () => {
  console.log("a");
  conn = peer.connect(idinput.value, {
    reliable: true
  });

  conn.on('open', function () {
    console.log("Connected to: " + conn.peer);

    // Check URL params for comamnds that should be sent immediately
  });
};
window._mousedown = function(id) {
  if (!conn) return console.log("No conn");
  conn.send(["mousedown", id]);
}
window._mouseup = function(id) {
  if (!conn) return console.log("No conn");
  conn.send(["mouseup", id]);
}