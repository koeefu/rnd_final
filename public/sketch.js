var socket;

let song;

let userInteracted = false;

const serial = new p5.WebSerial();

let portButton;
let inData; // for incoming serial data
let outData; // for outgoing data

function setup() {
  createCanvas(400, 400);
  background(0); 

  song = loadSound('music.mp3');

  socket = io.connect('http://10.23.10.93:3000');
  socket.on('mouse', newDrawing);

  //serial.communication
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  serial.getPorts();
  serial.on("noport", makePortButton);
  serial.on("portavailable", openPort);
  serial.on("requesterror", portError);
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}

function newDrawing(data) {
  fill('blue');
  ellipse(data.x, data.y, 20);
  console.log('receive data')
  // data.z;
  song.play(0);
}

function mousePressed(){

  var data = {
    x: mouseX,
    y: mouseY
  }

  socket.emit('mouse', data);
  fill('pink');
  ellipse(mouseX, mouseY, 20);
  song.play(0);
}

//serial communication
function makePortButton() {
  portButton = createButton("choose port");
  portButton.position(10, 10);
  portButton.mousePressed(choosePort);
}

function choosePort() {
  serial.requestPort();
}

function openPort() {
  serial.open().then(initiateSerial);

  function initiateSerial() {
    console.log("port open");
  }
  if (portButton) portButton.hide();
}

function serialEvent() {
  var inString = serial.readStringUntil("\r\n");
  if (inString) {
    var sensors = split(inString, ",");
    if (sensors[0] == 1) {
      song.play();
    } else {
      song.pause();
    }
  }
}

function portError(err) {
  alert("Serial port error: " + err);
}

function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

