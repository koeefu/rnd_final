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
    currentSound[0] = loadSound("playlist/s1.mp3");
    currentSound[1] = loadSound("playlist/s2.mp3");
    currentSound[2] = loadSound("playlist/s3.mp3");
}

function setup() {
   
    // background(0);
    socket = io.connect('http://10.23.10.46:3000');

    socket.on('button', playControl);
    socket.on('volume', volumeControl);

    let x = windowWidth;
    let y = windowHeight;

    createCanvas(x, y);
    background(0);
    /*************** play button ***************/
    ellipse(13 * x / 14, 5 * y / 11 - 10 * x / 200 + 7 * x / 110, y / 3.5);
    text("⏯", 13 * x / 14, 5 * y / 11 - 10 * x / 200 + 7 * x / 110);

    /*************** next button ***************/
    ellipse(13 * x / 14, y / 7.5, y / 4);
    text("⏭", 13 * x / 14, y / 7.5);

    /*************** previous button ***************/
    ellipse(5 * x / 7 - x / 14, y / 7.5, y / 4);
    text("⏮", 5 * x / 7 - x / 14, y / 7.5);

    /*************** reset button ***************/
    ellipse(x / 7 - x / 10, y / 7.5, y / 4);
    text("⏹️", x / 7 - x / 10, y / 7.5);

    /************* loop button ************/
    Loop = createButton("🔂");
    Loop.position((1 * x) / 3 - y / 12, (1 * y) / 8 - y / 12);
    Loop.size(y / 6, y / 5);
}

function draw() {
    // background(0);
    /*************** volume slider ****************/
    push();
    noFill();
    rect(
        (1 * windowWidth) / 16,
        (3 * windowHeight / 4 - windowHeight / 16),
        (14 * windowWidth) / 16,
        windowHeight / 4
    );
    pop();

    let slider = (3 * windowHeight / 4 - windowHeight / 16);
    if (mouseIsPressed === true) {
        if (mouseY > slider && mouseY < slider + windowHeight / 4) {
            rect(mouseX, slider, 5, windowHeight / 4);
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
    if (dist(mouseX, mouseY, 13 * windowWidth / 14,
        (5 * windowHeight) / 11 - 10 * windowWidth / 200 + 7 * windowWidth / 110) < windowHeight / 3.5) {
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
        13 * windowWidth / 14,
        windowHeight / 7.5) < windowHeight / 4) {
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
        (5 * windowWidth) / 7 - windowWidth / 14,
        windowHeight / 7.5) < windowHeight / 4) {
        currentSound[current].pause();
        current--;
        if (current < 0) {
            current = currentSound.length - 1;
        }
        socket.emit('button', 3);
        currentSound[current].play();
    }

    //reset
    if (dist(mouseX, mouseY, windowWidth / 7 - windowWidth / 10, windowHeight / 7.5) < windowHeight / 4) {
        socket.emit('button', 4);
        location.reload();
        // socket.emit('button', 4);
    }
}