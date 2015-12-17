var Shell = function() {
    
    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    var _explosion = new PIXI.Texture(
        Loader.resources.Atlas.texture,
        { x: _tailWidth * 33, y: _tailHeight * 12, width: _tailWidth  * 2, height: _tailHeight * 2 }
    );
    var _animations = {
        explosion: new Animation(
            [ 
                _explosion,
                _explosion
            ], 
            100, 
            function() {
                Shell.reset();
            }
        ),
        flying: new Animation(
            [ 
                new PIXI.Texture(
                    Loader.resources.Atlas.texture,
                    { x: 1283, y: 80, width: 32, height: 32 }
                )
            ], 
            999
        )
    };
    
    var Shell = _.extend(
        new PIXI.Sprite(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: 1288, y: 72, width: _tailWidth, height: _tailHeight }
            )
        ), 
        {
            _speed: 7,
            _speedX: 0,
            _speedY: 0,
            _dirrection: null,

            id: Game.instance.getTime() + Game.instance.getChildrenByType(['shell']).length,
            type: 'shell',
            zIndex: 3,
            pivot: new PIXI.Point(_tailWidth / 2, _tailHeight / 2),
            state: Game.types.shellStates.ready,
            visible: false,
            owner: null,
            collideWith: Game.instance.collidableTiles,
            
            getId: function() {
                return this.id;
            },
            addCollideableTail: function(tailType) {
                this.collideWith.push(tailType);
            },
            removeCollideableTail: function(tailType) {
                for (var i = 0; i < this.collideWith.length; i++) {
                    if (this.collideWith[i] === tailType) {
                        delete this.collideWith[i];
                        break;
                    }
                }
            },
            getDirrection: function() {
                return this._dirrection;
            },
            setDirrection: function(dirrection) {
                if (typeof Game.types.tankDirrections[dirrection] !== 'undefined') {
                    this._dirrection = dirrection;
                }
            },
            setPosition: function(x, y) {
                this.position.x = x;
                this.position.y = y;
            },
            setSpeed: function(speed) {
                this._speed = speed;
            },
            setOwner: function(owner) {
                this.owner = owner;
                return this;
            },
            getOwner: function() {
                return this.owner;
            },
            setState: function(state) {
                this.state = state;
            },
            die: function() {
                this._speedX = this._speedY = 0;
                this.setState(Game.types.shellStates.explosion);
                _animations.explosion.reset();
            },
            reset: function() {
                this.visible = false;
                this._speedX = this._speedY = 0;
                this.state = Game.types.shellStates.ready;
            },
            getState: function() {
                return this.state;
            },
            shot: function() {
                switch (this._dirrection) {
                    case Game.types.tankDirrections.top:
                        this._speedX = 0;
                        this._speedY = -this._speed;
                        this.rotation = 0;
                    break;

                    case Game.types.tankDirrections.right: 
                        this._speedX = this._speed;
                        this._speedY = 0;
                        this.rotation = 1.57;
                    break;

                    case Game.types.tankDirrections.bottom: 
                        this._speedX = 0;
                        this._speedY = this._speed;
                        this.rotation = 3.14;
                    break;

                    case Game.types.tankDirrections.left: 
                        this._speedX = -this._speed;
                        this._speedY = 0;
                        this.rotation = -1.57;
                    break;
                }
                this.visible = true;
                this.state = Game.types.shellStates.flying;
            },
            render: function() {
                this.position.x += this._speedX;
                this.position.y += this._speedY;
                
                if (this.state !== Game.types.shellStates.ready) {
                    this.texture = _animations[this.state].getFrame(Game.instance.getTimeDelta());
                }
                
                if (this.state === Game.types.shellStates.flying && this.collisionDetected()) {
                    this.die();
                }

                if (this.position.x > Game.instance.screenSize().width || 
                    this.position.x < 0 || this.position.y > Game.instance.screenSize().height || 
                    this.position.y < 0
                ) {
                    this.reset();
                }
            },
            getShape: function() {
                return [
                    {
                        x: this.position.x - 8,
                        y: this.position.y - 8
                    },
                    {
                        x: this.position.x + 8,
                        y: this.position.y + 8
                    }
                ];
            },
            mapCoords: function() {
                var mapX = Math.round(this.position.x / _tailWidth);
                var mapY = Math.round(this.position.y / _tailHeight);

                return { x: mapX, y: mapY };
            },
            collisionDetected: function() {
                var mapCoords = this.mapCoords();
                var mapCell = Game.instance.getMapCellAt(mapCoords.x, mapCoords.y);
                var mapCell_x = Game.instance.getMapCellAt(mapCoords.x - 1, mapCoords.y);
                var mapCell_y = Game.instance.getMapCellAt(mapCoords.x, mapCoords.y - 1);
                
                var colided = Utils.inArray(
                    mapCell,
                    this.collideWith
                );
        
                var colided_x = Utils.inArray(
                    mapCell_x,
                    this.collideWith
                );
        
                var colided_y = Utils.inArray(
                    mapCell_y,
                    this.collideWith
                );
        
                if (colided || colided_x || colided_y) {
                    var collisionPoints = [{
                        x: mapCoords.x,
                        y: mapCoords.y
                    }];
                    
                    switch (this._dirrection) {
                        case Game.types.tankDirrections.top: case Game.types.tankDirrections.bottom: 
                            collisionPoints.push({
                                x: mapCoords.x - 1,
                                y: mapCoords.y
                            });
                        break;
                        
                        case Game.types.tankDirrections.left: case Game.types.tankDirrections.right: 
                            collisionPoints.push({
                                x: mapCoords.x,
                                y: mapCoords.y - 1
                            });
                        break;
                    } 
                    
                    _.each(collisionPoints, function(point) {
                        if (this.getOwner().isCanDestroy(Game.instance.getMapCellAt(point.x, point.y))) {
                            window.map.replaceCell(point.x, point.y, Game.types.mapTails.empty);
                        }
                    }, this);
                }
                // Check for collisions with tanks
                else 
                {
                    var children = Game.instance.getChildrenByType([this.type, 'tank']);
                
                    for (var i = 0; i < children.length; i++) {
                        if ((children[i].getId() !== this.id || children[i].type !== this.type) &&
                            Utils.rectIntersect(
                                this.getShape()[0], 
                                this.getShape()[1],
                                children[i].getShape()[0],
                                children[i].getShape()[1]
                            )) 
                        {
                            // Shell collided with other shell
                            if (children[i].type === this.type && 
                                children[i].getState() === Game.types.shellStates.flying &&
                                children[i].getOwner() !== this.getOwner()) 
                            {
                                children[i].reset();
                                this.reset();
                            }
                            // Shell collided with tank
                            else if (children[i].type === 'tank' && 
                                this.getOwner().getId() !== children[i].getId() &&
                                (
                                    children[i].isBot() && this.getOwner().isHuman() || 
                                    children[i].isHuman() && this.getOwner().isBot()
                                ) 
                            )
                            {
                                this.reset();
                                children[i].shellHit(this);
                            }
                        } 
                    }
                }
                
                return ((colided || colided_x) && this._speedX === 0) || ((colided || colided_y) && this._speedY === 0);
            },
            initialize: function() {
                this.scale.x = 1;
                this.scale.y = 1;
                
                return this;
            }
        }
    ).initialize();
    
    return Shell;
};