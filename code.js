const MIN_DELAY = 720;
const MAX_DELAY = 1500;
const BG_VELOCITY = 0.4 * 0.06 /* vw per ms */; 
const ROAD_VELOCITY = 1.7 * 0.06;

/* change obstacles animation */
let start;
let elapsed;
let previousTimeStamp;
let BackgroundStartTime;
let currBackgroundX;
let currRoadX = 0;
let stopAnimations = false;
let newObstacle;
let typesOfObstacles = ["tall-obstacle", "short-obstacle"];
let obstacleArray = [];
let obstacleX;
let done = false;
let obstacleTimeOut;

window.addEventListener("load", () => {
  startGame();
  initVariables();
  document.addEventListener("visibilitychange", event => {
    if (document.visibilityState !== "visible") {
      let stop = new Event("click");
      document.getElementById("pause").dispatchEvent(stop);
    }
  });
});

const initVariables = () => {
  currRoadX = 0;
  currBackgroundX = 0;
}

const handleAnimations = (timestamp) => {
  if (start === undefined) {
    start = timestamp;
  }
  elapsed = timestamp - start;
  animateBackground();
  (animateObstacles = () => {
    obstacleArray = document.querySelectorAll(".obstacle");
    obstacleArray.forEach((element) => {
      obstacleX = Number(element.style.right.slice(0, -2));
      obstacleX += ROAD_VELOCITY * (timestamp - previousTimeStamp);
      element.style.right = `${obstacleX}vw`;
    });
  })();
    previousTimeStamp = timestamp;
  if(!done) {
      window.requestAnimationFrame(handleAnimations);
    } else {
      clearTimeout(obstacleTimeOut);
    }
}

const startGame = () => {
  document.addEventListener("click", jump);
  window.requestAnimationFrame(handleAnimations);
  createObstacles();
  document.getElementById("pause").addEventListener("click", pause);
}

const continueGame = () => {
  done = false;
  document.getElementById("resume").removeEventListener("click", continueGame);
  document.getElementById("quit").removeEventListener("click", endGame);
  document.getElementById("pause-message").classList.add("none");
  document.addEventListener("click", jump);
  window.requestAnimationFrame(handleAnimations);
  createObstacles();
  document.getElementById("pause").addEventListener("click", pause);
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

const animateBackground = () => {
  currBackgroundX = - BG_VELOCITY * elapsed;
  document.getElementById("body").style.backgroundPositionX = `${currBackgroundX}vw`;
  currRoadX = -ROAD_VELOCITY * elapsed;
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


const pause = (event) => {
  console.log("pause");
    document.removeEventListener("click", jump);
    event.stopPropagation();
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
