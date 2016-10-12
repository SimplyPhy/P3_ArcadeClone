/* *************************************************************
********                                                ********
********           Classic Arcade Game Clone            ********
********                        By: Eric Phy            ********
********                                                ********
************************************************************* */


// Game state variables
var playing = true;
var victory = false;
var defeat = false;

// Enemy constructor
var Enemy = function(x, y, speed, startX) {

    this.x = x;
    this.y = y;
    this.startX = startX;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};


// Update the enemy's position
// Parameter: dt, a time delta between ticks

// Multiply any movement by the dt parameter for FPS independence
Enemy.prototype.update = function(dt) {
    if(playing === false){
        return;
    }
    this.x = this.x + this.speed * dt;

    if(this.x >= 1000){
        this.x = assignX();
        this.speed = findSpeed();
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Human character constructor
Player = function() {
    this.startX = 500;
    this.startY = 800;
    this.x = 500;
    this.y = 800;
    this.sprite = "images/char-boy.png";
    this.lives = 3;
    this.score = 0;
    this.countLives(3);
    this.countScore(0);
};

// Confine player movement to the canvas
Player.prototype.update = function() {
    if(playing === false){
        return;
    }

    if (this.x < 0) {
        this.x = 0;
    } else if (this.y > 800) {
        this.y = 800;
    } else if (this.y <= 0) {
        this.score++;
        this.countScore(this.score);
        if(this.score === 3){
            return;
        }

        this.y = 800;
    } else if (this.x < -500) {
        this.x = -500;
    } else if (this.x > 900) {
        this.x = 900;
    }
    // Check for collisions each tick
    this.collisionWatch();
};

// Render player each tick
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Collision detection
Player.prototype.collisionWatch = function() {
    for(var i = 0; i < allEnemies.length; i++) {
        if( (this.x - allEnemies[i].x < 30 && this.x - allEnemies[i].x > -30) && this.y === allEnemies[i].y) {
            this.lives--;
            this.countLives(this.lives);

            if(this.lives === 0) {
                return;
            }
            this.x = 500;
            this.y = 800;
        }
    }
};

// Tracks and prints player life points
Player.prototype.countLives = function(life) {
    this.lives = life;

    if (this.lives === 0) {
        defeat = true;
        playing = false;
        defeatTime();
    }

    console.log(this.lives);
    var lives = document.getElementById("lives");
    lives = lives.innerHTML = "Lives: " + this.lives;

};

// Tracks and prints player score
Player.prototype.countScore = function(score) {
    this.score = score;

    if (this.score === 3){
        victory = true;
        playing = false;
        victoryTime();
    }

    console.log(this.score);
    var newScore = document.getElementById("score");
    newScore = newScore.innerHTML = "Score: " + this.score;
};

// Player controls
Player.prototype.handleInput = function(key){
    if (playing === false){
        return;
    }
    switch (key) {
        case "left":
            this.x = this.x - 100;
            break;
        case "right":
            this.x = this.x + 100;
            break;
        case "up":
            this.y = this.y - 83;
            break;
        case "down":
            this.y = this.y + 83;
            break;
    }
};

// Instantiate player object
var player = new Player();

// Instantiate enemy array
var allEnemies = [];


// Find initial x value for enemies
var assignX = function(){
    var pickX = [];
    for(var a = 0; a < 9; a++){
        // Assign starting X position for enemies off the canvas
        pickX[a] = 100 + a * 75;
    }
    // Selects a random array index to return
    var pickRealX = pickX[Math.floor(Math.random() * pickX.length)];
    var pickRealNegX = pickRealX * -1;
    return pickRealNegX;
};

// Find initial speed value for enemies
var findSpeed = function(){
    var speed = 225 + Math.floor(Math.random() * 425);
    return speed;
};

// Create enemies
var createEnemies = function(){
    for(var a = 0; a < 7; a++){
        allEnemies.push(new Enemy(assignX(), 53, findSpeed(), assignX()));
    }
    for(var a1 = 0; a1 < 7; a1++){
        allEnemies.push(new Enemy(assignX(), 53 + 83, findSpeed(), assignX()));
    }
    for(var a2 = 0; a2 < 5; a2++){
        allEnemies.push(new Enemy(assignX(), 53 + 83*2, findSpeed(), assignX()));
    }
    for(var a3 = 0; a3 < 5; a3++){
        allEnemies.push(new Enemy(assignX(), 53 + 83*3, findSpeed(), assignX()));
    }
        // new set of four rows
    for(var b = 0; b < 4; b++){
        allEnemies.push(new Enemy(assignX(), 53 + 83*5, findSpeed(), assignX()));
    }
    for(var b1 = 0; b1 < 4; b1++){
        allEnemies.push(new Enemy(assignX(), 53 + 83*6, findSpeed(), assignX()));
    }
    for(var b2 = 0; b2 < 4; b2++){
        allEnemies.push(new Enemy(assignX(), 53 + 83*7, findSpeed(), assignX()));
    }
    for(var b3 = 0; b3 < 3; b3++){
        allEnemies.push(new Enemy(assignX(), 53 + 83*8, findSpeed(), assignX()));
    }
};
createEnemies();


// Win and lose functions
var victoryTime = function(){
    var win = document.getElementById("objective");
    win.innerHTML = "You are the champion!!! </br> Refresh the page to play again!";
};

var defeatTime = function(){
    var lose = document.getElementById("objective");
    lose.innerHTML = "You have been defeated!!! </br> Refresh the page to try again!";
};

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});