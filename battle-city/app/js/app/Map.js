var Map = function(map) {
    
    var _tailWidth = Game.config.tailSize.width;
    var _tailHeight = Game.config.tailSize.height;
    
    var _tiles = new TextureExploder(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: _tailWidth * 32, y: _tailHeight * 8, width: _tailWidth * 6, height: _tailHeight * 4 }
            )
        ).explode(_tailWidth, _tailHeight);

    var _flag = new TextureExploder(
            new PIXI.Texture(
                Loader.resources.Atlas.texture,
                { x: _tailWidth * 36, y: 0, width: _tailWidth * 4, height: _tailHeight* 2 }
            )
        ).explode(_tailWidth, _tailHeight);

    _tiles.push(_flag[0], _flag[1]);

    return _.extend({
        replaceCell: function(cellX, cellY, cellVal) {
            var mapSize = Game.instance.getMapSize();
            
            // Check map bounds
            if (cellX < 0 || cellY < 0 || cellX >= mapSize.width || cellY >= mapSize.height) {
                return false;
            }
            var map = Game.instance.getMap();
            map[cellY][cellX] = cellVal;
            _.each(this.getCell(cellX, cellY), function(tail){
                tail.texture = this.getTail(cellVal).texture;
            }, this);
            
            return this;
        },
        getCell: function(cellX, cellY) {
            return _.filter(Game.instance.getChildrenByType(['tail']), function(tail) {
                return tail.cellX === cellX && tail.cellY === cellY;
            });
        },
        getTail: function(id) {
            var tailMap = [
                { x: 3, y: 1, zIndex: 0 }, // 0: Background
                { x: 0, y: 0, zIndex: 0 }, // 1: Brick
                { x: 1, y: 0, zIndex: 0 }, // 2: Brick
                { x: 2, y: 0, zIndex: 0 }, // 3: Brick
                { x: 3, y: 0, zIndex: 0 }, // 4: Brick
                { x: 4, y: 0, zIndex: 0 }, // 5: Brick
                { x: 0, y: 1, zIndex: 0 }, // 6: Сoncrete
                { x: 0, y: 2, zIndex: 0 }, // 7: Water
                { x: 1, y: 1, zIndex: 3 }, // 8: Tree
                { x: 2, y: 1, zIndex: 0 }, // 9: Swamp 
                
                { x: 0, y: 4, zIndex: 3 }, //10: Alive:left-top 
                { x: 1, y: 4, zIndex: 3 }, //11: Alive:right-top 
                { x: 0, y: 5, zIndex: 3 }, //12: Alive:left-bottom 
                { x: 1, y: 5, zIndex: 3 }, //13: Alive:right-bottom 
                
                { x: 2, y: 4, zIndex: 3 }, //14: Dead:left-top 
                { x: 3, y: 4, zIndex: 3 }, //15: Dead:right-top
                { x: 2, y: 4, zIndex: 3 }, //16: Dead:left-bottom
                { x: 3, y: 5, zIndex: 3 }  //17: Dead:right-bottom 
            ];
            var tail = new PIXI.Sprite(_tiles[tailMap[id].y][tailMap[id].x]);
            tail.zIndex = tailMap[id].zIndex;
            
            return tail;
        },
        init: function() {
            for (var i = 0; i < Game.instance.getMap(map).length; i++) {
                for (var j = 0; j < Game.instance.getMap(map)[i].length; j++) {
                    var tailId = Game.instance.getMap(map)[i][j];
                    var tileSprite = this.getTail(tailId);
                    tileSprite.position.x = j * _tailWidth;
                    tileSprite.position.y = i * _tailHeight;
                    tileSprite.render = function() {};
                    Game.instance.addModel(
                        _.extend(tileSprite, {
                            type: 'tail',
                            id: tailId,
                            cellX: j,
                            cellY: i
                        })
                    );
                }
            }
            return this;
        }
    }).init();
};