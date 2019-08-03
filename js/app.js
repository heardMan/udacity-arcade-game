
// Enemies our player must avoid
const Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //starting speed for enemy
    this.speed = this.setSpeed();
    //starting x position for enemy
    this.x =  -115;
    //starting  position for enemy
    this.y = this.setY();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x > 505) {
        //if the enemy is leaving the screen reset enemy height and speed
        this.y = this.setY();
        this.speed = this.setSpeed();
        this.x = -115;
    } else {
        // progress enemy in positive x direction using universal time factor
        this.x  += this.speed * dt;
        
    }

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.setY = function() {
   return [62, 145, 227][Math.floor(Math.random() * 3)];
};

Enemy.prototype.setSpeed = function() {
    return Math.floor(Math.random() * 250) + 120;
 };

 Enemy.prototype.reset = function() {
    this.x = -115;
    this.setY();
 };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

const Player = function() {
    this.win = null;
    //starting x position for player
    this.x = 200;
    //starting y position for player
    this.y = 385;
    //image for player
    this.sprite = null;
    //number of lives a player gets
    this.lives = 3;
};

Player.prototype.update = function(input) {
     //if left key is pushed within a valid x range move player left
     if(input === 'left' && this.x > 49) this.x -= 100
     //if right key is pushed within a valid x range move player right
     else if(input === 'right' && this.x <= 350) this.x += 100
     //if up key is pushed within a valid x range move player up
     else if (input === 'up' && this.y > 99) this.y -= 85
     //if up key is pushed outside a valid x range reset player position to lowest position
     else if (input === 'up' && this.y <= 99) player.win = true; //run win sequence
     //if down key is pushed within a valid x range move player down
     else if(input === 'down' && this.y <= 350) this.y += 85
      
     else  return 'No Valid Input Received';
    
};

Player.prototype.render = Enemy.prototype.render;

Player.prototype.handleInput = function(input) {
    //console.log(input);
    
    if (enemy1.x === player.x) console.log('collision enemy1');
    if (enemy2.x === player.x && enemy2.y === player.y) console.log('collision enemy2');
    if (
        input === 'up' ||
        input === 'down' ||
        input === 'left' || 
        input === 'right'
    )
    {
        this.update(`${input}`);
    }
    else console.log('please enter a valid command');

    
   
};

Player.prototype.reset = function() {
    player.x = 200;
    player.y = 385;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const enemy1 = new Enemy();
const enemy2 = new Enemy();
const enemy3 = new Enemy();
const allEnemies = [enemy1, enemy2, enemy3];
const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

function receiveInput(){
    document.addEventListener('keyup', listen);
}
function pauseInput(){
    document.removeEventListener('keyup', listen);
}


function listen(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //console.log(allowedKeys[e.keyCode]);
    
    player.handleInput(allowedKeys[e.keyCode]);
}


