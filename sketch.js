const fontSize = 30;

// Particle system variables
let particles = [];
let gravity;

/* - - Variables - - */

// webcam variables
let capture; // our webcam
let captureEvent; // callback when webcam is ready

/* - - Setup - - */
function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam(); // launch webcam
  textSize(fontSize);
  angleMode(DEGREES);

  capture.hide(); // hide the webcam

  
 
  
  
  // Set up gravity
  gravity = createVector(0, 0.1);

}

function draw() {


  centerOurStuff(); // center the webcam

 
  // Draw the video
  
 

  // Draw the drawing over the video
  if (mediaPipe.landmarks[0]) { // is hand tracking ready?
    centerOurStuff();
    noStroke();
    fill(255, 127, 80);
 
    let indexX = map(mediaPipe.landmarks[0][8].x, 1, 0, 0, capture.scaledWidth);
    let indexY = map(mediaPipe.landmarks[0][8].y, 0, 1, 0, capture.scaledHeight);
    let thumbX = map(mediaPipe.landmarks[0][4].x, 1, 0, 0, capture.scaledWidth);
    let thumbY = map(mediaPipe.landmarks[0][4].y, 0, 1, 0, capture.scaledHeight);
    let mediumX = map(mediaPipe.landmarks[0][12].x, 1, 0, 0, capture.scaledWidth);
    let mediumY = map(mediaPipe.landmarks[0][12].y, 0, 1, 0, capture.scaledHeight);
    let ringX = map(mediaPipe.landmarks[0][16].x, 1, 0, 0, capture.scaledWidth);
    let ringY = map(mediaPipe.landmarks[0][16].y, 0, 1, 0, capture.scaledHeight);
    let pinkyX = map(mediaPipe.landmarks[0][20].x, 1, 0, 0, capture.scaledWidth);
    let pinkyY = map(mediaPipe.landmarks[0][20].y, 0, 1, 0, capture.scaledHeight);

  if (dist(indexX, indexY, thumbX, thumbY) > 50) {
    background(220, 20);
 
    gravity = createVector(0, 0.1);
    } 
    if (dist(thumbX, thumbY, indexX, indexY) < 50) {
    gravity = createVector(0, 0.1);
    }
    else {
      !emitParticles(indexX, indexY);


      

      }

    

  
 
    ellipse(indexX , indexY, 30, 30);

    // Emit particles from the index finger
    emitParticles(indexX, indexY);

    // Update and draw particles
    updateAndDrawParticles();



  }
  else {
    // If hand tracking is not ready, display a loading message
    background(60, 20);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Create Particles with Index finger", width / 2,  height / 2);
    text("Pinch Gesture to Draw...", width / 2, height / 2 + 100);
    emitParticles(width / 2, height * 0.8);
    updateAndDrawParticles();
    
  }
}



function captureWebcam() {
  capture = createCapture(
    {
      audio: false,
      video: {
        facingMode: "user",
        frameRate: 60,
        numHands: 2,
      },
    },
    function (e) {
      captureEvent = e;
      console.log(captureEvent.getTracks()[0].getSettings());
      capture.srcObject = e;
      setCameraDimensions(capture);
      mediaPipe.predictWebcam(capture);
    }
  );
  capture.elt.setAttribute("playsinline", "");

}

function setCameraDimensions(video) {
  const vidAspectRatio = video.width / video.height; // aspect ratio of the video
  const canvasAspectRatio = width / height; // aspect ratio of the canvas

  if (vidAspectRatio > canvasAspectRatio) {
    video.scaledHeight = height;
    video.scaledWidth = video.scaledHeight * vidAspectRatio;
  } else {
    video.scaledWidth = width;
    video.scaledHeight = video.scaledWidth / vidAspectRatio;
  }
}

function centerOurStuff() {
  translate(width / 2 - capture.scaledWidth / 2, height / 2 - capture.scaledHeight / 2); // center the webcam
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions(capture);
}

function emitParticles(x, y) {
  // Emit a new particle from the index finger's position
  let particle = {
    position: createVector(x, y),
    velocity: createVector(random(-2, 2), random(-5, -2)),
    acceleration: gravity.copy(),
    color: color(random(100), random(100), random(100)),
    lifespan: 255,
  };
  particles.push(particle);
}

function updateAndDrawParticles() {
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    
    // Apply gravity to the particle
    particle.velocity.add(particle.acceleration);
    particle.position.add(particle.velocity);
    particle.lifespan -= 1.5;

    fill(particle.color.levels[0], particle.color.levels[1], particle.color.levels[2], particle.lifespan);
    ellipse(particle.position.x, particle.position.y, 3, 10);

    // Remove particles when their lifespan is exhausted
    if (particle.lifespan <= 0) {
      particles.splice(i, 1);
    }
  }
}
