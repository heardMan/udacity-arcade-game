'use strict';
// Enemies our player must avoid
class Enemy {
    constructor() {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        //starting speed for enemy
        this.speed = this.setSpeed();
        //starting x position for enemy
        this.x = -115;
        //starting  position for enemy
        this.y = this.setY();
    }


    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        if (this.x > 606) {
            //if the enemy is leaving the screen reset enemy height and speed
            this.y = this.setY();
            this.speed = this.setSpeed();
            this.x = -115;
        } else {
            // progress enemy in positive x direction using universal time factor
            this.x += this.speed * dt;

        }

        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
    };

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    //randomly assign the enemy a y position attribute a new value
    setY() {
        return [62, 145, 227][Math.floor(Math.random() * 3)];
    };
    //randomly assign the speed attribute a new value
    setSpeed() {
        return Math.floor(Math.random() * 250) + 120;
    };
    //reset enemy position
    reset() {
        this.x = -115;
        this.setY();
    };

    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.

}

class Player {
    constructor() {
        this.win = null;
        //starting x position for player
        this.x = 200;
        //starting y position for player
        this.y = 385;
        //image for player
        this.sprite = null;
        //number of lives a player gets
        this.lives = 3;
        //players score attribute
        this.points = 0;
        //collected items
        this.storage = [];
        //level attribute keeps track of a players progress
        this.level = 1;
        //here we borrow the render method from the Enemy class
        this.render = Enemy.prototype.render;
    }

    update(input) {
        //if left key is pushed within a valid x range move player left
        if (input === 'left' && this.x > 49) this.x -= 100
        //if right key is pushed within a valid x range move player right
        else if (input === 'right' && this.x <= 450) this.x += 100
        //if up key is pushed within a valid y player up
        else if (input === 'up' && this.y > 99) this.y -= 85
        //if player reaches water and proceeds to move up and they are on level 3 
        else if (input === 'up' && this.y <= 99 && this.level > 2) this.win = true; //run win sequence
        //if player reaches water and proceeds to move up and they are not on level 3 
        else if (input === 'up' && this.y <= 99) {
            //go to the next level
            this.level += 1;
            this.reset();
            allEnemies.forEach(enemy => enemy.reset());
        }
        //if down key is pushed within a valid x range move player down
        else if (input === 'down' && this.y <= 350) this.y += 85
        // if no condition is met
        else return 'No Valid Input Received';

    }

    handleInput(input) {

        if (
            input === 'up' ||
            input === 'down' ||
            input === 'left' ||
            input === 'right'
        ) {
            this.update(`${input}`);
        }

    }

    reset() {
        this.x = 200;
        this.y = 385;
    }

}

class Reward {
    constructor (points, sprite, lives) {
    //points awrded by collecting this reward
    this.points = points;
    // lives awarded by collecting this item
    this.lives = lives;
    // the image associted with the reward
    this.sprite = sprite;
    // reward x position
    this.x = this.setX();
    // reward y position
    this.y = this.setY;
    // collection status
    this.collected = false;

    this.render = Enemy.prototype.render;

    this.setY = Enemy.prototype.setY;
    }

    setX() {
        return [0, 100, 200, 300, 400, 500][Math.floor(Math.random() * 6)];
    }
    
    reset() {
        this.collected = false;
        this.x = this.setX();
        this.y = this.setY();
    }
   
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const enemy1 = new Enemy();
const enemy2 = new Enemy();
const enemy3 = new Enemy();
const allEnemies = [enemy1, enemy2, enemy3];
const player = new Player();
const reward1 = new Reward(200, 'images/gem-blue.png', 0);
const reward2 = new Reward(200, 'images/gem-orange.png', 0);
const reward3 = new Reward(500, 'images/Star.png', 0);
const reward4 = new Reward(200, 'images/gem-green.png', 0);
const reward5 = new Reward(0, 'images/Heart.png', 1);
const reward6 = new Reward(1500, 'images/Key.png', 0);
const rewards = [[reward1], [reward2, reward3], [reward4, reward5, reward6]]

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

function receiveInput() {
    document.addEventListener('keyup', listen);
    document.addEventListener('click', listen);
}
function pauseInput() {
    document.removeEventListener('keyup', listen);
    document.addEventListener('click', listen);
}

function listen(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    const mobileButtons = {
        upIcon: 'up',
        up: 'up',
        downIcon: 'down',
        down: 'down',
        rightIcon: 'right',
        right: 'right',
        leftIcon: 'left',
        left: 'left',

    };

    if (e.type === 'keyup') player.handleInput(allowedKeys[e.keyCode]);
    else if (e.type === 'click') player.handleInput(mobileButtons[e.target.id]);

}
