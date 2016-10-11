var skylink = new Skylink();

skylink.on('peerJoined', function(peerId, peerInfo, isSelf) {
    if(isSelf) return; // We already have a video element for our video and don't need to create a new one.
    var vid = document.createElement('video');
    vid.autoplay = true;
    vid.muted = true; // Added to avoid feedback when testing locally
    vid.id = peerId;
    vid.classList.add('user-stream');
    document.getElementById('users-container').appendChild(vid);
});

skylink.on('incomingStream', function(peerId, stream, isSelf) {
    if(isSelf) return;
    var vid = document.getElementById(peerId);
    attachMediaStream(vid, stream);
    camFilter.refreshUsersList();
});

skylink.on('peerLeft', function(peerId, peerInfo, isSelf) {
    var vid = document.getElementById(peerId);
    document.body.removeChild(vid);
    camFilter.refreshUsersList();
});

skylink.on('mediaAccessSuccess', function(stream) {
    var vid = document.getElementById('myvideo');
    attachMediaStream(vid, stream);
    camFilter.refreshUsersList();
    camFilter.init();
});

skylink.init({
    apiKey: 'a2f10141-e14e-4d73-b911-06b434cfc45e',
    defaultRoom: 'Pick a room name'
}, function() {
    skylink.joinRoom({
        audio: false,
        video: true
    });
});