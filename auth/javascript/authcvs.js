var authcvs = {
    density: 1,
    acceptCounter: 0,
    processed: false,
    data: {
        fmUserId: 0,
        userId: 0,
        appKey: 'a2f10141-e14e-4d73-b911-06b434cfc45e',
        roomName: '0',
        message: 'hello ivan'
    },
    init: function (vid) {
        var self = this;
        self.cvs = document.getElementById('main-canvas');
        self.ctx = self.cvs.getContext('2d');
        self.video = vid;

        self.video.addEventListener("play", function play() {
            self.width = self.video.width / self.density;
            self.height = self.video.height / self.density;
            self.cvs.width = self.width;
            self.cvs.height = self.height;
            console.log('w:', self.video.width);
            self.initTracker();
            self.video.removeEventListener('play', play, false);
        }, false);
    },
    setFrame: function () {
        this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
        console.log('frame set');
    },
    sendData: function () {
        this.tracker.removeAllListeners();
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.setFrame();
        var self = this;
        var imgData = JSON.stringify({
            image: this.cvs.toDataURL()
        });
        $.ajax({
            url: '/v1/api/register/upload',
            //dataType: 'json',
            data: imgData,
            type: 'POST',
            success: function (data) {
                self.data = data;
                self.processed = true;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status + thrownError);
                self.tracker.on('track', function(event){self.track(event);});
                self.acceptCounter = 0;
            }
        });
    },
    initTracker: function () {
        console.log('tracker init');
        var self = this;
        self.tracker = new tracking.ObjectTracker('face');
        self.tracker.setInitialScale(4);
        self.tracker.setStepSize(2);
        self.tracker.setEdgesDensity(0.1);
        tracking.track('#my-video', self.tracker, {camera: true});

        self.tracker.on('track', function(event){self.track(event);});
    },
    track: function(event) {
        var self = this;
        self.ctx.clearRect(0, 0, self.cvs.width, self.cvs.height);

        //validate face
        var rate = 0.05;
        if (event.data.length == 0) {
            self.acceptCounter -= rate;
            if (self.acceptCounter < 0) self.acceptCounter = 0;
        } else {
            self.acceptCounter += rate;
            if (self.acceptCounter > 1) {
                self.acceptCounter = 1;
                self.sendData();
                return;
            }
        }

        // draw rect
        event.data.forEach(function (rect) {
            self.ctx.strokeStyle = '#ACECA1';
            self.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });
    },
    endFeed: function(){
        delete this.tracker;
        delete this.video;
        delete this.ctx;
        delete this.cvs;
        delete this;
    }
};