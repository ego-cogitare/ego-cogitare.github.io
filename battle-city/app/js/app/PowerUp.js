var PowerUp = function(type) {
    
//    if (!Utils.inArray(type, Game.types.powerUps)) {
//        return false;
//    }
    
    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    
    var _sprite = new PIXI.Sprite();
    var _textureRegion = {};
    var _duration = 300;
    
    switch (type) {
        case Game.types.powerUps.protectiveField.id:
            var _duration = 50;
            _textureRegion = { x: _tailWidth * 32, y: 0, width: _tailWidth * 4, height: _tailHeight * 2 };
        break;
        
        default: 
            _textureRegion = { x: _tailWidth * 32, y: _tailHeight * 4, width: _tailWidth * 14, height: _tailHeight * 2 };
        break;
    }

    var _frames = new TextureExploder(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                _textureRegion
            )
        ).explode(_tailWidth * 2, _tailHeight * 2);

    var _blank = new PIXI.Texture(
            Loader.resources.Atlas.texture,
            { x: _tailWidth * 34, y: _tailHeight * 22, width: _tailWidth * 2, height: _tailHeight * 2 }
        );

    var _animations = [];
    
    _animations[Game.types.powerUps.helmet.id] = 
        new Animation([ 
            _frames[0][0],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.clock.id] = 
        new Animation([ 
            _frames[0][1],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.shovel.id] = 
        new Animation([ 
            _frames[0][2],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.star.id] = 
        new Animation([ 
            _frames[0][3],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.grenade.id] = 
        new Animation([ 
            _frames[0][4],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.tank.id] = 
        new Animation([ 
            _frames[0][5],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.gun.id] = 
        new Animation([ 
            _frames[0][6],
            _blank
        ], _duration);
        
    _animations[Game.types.powerUps.protectiveField.id] = 
        new Animation([ 
            _frames[0][0],
            _frames[0][1]
        ], _duration);
    
    return _.extend(_sprite, {
        zIndex: 2,
        id: type,
        type: 'powerUp',
        pivot: new PIXI.Point(_tailWidth, _tailHeight),
        attachedTo: null,
        shapeTrimValue: 10,
        
        getNameById: function(id) {
            var result = null;
            _.each(Game.types.powerUps, function(powerUp, powerUpName) {
                if (powerUp.id === id) {
                    result = powerUpName;
                    return;
                }
            });
            return result;
        },
        setPosition: function(x, y) {
            this.position.x = x;
            this.position.y = y;
            return this;
        },
        attachTo: function(model) {
            this.attachedTo = model;
            return this;
        },
        getOwnerModel: function() {
            return this.attachedTo;
        },
        die: function() {
            Game.instance.removeModel(this);
        },
        getId: function() {
            return this.id;
        },
        getType: function() {
            return this.type;
        },
        render: function() {
            if (this.attachedTo !== null) {
                _sprite.position = this.attachedTo.position;
            }
            _sprite.texture = _animations[type].getFrame(Game.instance.getTimeDelta());
        },
        getShape: function() {
            return [
                {
                    x: this.position.x - _tailWidth + this.shapeTrimValue,
                    y: this.position.y - _tailHeight + this.shapeTrimValue
                },
                {
                    x: this.position.x + _tailWidth - this.shapeTrimValue,
                    y: this.position.y + _tailHeight - this.shapeTrimValue
                }
            ];
        },
        initialize: function() {
            this.applyable = Game.types.powerUps[this.getNameById(type)].applyable;
            return this;
        }
    }).initialize();
};
