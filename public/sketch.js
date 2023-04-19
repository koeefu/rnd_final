var socket;

let music;

let userInteracted = false;

function setup() {
  createCanvas(400, 400);
  background(0); 

  music = loadSound('music.mp3');

  socket = io.connect('http://10.23.10.93:3000');
  socket.on('mouse', newDrawing);

}

// function draw(){
//   if(!userInteracted){
//     stroke('white');
//     text('click to start',width/2, height/2)
//   }
// }

function newDrawing(data) {
  fill('blue');
  ellipse(data.x, data.y, 20);
  console.log('receive data')
  // data.z;
  music.play(0);
}

function mousePressed(){
  // if(!userInteracted) {
  //   userInteracted = true;
  //   return;
  // }
  // music.play();
  // console.log(mouseX + ',' + mouseY);

  var data = {
    x: mouseX,
    y: mouseY
  }

  socket.emit('mouse', data);
  fill('pink');
  ellipse(mouseX, mouseY, 20);
  music.play(0);
}

// function mousePressed() {
//   music.play();
// }

// function draw() {

//   // background(0); 
//   // fill('pink');
//   // ellipse(mouseX, mouseY, 20);


// }
