// Create PlayerMovement script.
var PlayerMovement = pc.createScript('PlayerMovement');
var obstacle; // make a global variable name obstacle
// var gate;
var gate2; // make a global variable name gate2
var gate3;// make a global variable name gate3
var itemCollected;// make a globa variable name itemcollected
var chest;// make a global variable name ochest
var key0;// make a global variable name key0
var key1;// make a global variable name key1
var key2;// make a global variable name key2
var key3;// make a global variable name key3
var open;// make a global variable name open
var direction;// make a global variable name direction
var sfx;// make a global variable name sfx 
var artifact;// make a global variable name artifact
var uiFinish;// make a global variable name uiFinish
var finish;// make a global variable name finish
var ground;
var mainmenu;

PlayerMovement.states ={
    Silly: { // set variable Silly and store animation silly.glb
        animation: 'Silly.glb' 
    }
    
};
// Add attributes to the script.
PlayerMovement.attributes.add('movementSpeed', { // the  player movement speed
    type: 'number',
    default: 0.025
});

PlayerMovement.attributes.add('movementMultiplier', { // for the movement speed multiplier while running
    type: 'number',
    default: 5.0
});

PlayerMovement.attributes.add('jumpPower', { // for the jump power of the player
    type: 'number',
    default: 200.0
});

PlayerMovement.attributes.add('raycastPlayerBase',{ // for the default set of the player
    type: 'entity'
});

PlayerMovement.attributes.add('cameraEntity',{  // for the camera following the player
    type: 'entity'
});

// Initialisation code, runs only once.
PlayerMovement.prototype.initialize = function() {
    finish = false; // set the finish as false so the animation for finish is not called
    itemCollected = 0; // make the item collected become 0
    
    var states = PlayerAnimation.states;
    sfx = this.app.root.findByName('SFX');// caling the SFX and put in sfx variable
    ground = this.app.root.findByName('Ground');
    obstacle = this.app.root.findByTag('Item');// caling the Item and put in obstacle variable
    // gate = this.app.root.findByName('Gate');
    gate2 = this.app.root.findByName('Gate2');// caling the Gate2 and put in gate2 variable
    uiFinish = this.app.root.findByName('Finish');// caling the Finish and put in uiFinish variable
    gate3 = this.app.root.findByName('Gate3');// caling the Gate3 and put in gate3 variable
    chest = this.app.root.findByTag('Chest');// caling the Chest and put in chest variable
    key0 = this.app.root.findByName('0per3');// caling the 0per3 and put in key0 variable
    key1 = this.app.root.findByName('1per3');// caling the 1per3 and put in key1 variable
    key2 = this.app.root.findByName('2per3');// caling the 2per3 and put in key2 variable
    key3 = this.app.root.findByName('3per3');// caling the 3per3 and put in key3 variable
    open = this.app.root.findByName('2keytoopen');// caling the 2keytoopen and put in open variable
    artifact = this.app.root.findByTag('Artifact');// caling the Artifact and put in artifact variable
    mainmenu = this.app.root.findByName('MainMenu');
    key0.enabled = true; // set key0 as true to call 2d screen as 0/3 key
    key1.enabled = false;// set key1 as false so it will not call 2d screen as 1/3 key
    key2.enabled = false;// set key2 as false so it will not call 2d screen as 2/3 key
    key3.enabled = false;// set key3 as false so it will not call 2d screen as 3/3 key
    open.enabled =false; // set open to false so the gate that need 2 key wont open when it got 1 key
    uiFinish.enabled = false; // set the ui finish to false so it wont call the ui finish
    mainmenu.enabled = true;
    
    
    this.start_position = this.entity.getPosition().clone();
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this); // make the collision on to play music
    this.entity.collision.on('collisionstart', this.onCollisionStart, this); // make the collision on to collide with object
    this.entity.collision.on('collisionend', this.onCollisionEnd, this); // set the collision end to see whether it still collide or not

    //this.entity.collision.on('collisionend', this.onCollisionEnd, this);
    this.eulers = new pc.Vec3(); // set euler to 3d vector
    this.force = new pc.Vec3(); // set force to 3d vector
    this.jumping = { // set the jumping and running false at the first
        state: false
    };
    this.running = {
        state: false
    };
};

PlayerMovement.prototype.onCollisionStart =  function(result) {
    
    // console.log(result);
    if(result.other.tags.has('Ground')){
        
        var self  = this;
        setTimeout(function (){ 
        self.entity.rigidbody.teleport(self.start_position.x ,self.start_position.y ,self.start_position.z); // teleport the character back to start line

        }, 100);       
        }
    
    if(result.other.rigidbody && result.other.tags.has('Item')){ // if the player have contact with other rigid body such as floor and tag named Item it will destroy the object and itemCollected +1 and play the sfx
        var i;
        for (i = 0; i < obstacle.length; i++) {
          if(obstacle[i].name == result.other.name)
              {
                  obstacle[i].destroy();
                  
                  itemCollected +=1;
                  sfx.sound.play('kuncisfx');
                  
                 
                  
              }
            }
       
        }
     if(result.other.rigidbody && result.other.tags.has('Chest')){ // if the player have contact with other rigid body such as floor and tag named Chest it will destroy the object and itemCollected +1 and play the sfx
        var j;
        for (j = 0; j < chest.length; j++) {
          if(chest[j].name == result.other.name)
              {
                  chest[j].destroy();
                  
                  itemCollected +=1;
                  sfx.sound.play('chestsfx');

                  
              }
            }
       
        }
    if(result.other.rigidbody && result.other.tags.has('Artifact')){ // if the player have contact with other rigid body such as floor and wall and collide with tag named Artifact the finish become true and play artifact sound effect and destroy the artifact and enable the ui for the finish game
        finish = true;
        var k;
        for (k = 0; k < artifact.length; k++) {
          if(artifact[k].name == result.other.name)
              {
                  sfx.sound.play('artifactsfx');
                  artifact[k].destroy();
                  
                  uiFinish.enabled = true;
                  

                  
                  
              }
            }
        


       
        }
    if(result.other.rigidbody && result.other.tags.has('Gate2') ){ // if the player collide with other rgid body and collide with tag named Gate2 and itemCollected equals to 11 gate2 destroy and the itemCollected -1 and if itemCollected equals to 2 gate2 destroy and the itemCollected -1
        if(itemCollected ==1){
            gate2.destroy();
            itemCollected -= 1;
            
        }else if(itemCollected == 2){
            gate2.destroy();
            itemCollected -=1;
        }
        
       
        }
//     if(result.other.rigidbody && result.other.tags.has('Gate3') && itemCollected == 2){
//         gate3.destroy();
//         itemCollected -= 2;
       
//         }
    if(result.other.rigidbody && result.other.tags.has('Gate3') ){ // if the player collide with the rigidbody such as floor, wall and collide with tag named Gate3 and item collected not equal 2 it will show the ui need 2 key to open for 100 millisecond but if the itemCollected equals 2 it will open the gate3 and itemCollected -2
        if(itemCollected != 2){
             setTimeout(function (){ 
                open.enabled =true;
            }, 100);   
        }else if(itemCollected == 2){
            gate3.destroy();
            itemCollected -= 2;
            
            
        }
        
         
    }
    
        
};
    PlayerMovement.prototype.onCollisionEnd = function(result){ // if the player not colliding the gate it will make the ui "need 2 key to open" dissapear
        if(result.name ==='Gate3'){
            open.enabled =false;
            
        }
//         else if(result.name === 'Artifact'){


//         }
        
    };

//PlayerMovement.prototype.onCollisionEnd =  function(result) {
    //};

// Update code, runs every frame.
PlayerMovement.prototype.update = function(dt) {
    
    // Get application reference.
    if(itemCollected == 1){ // if the itemCollected equal 1 show ui key 1/3
        key0.enabled =false;
        key1.enabled =true;
        key2.enabled = false;
        
        
    }else if(itemCollected == 2){ // if the itemCollected equal 2 show ui key 1/3
        key1.enabled =false;
        key2.enabled =true;
     }else if(itemCollected == 3){ // if the itemCollected equal 3 show ui key 2/3
        key2.enabled =false;
        key3.enabled =true;
     }else if(itemCollected === 0){ // if the itemCollected equal 2 show ui key 0/3
         key0.enabled = true;
         key1.enabled = false;
         key2.enabled = false;
         key3.enabled = false;
     }
        
        
    
    var app = this.app; // put this.app function into variable app 
    
    // Get players force vector.
    var force = this.force; // put this.force function into variable force
    
    // Get camera direction vectors.
    var forward = this.cameraEntity.forward; // put this.cameraEntity.forward function into variable forward
    var right = this.cameraEntity.right; // put this.cameraEntity.right  into variable right
    
    // Movement logic. Listen for key presses and apply changes to directional vector components.
    var x = 0; //
    var z = 0;
    
    if (app.keyboard.isPressed(pc.KEY_W) && !finish ) {
        if(mainmenu.enabled === false){
        x += forward.x;
        z += forward.z;
        }
    }
    
    
    if (app.keyboard.isPressed(pc.KEY_A) && !finish) {
        if(mainmenu.enabled === false){
        x -= right.x;
        z -= right.z;
        }    
    }
    
    if (app.keyboard.isPressed(pc.KEY_S) && !finish) {
        if(mainmenu.enabled === false){
        x -= forward.x;
        z -= forward.z;
        }
    }

    if (app.keyboard.isPressed(pc.KEY_D) && !finish) {
        if(mainmenu.enabled === false){
        x += right.x;
        z += right.z;
        }
    }
    if (app.keyboard.isPressed(pc.KEY_ENTER)) {
        mainmenu.enabled = false;
    }
    
    if (app.keyboard.isPressed(pc.KEY_SHIFT)) {
        this.running.state = true;
    } else {
        this.running.state = false;
    }
    
    // Jump code, checking if the space key was pressed instead of is pressed. This is important as we don't want to call the jump code multiple times.
    // We set a jump state to ensure that we can't jump whilst already jumping.
    // The jump power is passed in from the script attributes. This should be a high number.
    if (app.keyboard.wasPressed(pc.KEY_SPACE) && !finish) {
        if (this.jumping.state === false) {
            this.entity.rigidbody.applyImpulse(0, this.jumpPower, 0);
            this.jumping.state = true;
        }
    } else if (this.jumping.state === true) {
        // If the raycast finds a collision, we assume it is an obect we can land on, we therefor reset our jump state so we can jump again.
        if (this._checkBelow() !== null) {
            this.jumping.state = false;
        }
    }
    
    // Convert x and z directional vector components to a force vector, normalise and then scale to the movement speed.
    if (x !== 0 || z !== 0) {
        this._rotatePlayer();
        
        x *= dt;
        z *= dt;
        
        if (this.running.state === true) {
            force.set(x, 0, z).normalize().scale(this.movementSpeed * this.movementMultiplier);
        } else {
            force.set(x, 0, z).normalize().scale(this.movementSpeed);
        }
        
        this.entity.translate(force);
        this.entity.rigidbody.applyForce(force);
        this.entity.rigidbody.syncEntityToBody();
    }
    
};

// Rotate the player to face the same direction as the camera angle.
PlayerMovement.prototype._rotatePlayer = function() {
    var targetY = this.cameraEntity.script.PlayerCameraMovement.eulers.x;
    var targetAngle = new pc.Vec3(0, targetY, 0);
    
    this.entity.setEulerAngles(targetAngle);
    this.entity.rigidbody.syncEntityToBody();
};

// Raycast for checking if there is an entity below with collision and rigid body components. Returns null if no collision.
// Make sure the scene has a entity to use as a raycast point at the base of your character.
PlayerMovement.prototype._checkBelow = function() {
    return this.app.systems.rigidbody.raycastFirst(this.entity.getPosition(), this.raycastPlayerBase.getPosition());
};