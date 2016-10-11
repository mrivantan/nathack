//document.addEventListener('DOMContentLoaded', function load(event) {
//    window.removeEventListener('load', load, false); //remove listener, no longer needed
//    camFilter.init();
//}, false);

var camFilter = {
    focusedUser: 0,
    density: 32,
    init: function () {
        var self = this;
        self.cvs = document.getElementById('raw-canvas');
        self.ctx = self.cvs.getContext('2d');
        self.video = self.users[self.focusedUser];

        self.video.addEventListener("play", function () {
            self.width = self.video.videoWidth / self.density;
            self.height = self.video.videoHeight / self.density;
            self.cvs.width = self.width;
            self.cvs.height = self.height;
            self.timerCallback();
        }, false);
    },
    timerCallback: function () {
        if (this.video.paused || this.video.ended) return;
        var self = this;
        self.setFrame();
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
        var self = this;
        var frame = self.ctx.getImageData(0, 0, self.width, self.height);
        var colors = [];
        for (var y = 0; y < self.height; y++) {
            for (var x = 0; x < self.width; x++) {
                var offsetY = y * self.width * 4;
                var offsetX = x * 4;
                var rgbxy = [
                    frame.data[offsetY + offsetX],
                    frame.data[offsetY + offsetX + 1],
                    frame.data[offsetY + offsetX + 2], self.width-x, y];
                colors.push(rgbxy);
            }
        }
        return colors;
    },
    getSize: function (){
        return [this.width, this.height];
    }
};