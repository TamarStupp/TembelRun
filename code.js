const MIN_DELAY = 720;
const MAX_DELAY = 1500;
const BG_VELOCITY = 0.4 * 0.06 /* vw per ms */; 
const INITIAL_ROAD_VELOCITY = 1.7 * 0.06;
const SCORE_TO_CHANGE_VELOCITY = 150;

// genertal  animation
let stopAnimations = false;
let deltaT;
let previousTimeStamp;
let done = false;

// background animation
let roadVelocity = 1.7 * 0.06;
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
let velocityMultiplier;
let wrapper;

// general
let pauseDelay;
let score = 0;
let scoreInterval;
let highScores = [0, 0, 0, 0, 0];

/* load function
------------------------------------------------------------------------------------------------------------------------------
description:  */
window.addEventListener("load", () => {
  document.getElementById("start").addEventListener("click", startGame);
  document.getElementById("start").addEventListener("click", fullScreen);
});


/* checkOrientation
------------------------------------------------------------------------------------------------------------------------------
description: happens before continueGame or when screen size change.
make sure the view is landscape and not portrait */
const checkOrientation = () => {
  document.getElementById("pause-message").classList.add("none");
  visualViewport.addEventListener("resize", checkOrientation);
  if (window.innerWidth < window.innerHeight) {
    document.getElementById("click-area").removeEventListener("click", jump);
    document.getElementById("tembel").removeEventListener("click", jump);
    document.getElementById("pause").removeEventListener("click", pause);
    done = true;
    document.getElementById("portrait-error").classList.remove("none");
  } else {
    continueGame();
    document.getElementById("portrait-error").classList.add("none");
  }
}

/* startGame
------------------------------------------------------------------------------------------------------------------------------
description:  */
const startGame = (event) => {
  roadVelocity = INITIAL_ROAD_VELOCITY;
  done = false;
  score = 0;
  currBackgroundX = 0;
  currRoadX = 0;
  // resets obstacles
  document.querySelectorAll(".obstacle").forEach((el => {
    el.remove();
  }));
  document.getElementById("end-message").classList.add("none");
  document.getElementById("tembel").classList.remove("none");
  document.getElementById("start-message").classList.add("none");
  document.getElementById("click-area").addEventListener("click", jump);
  checkOrientation();
    // pause the game when user changes tabs
    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState !== "visible") {
        let stop = new Event("click");
        document.getElementById("pause").dispatchEvent(stop);
      }
    });
}

/* fullScreen
------------------------------------------------------------------------------------------------------------------------------
description:  */
const fullScreen = () => {
  alert (document.documentElement.webkitSupportsFullscreen);
  if (!document.webkitFullscreenElement && !document.webkitCurrentFullScreenElement) {
    if (document.documentElement.webkitEnterFullscreen) {
      document.documentElement.webkitEnterFullscreen();
    } else {
      document.documentElement.webkitRequestFullscreen();
    }
    document.getElementById("full-screen-btn").classList.remove("none");
    document.getElementById("full-screen-btn").addEventListener("click", fullScreen);
    document.getElementById("full-screen-btn").src = "assets/media/compress.svg";
  } else if (document.webkitExitFullscreen) {
    document.getElementById("full-screen-btn").src = "assets/media/expand.svg";
    document.webkitExitFullscreen();
  }
}

/* jump
------------------------------------------------------------------------------------------------------------------------------
description:  */
const jump = (event) => {
  let animationTime = 0.7 * 1000;
  document.getElementById("click-area").removeEventListener("click", jump);
  document.getElementById("tembel").removeEventListener("click", jump);
  document.getElementById("tembel").classList.add("jump");
  setTimeout(() => {
    document.getElementById("click-area").addEventListener("click", jump);
    document.getElementById("tembel").addEventListener("click", jump);
    document.getElementById("tembel").classList.remove("jump");
  }, animationTime);
}

/* pause
------------------------------------------------------------------------------------------------------------------------------
description:  */
const pause = () => {
  console.log("pause")
  visualViewport.removeEventListener("resize", checkOrientation);
  document.getElementById("tembel").removeEventListener("click", jump);
  document.getElementById("click-area").removeEventListener("click", jump);
  document.getElementById("pause").removeEventListener("click", pause);
  done = true;
  document.getElementById("pause-message").classList.remove("none");
  document.getElementById("resume").addEventListener("click", checkOrientation);
  document.getElementById("quit").addEventListener("click", endGame);
}

/* continueGame
------------------------------------------------------------------------------------------------------------------------------
description:  */
const continueGame = () => {
    document.getElementById("click-area").addEventListener("click", jump);
    document.getElementById("tembel").addEventListener("click", jump);
    document.getElementById("timer").innerText = `3`;
    document.getElementById("timer").classList.remove("none");
    setTimeout(delayCounter, 1000, 2);
}

/* delayCounter
------------------------------------------------------------------------------------------------------------------------------
description:  */
const delayCounter = (secondsLeft) => {
  if (secondsLeft === 0) {
    document.getElementById("timer").classList.add("none");
    window.requestAnimationFrame(handleAnimations);
    obstacleTimeOut = setTimeout(createObstacles, Math.round(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY));
    done = false;
    document.getElementById("pause").addEventListener("click", pause);
    scoreInterval = setInterval(scoreUpdate, 100);
  } else {
    document.getElementById("timer").innerText = `${secondsLeft}`;
    secondsLeft--;
    setTimeout(delayCounter, 1000, secondsLeft);
  }
} 

/* scoreUpdate
------------------------------------------------------------------------------------------------------------------------------
description:  */
const scoreUpdate = () => {
  score++;
  document.getElementById("score").innerText = `ניקוד: ${score}`;
  velocityMultiplier = Math.floor(score/SCORE_TO_CHANGE_VELOCITY) * 0.125 + 1;
  roadVelocity = INITIAL_ROAD_VELOCITY * velocityMultiplier;
  console.log(roadVelocity, velocityMultiplier);
}

/* handleAnimations
------------------------------------------------------------------------------------------------------------------------------
description:  */
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
    clearInterval(scoreInterval);
  }
  previousTimeStamp = timestamp;
}

/* animateBackground, createObstacles, animateObstacles
------------------------------------------------------------------------------------------------------------------------------
description:  */
const animateBackground = () => {
  currBackgroundX -= BG_VELOCITY * deltaT;
  document.getElementById("body").style.backgroundPositionX = `${currBackgroundX}vw`;
  currRoadX -= roadVelocity * deltaT;
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
    obstacleArray.forEach((element) => {
      obstacleX = Number(element.style.right.slice(0, -2));
      obstacleX += roadVelocity * deltaT;
      if (obstacleX > 110) {
        element.remove();
      }
      element.style.right = `${obstacleX}vw`;
    });
};

/* checkCollision
------------------------------------------------------------------------------------------------------------------------------
description:  */
const checkCollision = () => {
  tembelClientRect = document.getElementById("tembel").getBoundingClientRect();
  document.querySelectorAll(".obstacle").forEach((elem, index) => {
    obstacleClientRect = elem.getBoundingClientRect();
    if (tembelClientRect.x < obstacleClientRect.x + obstacleClientRect.width &&
      tembelClientRect.x + tembelClientRect.width > obstacleClientRect.x &&
      tembelClientRect.y < obstacleClientRect.y + obstacleClientRect.height &&
      tembelClientRect.height + tembelClientRect.y > obstacleClientRect.y) {
        // Make sure the collision was longer than 10ms so the user could see it happening
        setTimeout (() => {
          if (tembelClientRect.x < obstacleClientRect.x + obstacleClientRect.width &&
            tembelClientRect.x + tembelClientRect.width > obstacleClientRect.x &&
            tembelClientRect.y < obstacleClientRect.y + obstacleClientRect.height &&
            tembelClientRect.height + tembelClientRect.y > obstacleClientRect.y) {
              endGame();
              return;
          }
      }, 13)
    }
  });
}

/* endGame
------------------------------------------------------------------------------------------------------------------------------
description:  */
const endGame = () => {
  visualViewport.removeEventListener("resize", checkOrientation);
  document.getElementById("pause").removeEventListener("click", pause);
  done = true;
  document.getElementById("score").innerText = "ניקוד";
  document.getElementById("end-score").innerHTML = score > highScores[0] ? `<span class="bold">שיא חדש!</span> צברתם ${score} נקודות` :`צברתם ${score} נקודות`;
  document.getElementById("end-message").classList.remove("none");
  document.getElementById("tembel").classList.add("none");
  document.getElementById("replay").addEventListener("click", startGame);
  document.getElementById("best-scores").addEventListener("click", showScores);
  // update high scores
  if (score > highScores[4]) {
    highScores[4] = score;
    highScores.sort((a, b) => {return(b-a)});
  }
  document.getElementById("score-list").innerHTML = "";
  highScores.forEach((item, index) => {
    wrapper = El("div", {cls: "score-wrap"} ,
    El("img", {attributes: {"src":"assets/media/goldenStar.svg", alt:"כוכב", class: "golden-star"}}), 
    El("div", {cls: "score-text"} ,`  ${item}`));
    document.getElementById("score-list").appendChild(wrapper);
  });
}


const showScores = () => {
  document.getElementById("show-scores").classList.remove("none");
  document.getElementById("end-message").classList.add("none");
  document.getElementById('X').addEventListener("click", () => {    
    document.getElementById("show-scores").classList.add("none");
    document.getElementById("end-message").classList.remove("none");
  })
}

/* El
------------------------------------------------------------------------------------------------------------------------------
description:  */
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
