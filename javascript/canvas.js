//document.addEventListener('DOMContentLoaded', function load(event) {
//    window.removeEventListener('load', load, false); //remove listener, no longer needed
//    camFilter.init();
//}, false);

var camFilter = {
    focusedUser: 0,
    density: 32,
    init: function () {
        this.cvs = document.getElementById('raw-canvas');
        this.ctx = this.cvs.getContext('2d');
        var self = this;
        this.video = this.users[this.focusedUser];
        this.video.addEventListener("play", function () {
            self.width = self.video.videoWidth / self.density;
            self.height = self.video.videoHeight / self.density;
            self.cvs.width = self.width;
            self.cvs.height = self.height;
             self.timerCallback();
        }, false);
    },
    timerCallback: function () {
        if (this.video.paused || this.video.ended) return;
        this.setFrame();
        var self = this;
        setTimeout(function () {
            self.timerCallback();
        }, 0);
    },
    refreshUsersList: function () {
        this.users = document.getElementsByClassName('user-stream');
        console.log('connected users: ', this.users.length);
    },
    rotateStream: function () {
        //TODO: change user to rotate based on skylink api not locally with video elements
        if (!this.users || this.users.length == 0) return;
        this.focusedUser = (this.focusedUser < this.users.length - 1) ? this.focusedUser + 1 : 0;
    },
    setFrame: function () {
        this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
    },
    getData: function () {
        if (this.ctx == undefined || this.width == undefined) return;
        var frame = this.ctx.getImageData(0, 0, this.width, this.height);
        var colors = [];
        var self = this;
        for (var y = 0; y < self.height; y++) {
            for (var x = 0; x < self.width; x++) {
                var offsetY = y * self.width * 4;
                var offsetX = x * 4;
                var rgbxy = [frame.data[offsetY + offsetX], frame.data[offsetY + offsetX + 1], frame.data[offsetY + offsetX + 2], self.width-x, y];
                colors.push(rgbxy);
            }
        }
        return colors;
    }
};