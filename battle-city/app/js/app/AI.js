var AI = function() {
    return {
        _AIPlayTimeDelta: 300,
        _AILastPlayTime: Game.instance.getTime(),
        
        _getRandomDirrection: function(exclude) {
            var direction = null;
            do {
                direction = [
                    Game.types.tankDirrections.top,
                    Game.types.tankDirrections.right,
                    Game.types.tankDirrections.bottom,
                    Game.types.tankDirrections.left
                ][Math.round(Math.random() * 3)];
            }
            while (Utils.inArray(direction, exclude));
            
            return direction;
        },
        _getProbability: function(probability) {
            return Math.random() < probability;
        },
        _getOppositeDirrection: function() {
            switch (this.getDirrection()) {
                case Game.types.tankDirrections.top:
                    return Game.types.tankDirrections.bottom;
                break;

                case Game.types.tankDirrections.right:
                    return Game.types.tankDirrections.left;
                break;

                case Game.types.tankDirrections.bottom:
                    return Game.types.tankDirrections.top;
                break;

                case Game.types.tankDirrections.left:
                    return Game.types.tankDirrections.right;
                break;
            }
        },
        _changeDirrection: function(){
            var excludeDirection = [
                    this.getDirrection(),
                    this._getOppositeDirrection()
                ],
                mapCoords = this.mapCoords(),
                mapSize = Game.instance.getMapSize();

            if (Math.ceil(mapCoords.x) <= 1) {
                excludeDirection.push(Game.types.tankDirrections.left);
            }
            if (Math.ceil(mapCoords.x) >= mapSize.width - 1) {
                excludeDirection.push(Game.types.tankDirrections.right);
            }
            if (Math.ceil(mapCoords.y) <= 1) {
                excludeDirection.push(Game.types.tankDirrections.top);
            }
            if (Math.ceil(mapCoords.y) >= mapSize.height - 1) {
                excludeDirection.push(Game.types.tankDirrections.bottom);
            }
            
            return this._getRandomDirrection(excludeDirection);
        },
        AIPlay: function() {
            if (Game.instance.getTime() - this._AILastPlayTime > this._AIPlayTimeDelta) {
                this._AILastPlayTime = Game.instance.getTime();
                
                
                
                if (this.getSpeedX() === 0 && this.getSpeedY() === 0) {
                    this.setDirrection(
                        this._changeDirrection()
                    );
                }
                
                // Tank will shot with some probability
                for (var i = 0; i < this.getHolderSize(); i++) {
                    if (this._getProbability(0.3)) {
                        this.shot();
                    }
                }
                this.moveForward();
            }
        }
    };
}