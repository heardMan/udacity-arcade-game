/**  
 * @description Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function (global) {
    /** 
     * @description Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas element's height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.append(canvas);

    /** 
     * @description This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /**
         * @description Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        /**  
         * @description Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        if (player.win === true) {
            /* If the player win property is et to true present a 
            * message modal indicatingthat the player has won
            */
            const winMessage = `You Win`;
            modal.message(winMessage);

        }
        else if (player.win === false) {
            /**
            * @description If the player win property is et to true present a 
            * message modal indicatingthat the player has lost
            */
            const loseMessage = `You Lose`;
            modal.message(loseMessage);

        } else if (player.win === null) {
            update(dt);
            render();

            /** 
             * @description Set our lastTime variable which is used to determine the time delta
             * for the next time this function is called.
             */
            lastTime = now;

            /**
             * @description Use the browser's requestAnimationFrame function to call this
             * function again as soon as the browser is able to draw another frame.
             */
            win.requestAnimationFrame(main);
        }

    }

    /**
     * @description This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        
        reset();
        lastTime = Date.now();
        //uncomment for production
        //main();

    }

    /**
     * @description This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        allEnemies.forEach(enemy => checkCollisions(enemy));
    }

    /** 
     * @descriptiopn This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /**
     * @description this function handle all the main collision logic for the game
     * @param {object} enemy this is the enemy instance currently being checked for collision
     * with the player 
     */
    function checkCollisions(enemy) {
        /**
        * @description Here we check for collisions by first comparing the x values for 
        * each charcter on screen, next we compare the y positions to see if the images 
        * over lap. A In theory a more flexible arrangement would be to check the
        * y position first (allows for easier tracking of impending collisions), 
        * but requires more code due tothe random generation of enemy characters. 
         */
        if (player.x - 50 < enemy.x && player.x + 50 > enemy.x) {
            /**
            * @description This essentially compares the player and enmies x position
            * we subtract 50 px from the player x position to move the collision 
            * point from the center of the avatar to the edge; we also perform 
            * a similar adjustment on the enemy 
            */
            if (enemy.y === 62 && player.y === 45) checkLives(enemy);
            else if (enemy.y === 145 && player.y === 130) checkLives(enemy);
            else if (enemy.y === 227 && player.y === 215) checkLives(enemy);
            /**
            * @description Here we compare the y values and if they indicate a collision
            * we set the win property on the player class instance to false
            */
            
        }

    }

    /**
         * @description here we check the number of lives remaining so that we can determine
         * hoew the game should progress
         * @param {object} currentEnemy this is the cureently active enemy for whom a collision
         * has been confirmed
         */
    function checkLives(currentEnemy) {
        
        if(player.lives > 0){
            player.lives -= 1;
            player.reset();
            currentEnemy.reset();
        } else {
            player.win = false;
        }
    }

    /**  
     * @description This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /**
         * @description This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /**
         * @description Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /** 
                 * @description The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /** 
     * @description This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });
        if (player.sprite !== null || undefined) player.render();

        scoreboard.refresh();

    }

    /** 
     * @description This function handles all the game's reset logic
     * Currently it resets:
     * -Player Position
     * -Enemy Position
     * -Player instances win property
     * It also initiates the start menu
     *  It's only called once by the init() method.
     */
    function reset() {
        //set player win property to null to end reset initialization
        player.win = null;
        modal.startMenu();
        //reset the enemy position
        allEnemies.forEach(enemy => {
            enemy.reset();
        })
        //reset the player position
        player.reset();
        player.lives = 3;
    }

    /**
     * @description This is the modal object.
     * it contains all the properties and methods required for affecting 
     * the modal. The object includes a a default message modal as 
     * well as the start menu. 
     */

    const modal = {
        /**
         * @description this is just a refernce to the DOM element
         */
        element: doc.getElementById('modal'),
        /**
         * @description opens modal and removes player input handler
         */
        open: function () {
            this.element.style.display = 'block';
            this.element.style['z-index'] = 99;
            pauseInput();
        },
        /**
         * @description closes modal and adds player input handler
         * and initiates the main game function
         */
        close: function () {
            this.element.classList.forEach(className => this.element.classList.remove(className));
            this.element.style.display = 'none';
            receiveInput();
            main();
        },
        /**
         * @description this method creates a boilerplate affirmation button
         * @param {string} buttonText - text that the button will display
         * if blank default value is 'Close'
         * @returns a DOM element that is a button 
         */
        affirmButton: function (buttonText) {
            const button = doc.createElement('button');
            button.textContent = typeof buttonText === 'string' ? buttonText : 'Close';
            button.addEventListener('click', () => {
                this.close();
                this.element.classList.forEach(className => {
                    this.element.classList.remove(className);
                });
                reset();
            });
            return button;
        },
        /**
         * @description this function generates a boiler plate message modal
         * intended for communicating simple game status messages like 'You Win!'
         * @param {string} message this is the text the modal will display
         */
        message: function (message) {

            const content = doc.createElement('div');
            const messageElement = doc.createElement('h2');
            messageElement.textContent = message;
            content.appendChild(messageElement);
            this.element.innerHTML = null;
            this.element.classList.add('gameMessage');
            content.appendChild(this.affirmButton('OK'));
            this.element.appendChild(content);
            this.open();
        },
        /**
         * @description this is the start menu method that truns the modal into a start menu
         */
        startMenu: function () {
            scoreboard.hide();
            const characterArray = [
                'images/char-boy.png',
                'images/char-cat-girl.png',
                'images/char-horn-girl.png',
                'images/char-pink-girl.png',
                'images/char-princess-girl.png',
            ];
            //add css styling
            this.element.classList.add('startMenu');
            //clear content
            this.element.innerHTML = null;
            const content = doc.createElement('div');
            const title = doc.createElement('h1');
            const avatarContainer = doc.createElement('div');
            //set character selector image properties
            const selectorImage = doc.createElement('img');
            selectorImage.setAttribute('id', 'avatar-selector');
            selectorImage.setAttribute('src', 'images/Selector.png');
            selectorImage.style.left = '125px';
            //add charactersto the character array
            characterArray.forEach(character => {
                let avatarImage = doc.createElement('img');
                avatarImage.setAttribute('src', character);
                avatarImage.className = 'selectionAvatar';
                avatarContainer.append(avatarImage);
            });
            
            avatarContainer.append(selectorImage);
            title.textContent = 'Choose a Player'

            const playButton = doc.createElement('button');
            playButton.setAttribute('id', 'playButton');
            playButton.textContent = 'Play Game';
            playButton.addEventListener('click', selectCharacter);

            content.appendChild(title);
            content.appendChild(avatarContainer);
            content.appendChild(playButton);
            this.element.appendChild(content);
            doc.addEventListener('keyup', handleInput);
            this.open();
            //we declare this variable so that we can reference thi scope in the following function
            const self = this;
            /**
            * @description this function sets the players avatar to the one that 
            * is aligned with the selector image when the player actuates the 'Play Game' 
            * button.
            */
            function selectCharacter() {
                const avatarSector = doc.getElementById('avatar-selector');
                const selected = (avatarSector.style.left.split('px')[0] - 125) / 50;
                player.sprite = characterArray[selected];
                doc.removeEventListener('keyup', handleInput);
                scoreboard.show();
                self.close();
                
            }
            /**
             * @description Since our open modal method removes the games event listeners we must 
             * add on so that we can listen for player input related to player selection
             * @param {event} e this is the event we are passsing to the function
             */
            function handleInput(e) {

                const allowedKeys = {
                    37: 'left',
                    39: 'right'
                };
                
                const avatarSelector = doc.getElementById('avatar-selector');
                const avatarSelectX = Number(avatarSelector.style.left.split('px')[0]);
                const selectLength = (characterArray.length * 50) + 30;

                if (allowedKeys[e.keyCode] === 'right' && avatarSelectX < selectLength) 
                    //if right key pressed and last character is not selected move right 50px
                    avatarSelector.style.left = `${avatarSelectX + 50}px`;
                    //take the current position of the selector and move it by 50 px
                 else if (allowedKeys[e.keyCode] === 'left' && avatarSelectX > 125) 
                    //if left key pressed and last character is not selected move left 50px
                    avatarSelector.style.left = `${avatarSelectX - 50}px`;
                    //take the current position of the selector and move it by 50 px
            }

        }

    }

    const scoreboard = {
/**
     * @description this method refreshed the values on the scoreboard
     */
    refresh: function scoreboardRefresh() {
        const livesElement = doc.getElementById('lives');
        const timerElement = doc.getElementById('time');
        const pointsElement = doc.getElementById('points');
        livesElement.innerHTML = player.lives;
        //timerElement.innerHTML = timer.time;
        //pointsElement.innerHTML = player.points;
    },

    /**
     * @description this method makes the scoreboard visible
     */
    show: function showScoreboard () {
        const scoreboardContainer = doc.getElementById('scoreContainer');
        scoreboardContainer.classList.remove('hide');
    },

    /**
     * @description this method makes the scoreboard not visible
     */
    hide: function hideScoreboard () {
        const scoreboardContainer = doc.getElementById('scoreContainer');
        console.log(scoreboardContainer.style.display);
        scoreboardContainer.classList.add('hide');
        console.log(scoreboardContainer.style.display);
    }
    }
    
    
    

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png',
        'images/Heart.png',
        'images/Key.png',
        'images/Rock.png',
        'images/Selector.png',
        'images/Star.png'

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
