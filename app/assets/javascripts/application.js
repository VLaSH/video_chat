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
console.log(session_id);
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
        console.log('connected');
        signalingChannel.send({joined: true, session: session_id})
      },
      received: function(data) {
        console.log('received');
        console.log(data);
        console.log(pc);

        if(data.joined) {
          start(true);
          return;
        }

        if(!pc) {
          start(false);
        }

        if (data.sdp) {
          console.log('sdp', data);
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        } else {
          console.log('candidate', data);
          pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        }

      }
    }
  )
}

function start(isCaller) {
  console.log('started');
  pc = new webkitRTCPeerConnection(config);

  pc.onicecandidate = function(event) {
    console.log('ice candidate');
    signalingChannel.send({ candidate: event.candidate, participant: $.cookie('current_user'), session: session_id });
  }

  pc.onaddstream = function(event) {
    console.log('stream added');
    remoteVideo.srcObject = event.stream;
    remoteVideo.onloadedmetadata = function(e) {
      remoteVideo.play();
    };
  }

  navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(stream) {
    console.log(stream);
    localVideo.srcObject = stream;
    pc.addStream(stream);
    localVideo.onloadedmetadata = function(e) {
      localVideo.play();
    };

    if(isCaller) {
      console.log('caller', pc);
      pc.createOffer().then(description);
    } else {
      console.log('callee');
      pc.createAnswer().then(description);
    }

    function description(desc) {
      console.log('desc----', desc);
      pc.setLocalDescription(desc);
      console.log('sending', signalingChannel);
      signalingChannel.send({sdp: desc, participant: $.cookie('current_user'), session: session_id})
    }
  })
}

setTimeout(function() {
  remoteVideo = document.querySelector('video.remote-video');
  localVideo = document.querySelector('video.local-video');
  // $('button.start-broadcast').on('click', function() {
  //   console.log('clicked');
  //   start(true);
  // });

}, 1)
