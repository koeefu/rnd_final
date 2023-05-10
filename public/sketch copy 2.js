var socket;

//name each button
let dis_play;
let dis_n;
let dis_pre;
let dis_re;
let vol;

let current = 0;
let currentSound = [];

let status = 0;

function preload() {
  currentSound[0] = loadSound("playlist/sample1.mp3");
  currentSound[1] = loadSound("playlist/sample2.mp3");
  currentSound[2] = loadSound("playlist/sample3.mp3");
}

function setup() {
  socket = io.connect('http://10.23.10.46:3000');

  socket.on('button', playControl);
  socket.on('volume', volumeControl);

  let x = windowWidth;
  let y = windowHeight;

  createCanvas(x, y);

  /*************** play button ***************/
  ellipse((2 * x) / 4, (3 * y) / 4 + y / 16, y / 4);
  text("⏯", (2 * x) / 4, (3 * y) / 4);

  /*************** next button ***************/
  ellipse((3 * x) / 4, (3 * y) / 4 + y / 16, y / 4);
  text("⏭", (3 * x) / 4, (3 * y) / 4);

  /*************** previous button ***************/
  ellipse((1 * x) / 4, (3 * y) / 4 + y / 16, y / 4);
  text("⏮", (1 * x) / 4, (3 * y) / 4);

  /*************** reset button ***************/
  ellipse((2 * x) / 3, (1 * y) / 7.5, y / 4);
  text("⏹️", (2 * x) / 3, (1 * y) / 7.5);

  /************* loop button ************/
  Loop = createButton("🔂");
  Loop.position((1 * x) / 3 - y / 12, (1 * y) / 8 - y / 12);
  Loop.size(y / 6, y / 5);
}

function draw() {

  /*************** volume slider ****************/
  push();
  noFill();
  rect(
    (1 * windowWidth) / 16,
    (5 * windowHeight) / 11 - (10 * windowWidth) / 200,
    (14 * windowWidth) / 16,
    (14 * windowWidth) / 110
  );
  pop();

  let slider = (5 * windowHeight) / 11 - (10 * windowWidth) / 200;
  if (mouseIsPressed === true) {
    if (mouseY > slider && mouseY < slider + (14 * windowWidth) / 110) {
      rect(mouseX, slider, 5, (14 * windowWidth) / 110);
      vol = map(mouseX, windowWidth / 16, (14 * windowWidth) / 16, 0, 1);
    }
  }
  currentSound[current].setVolume(vol);
  socket.emit('volume', vol);
}

function playControl(value) {
  console.log(`play control: ${value}, current: ${current}`);
  if (value === 1) {
    currentSound[current].play();
  } else if (value === 0) {
    currentSound[current].pause();
  } else if (value === 2) {
    currentSound[current].pause();
    current = (current + 1) % 3;
    currentSound[current].play();
  } else if (value === 3) {
    currentSound[current].pause();
    current = current === 0 ? 2 : current - 1;
    currentSound[current].play();
  } else if (value === 4) {
    location.reload();
  }
}

function volumeControl(value) {
  // change volume
  currentSound[current].setVolume(value);
}

function mousePressed() {
  //play
  if (dist(mouseX, mouseY, (2 * windowWidth) / 4, (3 * windowHeight) / 4 + windowHeight / 16) < windowHeight / 4) {
    console.log(current, status);
    if (status === 0) {
      console.log('playing');
      currentSound[current].play();
      console.log(currentSound[current]);
      socket.emit('button', 1);
      status = 1;
    } else if (status === 1) {
      console.log('paused');
      currentSound[current].pause();
      currentSound[current].currentTime();
      socket.emit('button', 0);
      status = 0;
    }
  }

  //next
  if (dist(mouseX, mouseY, 
    (3 * windowWidth) / 4, 
    (3 * windowHeight) / 4 + windowHeight / 16) < windowHeight / 4) {
    currentSound[current].pause();
    current++;
    if (current > currentSound.length - 1) {
      current = 0;
    }
    socket.emit('button', 2);
    currentSound[current].play();
  }

  //prev
  if (dist(mouseX, mouseY, 
    (1 * windowWidth) / 4, 
    (3 * windowHeight) / 4) + windowHeight / 16 < windowHeight / 4) {
    currentSound[current].pause();
    current--;
    if (current < 0) {
      current = currentSound.length - 1;
    }
    socket.emit('button', 3);
    currentSound[current].play();
  }

  //reset
  if (dist(mouseX, mouseY, (2 * windowWidth) / 3, (1 * windowHeight) / 7.5) < windowHeight / 4) {
    socket.emit('button', 4);
    location.reload();
    // socket.emit('button', 4);
  }
}