var Animation = function(frames, duration, callback) {
    
    var curTime = 0;
    var duration = duration;
    var fullAnimationTime = duration * frames.length;
    var curFrameIndex = 0;
    
    var _finishFlag = false;
    var _pauseFlag = false;
    
    return {
        getFrame: function(timeDelta) {
            if (_pauseFlag) {
                timeDelta = 0;
            }
            curTime += timeDelta;
            var mod = curTime % fullAnimationTime;
            curFrameIndex = Math.floor(mod / duration);
            if (this.isFinished() && typeof callback === 'function') {
                callback.call();
            }
            return frames[curFrameIndex];
        },
        getCurFrameIndex: function() {
            return curFrameIndex;
        },
        getFullAnimationTime: function() {
            return fullAnimationTime;
        },
        isFinished: function() {
            var finished = this.isLastFrame();
            if (finished && !_finishFlag) {
                _finishFlag = true;
                return true;
            }
            else if (!this.isLastFrame()) {
                _finishFlag = false;
            }
            return false;
        },
        isLastFrame: function() {
            return curFrameIndex === frames.length - 1;
        },
        pause: function() {
            _pauseFlag = true;
        },
        play: function() {
            _pauseFlag = false;
        },
        reset: function() {
            curTime = 0;
        },
        setDuration: function(d) {
            duration = d;
            fullAnimationTime = duration * frames.length;
        }
    };
    
};