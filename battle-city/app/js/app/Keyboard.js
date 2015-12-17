var Keyboard = function() {
    
    var _keyFlags = {
        up: false,
        right: false,
        down: false,
        left: false,
        a: false
    };
    
    window.addEventListener('keydown', function(event) {
        //console.log(event);
        switch (event.keyCode) {
            case 37: // Left
                _keyFlags.left = true;
            break;

            case 38: // Up
                _keyFlags.up = true;
            break;

            case 39: // Right
                _keyFlags.right = true;
            break;

            case 40: // Down
                _keyFlags.down = true;
            break;
            
            case 90: // Shot
                _keyFlags.z = true;
            break;

            case 100: // Left
                _keyFlags.num4 = true;
            break;

            case 104: // Up
                _keyFlags.num8 = true;
            break;

            case 102: // Right
                _keyFlags.num6 = true;
            break;

            case 101: // Down
                _keyFlags.num5 = true;
            break;
        }
    }, false);
    
    window.addEventListener('keyup', function(event) {
        switch (event.keyCode) {
            case 37: // Left
                _keyFlags.left = false;
            break;

            case 38: // Up
                _keyFlags.up = false;
            break;

            case 39: // Right
                _keyFlags.right = false;
            break;

            case 40: // Down
                _keyFlags.down = false;
            break;
            
            case 90: // Shot
                _keyFlags.z = false;
            break;

            case 100: // Left
                _keyFlags.num4 = false;
            break;

            case 104: // Up
                _keyFlags.num8 = false;
            break;

            case 102: // Right
                _keyFlags.num6 = false;
            break;

            case 101: // Down
                _keyFlags.num5 = false;
            break;
        }
    }, false);

    return {
        keys: _keyFlags
    }
};