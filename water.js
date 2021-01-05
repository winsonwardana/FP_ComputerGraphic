var Water = pc.createScript('water');

Water.prototype.initialize = function () {
    this.speed = -0.05;
    this._offset = new pc.Vec2(1, 1);
    this.quad = this.entity.model.meshInstances[0];
    this.mat = this.quad.material;
    this.override = this.mat.getUniform("normalMapOffset", this._offset);
    this.quad.setParameter(this.override);

    this.mat.chunks.normalMapFloatPS = this.app.assets.find("WaterNormal").resource;
    this.mat.reflectivity = this.app.scene.skyboxIntensity;
    this.mat.update();

    this.constLayer2 = this.app.graphicsDevice.scope.resolve("layer2_offset");
    this.layer2 = new pc.Vec2(1,1);
    this.constLayer2.setValue(this.layer2.data);

    this.constLayer1 = this.app.graphicsDevice.scope.resolve("layer1_offset");
    this.layer1 = new pc.Vec2(1,1);
    this.constLayer1.setValue(this.layer1.data);    
};

// Called every frame, dt is time in seconds since last update
Water.prototype.update = function (dt) {
    this.override.value[3] += dt * this.speed;
    this.override.value[2] += dt * this.speed * -0.25;

    this.layer1.x += dt * this.speed;
    this.layer1.y += dt * this.speed * -0.25;
    this.constLayer1.setValue(this.layer1.data);

    this.layer2.x += dt * this.speed * 2;
    this.layer2.y += dt * this.speed * -0.25 * 2;
    this.constLayer2.setValue(this.layer2.data);
};
