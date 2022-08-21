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
let tembelClientRect;
let obstacleClientRect;
let collisions;

// general
let pauseDelay;

window.addEventListener("load", () => {
  document.getElementById("start").addEventListener("click", startGame);
});

const startGame = (event) => {
  event.stopPropagation();
  if (document.getElementById("tembel")) {
    done = false;
    document.getElementById("end-message").classList.add("none");
    document.getElementById("tembel").classList.remove("none");
    document.getElementById("replay").removeEventListener("click", startGame);
    document.querySelectorAll(".obstacle").forEach((el => {
      el.remove();
    }));
  } else {
    let tembel = El("img", {id: "tembel", attributes: {"src": "assets/media/tembel.png", "alt":"cat"}});
    document.getElementById("body").appendChild(tembel);
    document.getElementById("start-message").classList.add("none");
    document.getElementById("start").removeEventListener("click", startGame);
  }
  document.addEventListener("click", jump);
  continueGame(event);
    // pause the game when user changes tabs
    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState !== "visible") {
        let stop = new Event("click");
        document.getElementById("pause").dispatchEvent(stop);
      }
    });
}

const jump = (event) => {
  let animationTime = 0.7 * 1000;
    document.removeEventListener("click", jump);
    document.getElementById("tembel").classList.add("jump");
    setTimeout(() => {
      document.addEventListener("click", jump);
      document.getElementById("tembel").classList.remove("jump");
    }, animationTime);
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
      checkCollision();
    }
  } else {
    clearTimeout(obstacleTimeOut);
  }
  previousTimeStamp = timestamp;
}

const continueGame = (event) => {
  event.stopPropagation();
  document.getElementById("pause-message").classList.add("none");
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
  obstacleTimeOut = setTimeout(createObstacles, Math.round(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY));
}

const animateObstacles = () => {
  obstacleArray = document.querySelectorAll(".obstacle");
  console.log(obstacleArray.length);
    obstacleArray.forEach((element) => {
      obstacleX = Number(element.style.right.slice(0, -2));
      obstacleX += ROAD_VELOCITY * deltaT;
      if (obstacleX > 100) {
        element.remove();
      }
      element.style.right = `${obstacleX}vw`;
    });
};

const pause = (event) => {
  console.log("pause");
  event.stopPropagation();
  document.removeEventListener("click", jump);
    document.getElementById("pause").removeEventListener("click", pause);
    done = true;
    document.getElementById("pause-message").classList.remove("none");
    document.getElementById("resume").addEventListener("click", continueGame);
    document.getElementById("quit").addEventListener("click", endGame);
}


const checkCollision = () => {
  tembelClientRect = document.getElementById("tembel").getBoundingClientRect();
  document.querySelectorAll(".obstacle").forEach((elem, index) => {
    obstacleClientRect = elem.getBoundingClientRect();
    if (tembelClientRect.x < obstacleClientRect.x + obstacleClientRect.width &&
      tembelClientRect.x + tembelClientRect.width > obstacleClientRect.x &&
      tembelClientRect.y < obstacleClientRect.y + obstacleClientRect.height &&
      tembelClientRect.height + tembelClientRect.y > obstacleClientRect.y) {
        setTimeout (() => {
          if (tembelClientRect.x < obstacleClientRect.x + obstacleClientRect.width &&
            tembelClientRect.x + tembelClientRect.width > obstacleClientRect.x &&
            tembelClientRect.y < obstacleClientRect.y + obstacleClientRect.height &&
            tembelClientRect.height + tembelClientRect.y > obstacleClientRect.y) {
              endGame();
              console.log("one");
              return;
          }
      }, 11)
    }
  });
}

const endGame = () => {
  document.getElementById("pause").removeEventListener("click", pause);
  done = true;
  document.getElementById("end-message").classList.remove("none");
  document.getElementById("tembel").classList.add("none");
  document.getElementById("replay").addEventListener("click", startGame);
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
