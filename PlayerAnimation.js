// Create PlayerAnimation Script.
var PlayerAnimation = pc.createScript('PlayerAnimation');
var player; // set variable player to global
var finish; // set variable finish to global
var finished; // set variable finished to global

PlayerAnimation.states = {
    Idle: { 
        animation: 'Idle.glb' // put the idle animation in Idle variable 
    },
     JogForwardLeft: { 
        animation: 'Jog Forward Left.glb' // put the jog forward animation in jog forward variable 
    },
     JogForwardRight: { 
        animation: 'Jog Forward Right.glb' // put the jog forward right animation in jogforwardright variable 
    },
     JogForward: { 
        animation: 'Jog Forward.glb' // put the jog forward animation in jogForward variable 
    },
     JogBackwardLeft: { 
        animation: 'Jog Backward Left.glb' // put the jog backward left animation in jog backwardleft variable 
    },
     JogBackwardRight: { 
        animation: 'Jog Backward Right.glb' // put the jog backward right animation in jogBackwardRight variable 
    },
     JogBackward: { 
        animation: 'Jog Backward.glb' // put the Jog Backward animation in JogBackward variable 
    },
     JogLeft: { 
        animation: 'Jog Left.glb' // put the jog left animation in JogLeft variable 
    },
    JogRight: { 
        animation: 'Jog Right.glb' // put the jog right animation in JogRight variable 
    },
    Silly: { 
        animation: 'Silly.glb' // put the silly animation in Silly variable 
    },
    
};
// Define script-scoped variables.
var direction = 'Idle'; 

// Add attributes to the script.
PlayerAnimation.attributes.add('blendDuration', {
    type: 'number',
    default: 0.25
}); 

// Initialisation code, runs only once.
PlayerAnimation.prototype.initialize = function() {
    // calling the Player js to use some function from it
    player = this.app.root.findByName("Player");
    finished = 0;
    finish = player.script.PlayerMovement.finish;
    

    var app = this.app;

    // Listeners for key up/down events. Fires a callback function to handle player animations.
    var states = PlayerAnimation.states;

    // for the keyboard input
    app.keyboard.on(pc.EVENT_KEYDOWN, this._keyChange, this);
    app.keyboard.on(pc.EVENT_KEYUP, this._keyChange, this);
    
    
};

// Update code, runs every frame.
PlayerAnimation.prototype.update = function(dt) {
    // Any code that needs to run such as timers for idle time or what not goes in here.
   if(finish && finished === 0){
       this.setState('Silly');
       finished = 1;
   }
};

// Setter function for player state. Function also serves to change animation on state change. Animation blend duration is set from an attribute.
PlayerAnimation.prototype.setState = function(state) {
    var states = PlayerAnimation.states;

    this.state = state;
    this.entity.animation.play(states[state].animation, this.blendTime);
};

// Direction logic, different combination of key inputs define different directions.
PlayerAnimation.prototype._checkKey = function() {
    var app = this.app;
    // if the keyobard is press and its not finish the player will play the animation function
    if (app.keyboard.isPressed(pc.KEY_W) && app.keyboard.isPressed(pc.KEY_S) === false && !finish) {
        if (app.keyboard.isPressed(pc.KEY_A) && app.keyboard.isPressed(pc.KEY_D) === false && !finish) {
            direction = ('JogForwardLeft');
        } else if (app.keyboard.isPressed(pc.KEY_D) && app.keyboard.isPressed(pc.KEY_A) === false && !finish) {
            direction = ('JogForwardRight');
        } else {
            direction = ('JogForward');
        }
    } else if (app.keyboard.isPressed(pc.KEY_S) && app.keyboard.isPressed(pc.KEY_W) === false && !finish) {
        if (app.keyboard.isPressed(pc.KEY_A) && app.keyboard.isPressed(pc.KEY_D) === false && !finish) {
            direction = ('JogBackwardLeft');
        } else if (app.keyboard.isPressed(pc.KEY_D) && app.keyboard.isPressed(pc.KEY_A) === false && !finish) {
            direction = ('JogBackwardRight');
        } else {
            direction = ('JogBackward');
        }
    } else if (app.keyboard.isPressed(pc.KEY_A) && app.keyboard.isPressed(pc.KEY_D) === false && !finish) {
        direction = ('JogLeft');
    } else if (app.keyboard.isPressed(pc.KEY_D) && app.keyboard.isPressed(pc.KEY_A) === false && !finish) {
        direction = ('JogRight');
    } else if( !finish) {
        direction = ('Idle');
    }
};

// Callback function to check if the direction has changed since a key down/up event.
PlayerAnimation.prototype._keyChange = function(e) {
    var previousDirection = direction;
    
    this._checkKey();
    
    if (previousDirection !== direction) {
        this.setState(direction);
    }
};