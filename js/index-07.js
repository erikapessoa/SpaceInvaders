/*!
 * Space Invaders - Made with ♥ by ---
 *
 * Use arrow keys to move (← or →)
 * Use spacebar to shoot
 */
////////////////////////////////////////////////////

/** Variávels **/
var score = 0;

/** Constants **/
const canvas_width = 800;
const canvas_height = 450;
const canvas_st_width = 800;
const canvas_st_height = 30;
var fontType = "Comic Sans MS"
var fontSizeScore = 30;
var fontSizeTime = 20;
var fontScore = fontSizeScore + "px " + fontType;
var fontTime = fontSizeTime + "px " + fontType;
var fontColor = "#ecd23c"; //#ecd23c //#2cf7f7
var time = dTime = 0;
var duration = 60000;

/** Objects **/
var spaceship = new Spaceship();
var enemies = new Array();
var keys = new Keys();
var bullets = new Array();
var collision = new Collision();

/** Canvas Game**/
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = canvas_width;
canvas.height = canvas_height;

/** Canvas Score e Time **/
var canvasScoreTime = document.getElementById("gameScore");
var ctxST = canvasScoreTime.getContext("2d");
canvasScoreTime.width = canvas_st_width;
canvasScoreTime.height = canvas_st_height;


var drawCanvasGame = function() {
  
  // Draw the canvas
  ctx.fillStyle = '#000000';
  ctx.clearRect(0, 0, canvas_width, canvas_height); //se tirar funciona, porém o desenho mais lento
  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.fill();
}

function drawScoreTime(time, ctxST){
  
  ctxST.fillStyle = '#000000';
  ctxST.rect(0, 0, canvas_st_width, canvas_st_height);
  ctxST.fill();
  
  ctxST.font = "bold " + fontScore; //https://www.w3schools.com/tags/canvas_font.asp
  ctxST.fillStyle = fontColor;
  ctxST.fillText("Score: " + score, 40, 20);
  
  ctxST.font = fontTime;
  ctxST.fillStyle = fontColor;
  ctxST.fillText(formatTime(time),700,20); 
}

//TEMPO

function formatTime (time) {
  var tmp = Math.floor(time / 1000);
  var second = tmp % 60;
  if (second < 10) {second = '0' + second};
  tmp = Math.floor(tmp / 60);
  var minute = tmp % 60;
  if (minute < 10) {minute = '0' + minute};
  tmp = Math.floor(tmp / 60);
  var hour = tmp;
  if (hour < 10) {hour = '0' + hour}; 
  return hour + ':' + minute + ':' + second;
}

function clearCanvasST(context, canvasScoreTime) {
  context.clearRect(0, 0, canvasScoreTime.width, canvasScoreTime.height);
}

function animate() {
  var startTime = +new Date();
  var step = function () {
      time = +new Date() - startTime + dTime; 
      
      clearCanvasST(ctxST,canvasScoreTime);
      
      drawScoreTime(time, ctxST);
      requestAnimationFrame(step)
    }
    step();
};

function init() {
  drawScoreTime(0,ctxST)
  animate();
}


//Até aqui



/** Key events **/
document.onkeydown = function(e) {
  keys.keyDown(e);
}
document.onkeyup = function(e) {
  keys.keyUp(e);
}

// ---- Objects
  
/** Spaceship **/
function Spaceship() {

  // Object size
  this.width = 68;
  this.height = 50;

  // Verify move direction
  this.isLeft = false;
  this.isRight = false;

  //"Speed" that the spaceships moves
  const speed = 10;

  // Initial position
  this.x = (canvas_width / 2) - (this.width / 2);
  this.y = canvas_height - 60;

  // Show object on screen
  this.render = function() {
    this.image = new Image();
    this.image.src = 'images/spaceship.png';
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // Drive spaceship to left
  this.goLeft = function() {
    this.updatePosition(this.x - speed, this.y);
  }

  // Drive spaceship to right
  this.goRight = function() {
    this.updatePosition(this.x + speed, this.y);
  }
  
  // Update the object position
  this.updatePosition = function(posX, posY) {
    if ((posX > 0) && (posX < canvas_width - this.width)) {
      this.x = posX;
      this.y = posY;
    }
  }

}

/** Enemy **/
function Enemy() {

    // Object size
    this.width = 35;
    this.height = 25;
  
    // Random position
    this.x = (Math.floor(Math.random() * ((canvas_width - 40) - 40)) + 40);
    this.y = (Math.floor(Math.random() * ((canvas_height - 250) - 20)) + 20);
  
    // Show object on screen
    this.render = function() {
      this.image = new Image();
      this.image.src = 'images/enemy.png';
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
  }

/** Bullet **/
function Bullet(spaceship) {

  // Object size
  this.width = 5;
  this.height = 15;

  // Initial position on the spaceship
  this.x = spaceship.x + 32;
  this.y = spaceship.y - 15;  //https://www.w3schools.com/graphics/canvas_coordinates.asp

  const speed = 20;

  // Show object on screen
  this.render = function() {
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // Move bullet
  this.move = function() {
    this.y = this.y - speed;
    if (this.y <= 0) {
      return false;
    }
    return true;
  }
}

/** Keys **/
function Keys() {

    this.leftKey = 37;
    this.rightKey = 39;
    this.spaceKey = 32;
  
    // Check key pressed (onkeydown)
    this.keyDown = function(e) {
      //In Firefox, the keyCode property does not work on the onkeypress event (will only return 0). For a cross-browser solution, use the which property together with keyCode
      keyPressed = e.which ? e.which : window.event.keyCode;
  
      switch (keyPressed) {
        case this.leftKey:
          spaceship.isLeft = true;
          break;
        case this.rightKey:
          spaceship.isRight = true;
          break;
        case this.spaceKey:
        bullets[bullets.length] = new Bullet(spaceship);
          break;
      }
    }
  
    // Check key pressed (onkeyup)
    this.keyUp = function(e) {
      keyPressed = e.which ? e.which : window.event.keyCode;
  
      switch (keyPressed) {
        case this.leftKey:
          spaceship.isLeft = false;
          break;
        case this.rightKey:
          spaceship.isRight = false;
          break;
      }
    }
}

// ---- End Objects

/** First enemies **/
var firstEnemies = function() {
    // Five first enemies
    for (var i = 0; i < 5; i++) {
      enemies[enemies.length] = new Enemy();
    }
  }

 /** Collision **/
function Collision() {

  // Check if has a collision
  this.hasCollision = function(bullet, enemy) {
    if ((bullet.y) < enemy.y) {
      return false;
    } else if (bullet.y > (enemy.y + enemy.height)) {
      return false;
    } else if ((bullet.x + bullet.width) < enemy.x) {
      return false;
    } else if (bullet.x > (enemy.x + enemy.width)) {
      return false;
    }
    return true;
  }
} 

/** Check collisions **/
var checkColisions = function() {
  
  for (idBullet in bullets) {
    for (idEnemy in enemies) {
      if (collision.hasCollision(bullets[idBullet], enemies[idEnemy])) {

        score = score + 1;

        // Dead enemy
        bullets.splice(idBullet, 1);
        enemies.splice(idEnemy, 1);
 
        // Resurrect enemy
        enemies.push(new Enemy());
        break;
      }
    }
  }
}

/** Render **/
var render = function() {

  // Bullets
  for (index in bullets) {
    bullets[index].render();
    if (!bullets[index].move()) {
      bullets.splice(index, 1); //https://www.w3schools.com/jsref/jsref_splice.asp
    }
  }

    // Enemies
    for (index in enemies) {
      enemies[index].render();
    }

    // Spaceship moves
    if (spaceship.isLeft) 
        spaceship.goLeft();
    else if (spaceship.isRight)     
        spaceship.goRight();

}

/* O método window.requestAnimationFrame() fala para o navegador que deseja-se realizar 
    uma animação e pede que o navegador chame uma função específica para atualizar um 
    quadro de animação antes da próxima repaint (repintura). 
    O método tem como argumento uma callback que deve ser invocado antes da repaint. 
  Essa função funciona em diversos brownsers e caso o brownser não suporte HTML5
    ele usa o setTimeout 
*/
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 80);
    };
})();


/** Main **/
var main = function() {

  drawCanvasGame();
  spaceship.render();
  render();
  checkColisions();

  requestAnimationFrame(main);
}


// PLAY!
firstEnemies();
init();
main();