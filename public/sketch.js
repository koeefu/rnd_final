//web socket code
var socket;

//name each button
let dis_play;
let dis_n;
let dis_pre;
let dis_re;
let vol;
let Loop;

let current = 0;
let currentSound = [];

let status = 0;

function preload() {
  currentSound[0] = loadSound("playlist/sample1.mp3");
  currentSound[1] = loadSound("playlist/sample2.mp3");
  currentSound[2] = loadSound("playlist/sample3.mp3");
}

function setup() {
  let x = windowWidth;
  let y = windowHeight;
  
  createCanvas(x, y);

  socket = io.connect('http://10.23.10.93:3000');
  socket.on('mouse', newDrawing);

  background(255);

  /*************** play button ***************/
  dis_play = dist(mouseX, mouseY, (2 * x) / 4, (3 * y) / 4);
  ellipse((2 * x) / 4, (3 * y) / 4, y / 6);
  text("⏯", (2 * x) / 4, (3 * y) / 4);

  /*************** next button ***************/
  dis_n = dist(mouseX, mouseY, (3 * x) / 4, (3 * y) / 4);
  ellipse((3 * x) / 4, (3 * y) / 4, y / 6);
  text("⏭", (3 * x) / 4, (3 * y) / 4);

  /*************** previous button ***************/
  dis_pre = dist(mouseX, mouseY, (1 * x) / 4, (3 * y) / 4);
  ellipse((1 * x) / 4, (3 * y) / 4, y / 6);
  text("⏮", (1 * x) / 4, (3 * y) / 4);

  /*************** reset button ***************/
  dis_re = dist(mouseX, mouseY, (2 * x) / 3, (1 * y) / 4);
  ellipse((2 * x) / 3, (1 * y) / 4, y / 6);
  text("⏹️", (2 * x) / 3, (1 * y) / 4);

  /*************** volume slider ****************/
  push();
  noFill();
  rect(
    (1 * x) / 16,
    (5 * height) / 11 - (14 * x) / 200,
    (14 * x) / 16,
    (14 * x) / 90
  );
  pop();

  /************* loop button ************/
  Loop = createButton("🔂");
  Loop.position((1 * x) / 3 - y / 12, (1 * y) / 4 - y / 12);
  Loop.size(y / 6, y / 6);
}

function newDrawing(data) {
  let x = windowWidth;
  let y = windowHeight;
  
  background(255);

  /*************** play button ***************/
  dis_play = dist(data.x, data.y, (2 * x) / 4, (3 * y) / 4);
  ellipse((2 * x) / 4, (3 * y) / 4, y / 6);
  text("⏯", (2 * x) / 4, (3 * y) / 4);

  /*************** next button ***************/
  dis_n = dist(data.x, data.y, (3 * x) / 4, (3 * y) / 4);
  ellipse((3 * x) / 4, (3 * y) / 4, y / 6);
  text("⏭", (3 * x) / 4, (3 * y) / 4);

  /*************** previous button ***************/
  dis_pre = dist(data.x, data.y, (1 * x) / 4, (3 * y) / 4);
  ellipse((1 * x) / 4, (3 * y) / 4, y / 6);
  text("⏮", (1 * x) / 4, (3 * y) / 4);

  /*************** reset button ***************/
  dis_re = dist(data.x, data.y, (2 * x) / 3, (1 * y) / 4);
  ellipse((2 * x) / 3, (1 * y) / 4, y / 6);
  text("⏹️", (2 * x) / 3, (1 * y) / 4);

  /*************** volume slider ****************/
  push();
  noFill();
  rect(
    (1 * x) / 16,
    (5 * height) / 11 - (14 * x) / 200,
    (14 * x) / 16,
    (14 * x) / 90
  );
  pop();

  let slider = (5 * windowHeight) / 11 - (14 * windowWidth) / 200;
  if (mouseIsPressed === true) {
    if (data.y > slider && data.y < slider + (14 * windowWidth) / 90) {
      rect(data.x, slider, 5, (14 * windowWidth) / 90);
      vol = map(data.x, windowWidth / 16, (14 * windowWidth) / 16, 0, 1);
    }
  }

  currentSound[current].setVolume(vol);
}

function draw() {

  let slider = (5 * windowHeight) / 11 - (14 * windowWidth) / 200;
  if (mouseIsPressed === true) {
    if (mouseY > slider && mouseY < slider + (14 * windowWidth) / 90) {
      rect(mouseX, slider, 5, (14 * windowWidth) / 90);
      vol = map(mouseX, windowWidth / 16, (14 * windowWidth) / 16, 0, 1);
    }
  }

  currentSound[current].setVolume(vol);
}

function mousePressed() {
  let status = 0;

  var data = {
    x: mouseX,
    y: mouseY
  }

  socket.emit('mouse', data);

  //play
  if (dis_play < windowWidth / 6) {
    if (status === 0) {
      currentSound[current].play();
      console.log(currentSound[current]);
      status = 1;
    } else if (status === 1) {
      currentSound[current].pause();
      currentSound[current].currentTime();
      status = 0;
    }
  }

  //next
  if (dis_n < windowWidth / 6) {
    currentSound[current].pause();
    current++;
    if (current > currentSound.length - 1) {
      current = 0;
    }
    currentSound[current].play();
  }

  //prev
  if (dis_pre < windowWidth / 6) {
    currentSound[current].pause();
    current--;
    if (current < 0) {
      current = currentSound.length - 1;
    }
    currentSound[current].play();
  }

  //reset
  if (dis_re < windowWidth / 6) {
    location.reload();
  }
}



