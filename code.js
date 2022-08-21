const MIN_DELAY = 720;
const MAX_DELAY = 1500;
const BG_VELOCITY = 0.4 * 0.06 /* vw per ms */; 
const ROAD_VELOCITY = 1.7 * 0.06;

// genertal  animation
let stopAnimations = false;
let deltaT;
let previousTimeStamp;
let done = false;

// background animation
let currBackgroundX = 0;
let currRoadX = 0;

// bstacle animation 
let typesOfObstacles = ["tall-obstacle", "short-obstacle"];
let obstacleTimeOut;

// Variables that are in loops (refrain from creating too much variables)
let obstacleX;
let newObstacle;
let obstacleArray = [];

// general
let pauseDelay;

window.addEventListener("load", () => {
  startGame();
});

const startGame = () => {
  document.addEventListener("click", jump);
  window.requestAnimationFrame(handleAnimations);
  createObstacles();
  document.getElementById("pause").addEventListener("click", pause);
    // pause the game when user changes tabs
    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState !== "visible") {
        let stop = new Event("click");
        document.getElementById("pause").dispatchEvent(stop);
      }
    });
}

const jump = (event) => {
  let animationTime = Number(getComputedStyle(document.documentElement).getPropertyValue('--jump-time').slice(0, -1)) * 1000 ;
  if ((event.type === "keydown" && event.key === " ") || event.type === "click") {
    document.removeEventListener("click", jump);
    document.getElementById("tembel").classList.add("jump");
    setTimeout(() => {
      document.addEventListener("click", jump);
      document.getElementById("tembel").classList.remove("jump");
    }, animationTime);
  }
}

const initVariables = () => {
  currRoadX = 0;
  currBackgroundX = 0;
}

const handleAnimations = (timestamp) => {
  if(!done) {
    window.requestAnimationFrame(handleAnimations);
    deltaT = timestamp - previousTimeStamp;
    if (deltaT < 160) {
      animateBackground();
      animateObstacles()
    }
  } else {
    clearTimeout(obstacleTimeOut);
  }
  previousTimeStamp = timestamp;
}

function animLoop( render ) {
  var running, lastFrame = +new Date;
  function loop( now ) {
      // stop the loop if render returned false
      if ( running !== false ) {
          requestAnimationFrame( loop );
          var elapsed1 = now - lastFrame;
          // do not render frame when deltaT is too high
          if ( elapsed1 < 160 ) {
              running = render( elapsed1 );
          }
          lastFrame = now;
      }
  }
  loop( lastFrame );
}

const continueGame = (event) => {
  event.stopPropagation();
  document.getElementById("pause-message").classList.add("none");
  // document.addEventListener("click", jump);
  document.getElementById("resume").removeEventListener("click", continueGame);
  document.getElementById("quit").removeEventListener("click", endGame);
  document.addEventListener("click", jump);
  document.getElementById("timer").innerText = `3`;
  document.getElementById("timer").classList.remove("none");
  setTimeout(delayCounter, 1000, 2);
}

const delayCounter = (secondsLeft) => {
  if (secondsLeft === 0) {
    document.getElementById("timer").classList.add("none");
    window.requestAnimationFrame(handleAnimations);
    obstacleTimeOut = setTimeout(createObstacles, Math.round(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY));
    done = false;
    document.getElementById("pause").addEventListener("click", pause);
  } else {
    document.getElementById("timer").innerText = `${secondsLeft}`;
    secondsLeft--;
    setTimeout(delayCounter, 1000, secondsLeft);
  }
} 

const animateBackground = () => {
  currBackgroundX -= BG_VELOCITY * deltaT;
  document.getElementById("body").style.backgroundPositionX = `${currBackgroundX}vw`;
  currRoadX -= ROAD_VELOCITY * deltaT;
  document.getElementById("road").style.backgroundPositionX = `${currRoadX}vw`;
}

const createObstacles = () => {
  newObstacle = document.createElement("div");
  obstacleType = typesOfObstacles[Math.round(Math.random(typesOfObstacles.length))];
  newObstacle.classList.add("obstacle", obstacleType);
  newObstacle.style.right = "0vw";
  document.getElementById("body").prepend(newObstacle);
  // setTimeout(createObstacles, Math.round(MAX_DELAY));
  obstacleTimeOut = setTimeout(createObstacles, Math.round(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY));
}

const animateObstacles = () => {
  obstacleArray = document.querySelectorAll(".obstacle");
  obstacleArray.forEach((element) => {
    obstacleX = Number(element.style.right.slice(0, -2));
    obstacleX += ROAD_VELOCITY * deltaT;
    element.style.right = `${obstacleX}vw`;
  })
};

const pause = (event) => {
  console.log("pause");
  event.stopPropagation();
  document.removeEventListener("click", jump);
    document.getElementById("pause").removeEventListener("click", pause);
    done = true;
    document.getElementById("pause-message").classList.remove("none");
    // document.querySelectorAll(".obstacle").forEach((el => {
    //   el.remove();
    // }));
    document.getElementById("resume").addEventListener("click", continueGame);
    document.getElementById("quit").addEventListener("click", endGame);
}

const endGame = () => {

}

function El(tagName, options = {}, ...children) {
  let el = Object.assign(document.createElement(tagName), options.fields || {});
  if (options.classes && options.classes.length)
    el.classList.add(...options.classes);
  else if (options.cls) el.classList.add(options.cls);
  if (options.id) el.id = options.id;
  el.append(...children.filter((el) => el));
  for (let listenerName of Object.keys(options.listeners || {}))
    if (options.listeners[listenerName])
      el.addEventListener(listenerName, options.listeners[listenerName], false);
  for (let attributeName of Object.keys(options.attributes || {})) {
    if (options.attributes[attributeName] !== undefined)
      el.setAttribute(attributeName, options.attributes[attributeName]);
  }
  return el;
}








function animLoop( render ) {
  var running, lastFrame = +new Date;
  function loop( now ) {
      // stop the loop if render returned false
      if ( running !== false ) {
          requestAnimationFrame( loop );
          var elapsed1 = now - lastFrame;
          // do not render frame when deltaT is too high
          if ( elapsed1 < 160 ) {
              running = render( elapsed1 );
          }
          lastFrame = now;
      }
  }
  loop( lastFrame );
}

// Usage
// optional 2nd arg: elem containing the animation
// animLoop(moveLeft);

const moveLeft = (deltaT) => {
  elem.style.left = ( left += 10 * deltaT / 16 ) + "px";
  if ( left > 400 ) {
    return false;
  }
}