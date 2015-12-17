var TextureExploder = function(texture) {

    var r = [];

    return {
        getTexture: function() {
            return texture;
        },
        explode: function(cellWidth, cellHeight) {

            var cellsX = texture.width / cellWidth;
            var cellsY = texture.height / cellHeight;

            for (var i = 0; i < cellsY; i++) {
                r[i] = [];
                for (var j = 0; j < cellsX; j++) {
                    r[i][j] = new PIXI.Texture(
                                texture,
                                { x: j * cellWidth + texture.crop.x, y: i * cellHeight + texture.crop.y, width: cellWidth, height: cellHeight }
                            );
                }
            }

            return r;
        }
    };

};