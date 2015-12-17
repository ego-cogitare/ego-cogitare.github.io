window.onload = function() {
    var BattleCity = (function(){
            
        var _tailWidth = Game.config.tailSize.width;
        var _tailHeight = Game.config.tailSize.height;
        var _prevUnixTime = new Date().getTime();
        var _curUnixTime = 0;
        var _timeDelta = 0;
        var _keyboard = new Keyboard();

        var GameLoop = {
            currentLevel: 0,
            collidableTiles: [
                Game.types.mapTails.concrete, 
                Game.types.mapTails.brick, 
                Game.types.mapTails.rightBrick, 
                Game.types.mapTails.bottomBrick,
                Game.types.mapTails.leftBrick,
                Game.types.mapTails.topBrick,
                Game.types.mapTails.flagAliveTopLeft,
                Game.types.mapTails.flagAliveTopRight,
                Game.types.mapTails.flagAliveBottomLeft,
                Game.types.mapTails.flagAliveBottomRight
            ],
            
            screenSizes: function() {
                return {
                    width: this.getMap()[0].length * Game.config.tailSize.width,
                    height: this.getMap().length * Game.config.tailSize.height
                };
            },
            initialize: function() {
                this.renderer = new PIXI.autoDetectRenderer(this.screenSizes().width, this.screenSizes().height);
                document.body.appendChild(this.renderer.view);
                this.stage = new PIXI.Container();
                requestAnimationFrame(GameLoop.animate);
                
                // Frame rate counter
                GameLoop.frameRate = 0;
                setInterval(function() { 
                    document.getElementById('frameRate').innerHTML = 'FPS: ' + GameLoop.frameRate;
                    GameLoop.frameRate = 0; 
                }, 1000);
            },
            animate: function() {
                GameLoop.frameRate++;
                requestAnimationFrame(GameLoop.animate);
                GameLoop.renderer.render(GameLoop.stage);
                _curUnixTime = new Date().getTime();
                _timeDelta = _curUnixTime - _prevUnixTime;
                _prevUnixTime = _curUnixTime;
                _.each(Game.instance.getChildrenByType(['tank','shell']), function(model) { 
                    try { model.render(); } catch (e) {}
                    try { model.AIPlay(); } catch (e) {}
                });
            },
            getTime: function() {
                return new Date().getTime();
            },
            addModel: function(model) {
                GameLoop.stage.addChild(model);
                this.zIndexReorder();
            },
            zIndexReorder: function() {
                GameLoop.stage.children.sort(function (a,b) {
                    if (a.zIndex < b.zIndex)
                        return -1;
                    if (a.zIndex > b.zIndex)
                        return 1;
                    return 0;
                });
            },
            removeModel: function(model) {
                GameLoop.stage.removeChild(model);
            },
            getModel: function(name) {
                return GameLoop.models[name];
            },
            getTimeDelta: function() {
                return _timeDelta;
            },
            getMapCellAt: function(x, y) {
                return (x < 0 || y < 0 || x >= this.getMap()[0].length || y >= this.getMap().length) ? 0 : this.getMap()[y][x];
            },
            getMap: function() {
                return Loader.resources['level' + this.currentLevel].data;
            },
            getMapSize: function() {
                return {
                    width: this.getMap()[0].length,
                    height: this.getMap().length
                };
            },
            getChildren: function() {
                return GameLoop.stage.children;
            },
            getChildrenByType: function(types) {
                return _.filter(GameLoop.stage.children, function(child) {
                    return _.contains(types, child.type);
                });
            },
            getRandomPowerUp: function() {
                return _.sample(_.where(Game.types.powerUps, { applyable: true })).id;
            },
            throwPowerUp: function(powerUpType) {
                var mapSize = GameLoop.getMapSize();
                if (typeof powerUpType === 'undefined') {
                    powerUpType = GameLoop.getRandomPowerUp();
                }
                var powerUp = new PowerUp(powerUpType).setPosition(
                    _.random(mapSize.width * _tailWidth),
                    _.random(mapSize.height * _tailHeight)
                );
                this.addModel(powerUp);
            },
            getTanksByModel: function(model) {
                return _.where(GameLoop.stage.children, { model: model });
            },
            getTankById: function(id) {
                return _.findWhere(GameLoop.stage.children, { id: id });
            },
            addBot: function(model) {
                var tank = new Tank(model);
                this.addModel(tank);
                return tank;
            }
        };

        GameLoop.initialize();

        return  {
            addModel: GameLoop.addModel,
            screenSize: GameLoop.screenSizes,
            currentLevel: GameLoop.currentLevel,
            collidableTiles: GameLoop.collidableTiles,
            getMap: GameLoop.getMap,
            getMapSize: GameLoop.getMapSize,
            getChildren: GameLoop.getChildren,
            getTanksByModel: GameLoop.getTanksByModel,
            getTankById: GameLoop.getTankById,
            getChildrenByType: GameLoop.getChildrenByType,
            getMapCellAt: GameLoop.getMapCellAt,
            getTime: GameLoop.getTime,
            getTimeDelta: GameLoop.getTimeDelta,
            input: _keyboard,
            removeModel: GameLoop.removeModel,
            zIndexReorder: GameLoop.zIndexReorder,
            throwPowerUp: GameLoop.throwPowerUp,
            addBot: GameLoop.addBot
        };
    });

    Loader = new PIXI.loaders.Loader();
    
    // Load game resources
    _.each(Game.config.assets, function(v, f) {
        if (typeof Game.config.assets[f] === 'object') {
            _.each(v, function(el, i) {
                Loader.add('level' + i, el);
            });
        } else {
            Loader.add(f, v);
        }
    });
    
    Loader.once('complete', 
        function() {
            /* Game instance create */
            Game.instance = new BattleCity();

            /* Add player to scene */
            Game.instance.addModel(new Tank(Game.types.tankModels.player1));
            Game.instance.addModel(new Tank(Game.types.tankModels.player2));

            /* Player 1 input handling */
            Game.instance.getTanksByModel(Game.types.tankModels.player1)[0].handleInput = function() {
                if (Game.instance.input.keys.left) {
                    this.moveLeft();
                }
                else if (Game.instance.input.keys.right) {
                    this.moveRight();
                }
                else if (Game.instance.input.keys.up) {
                    this.moveUp();
                }
                else if (Game.instance.input.keys.down) {
                    this.moveDown();
                }
                if (Game.instance.input.keys.z) {
                    this.shot();
                }
            };

            /* Player 2 input handling */
            Game.instance.getTanksByModel(Game.types.tankModels.player2)[0].handleInput = function() {
                if (Game.instance.input.keys.num4) {
                    this.moveLeft();
                }
                else if (Game.instance.input.keys.num6) {
                    this.moveRight();
                }
                else if (Game.instance.input.keys.num8) {
                    this.moveUp();
                }
                else if (Game.instance.input.keys.num5) {
                    this.moveDown();
                }
                if (Game.instance.input.keys.num9) {
                    this.shot();
                }
            };
            
            Game.instance.throwPowerUp();
            
            for (var i = 0; i < 1; i++) {
                for (var j = 0; j < 8; j++) {
                    Game.instance.addBot(j + 2).setXY(j * 64 + 32, i * 128 + 32);
                }
            }
            window.map = new Map(Game.instance.currentLevel);
        }
    );
    Loader.load();
};