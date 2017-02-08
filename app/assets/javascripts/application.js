// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.cookie
//= require turbolinks
//= require_tree .

// navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(stream) {
//   console.log(stream.getVideoTracks()[0].getConstraints());
//   video = document.querySelector('video');
//   video.srcObject = stream;
//   video.onloadedmetadata = function(e) {
//     video.play();
//   };
// })
var session_id = window.location.pathname.split('/')[2];
var signalingChannel;
var pc;
var config = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
var remoteVideo;
var localVideo;
if($.cookie('current_user') != undefined) {
  signalingChannel = App.cable.subscriptions.create(
    {
      channel: "SignalChannel",
      participant: $.cookie('current_user')
    },
    {
      connected: function(data) {
        console.log('[LOG][#1]---connected');
        signalingChannel.send({joined: true, session: session_id})
      },
      received: function(data) {
        console.log('---received', data);

        if(data.joined) {
          console.log('[LOG][#2]---joined');
          start(true);
          return;
        }

        if(!pc) {
          console.log('[LOG][#8]---got message from caller');
          start(false);
        }

        if (data.sdp) {
          console.log('[LOG][#9]---got sdp');
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        } else {
          console.log('[LOG][#11]---add ice candidate');
          pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        }

      }
    }
  )
}

function start(isCaller) {
  console.log('[LOG][#3]---started isCaller=', isCaller);
  pc = new webkitRTCPeerConnection(config);

  pc.onicecandidate = function(event) {
    console.log('[LOG][#10]---ice Candidate event');
    signalingChannel.send({ candidate: event.candidate, participant: $.cookie('current_user'), session: session_id });
  }

  pc.onaddstream = function(event) {
    console.log('[LOG][#12]---remote stream added');
    remoteVideo.srcObject = event.stream;
    remoteVideo.onloadedmetadata = function(e) {
      console.log('[LOG][#13]---remote video started');
      remoteVideo.play();
    };
  }
  var audioConstraints = {
    mandatory: {
      googEchoCancellation: true,
      googAutoGainControl: false,
      googNoiseSuppression: false,
      googHighpassFilter: false
    }
  }

  navigator.mediaDevices.getUserMedia({ audio: audioConstraints, video: true }).then(function(stream) {

    console.log('[LOG][#4]---got stream');
    var localStream = stream;
    localVideo.srcObject = stream;
    pc.addStream(stream);
    localVideo.onloadedmetadata = function(e) {
      console.log('[LOG][#5]---local video is playing');
      localVideo.play();
    };

    if(isCaller) {
      console.log('[LOG][#6]---offer creation');
      pc.createOffer().then(description);
    } else {
      console.log('[LOG][#1]---answer creation');
      pc.createAnswer().then(description);
    }

    function description(desc) {
      console.log('[LOG][#7]---got description, setting local');
      pc.setLocalDescription(desc);
      signalingChannel.send({sdp: desc, participant: $.cookie('current_user'), session: session_id})
    }
  })
}

setTimeout(function() {
  remoteVideo = document.querySelector('video.remote-video');
  localVideo = document.querySelector('video.local-video');
  localVideo.muted = true;
  // $('button.start-broadcast').on('click', function() {
  //   console.log('clicked');
  //   start(true);
  // });

}, 1)
