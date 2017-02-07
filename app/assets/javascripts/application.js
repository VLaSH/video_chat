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

// navigator.getUserMedia({ audio: true, video: { width: 640, height: 320, frameRate: { ideal: 30, max: 30 } } }, function(stream) {
//   $('.local-video').attr('src', URL.createObjectURL(stream));
// }, function(err) {
//   console.log(err);
// })

var signalingChannel;
var pc;
var config = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
if($.cookie('current_user') != undefined) {
  signalingChannel = App.cable.subscriptions.create(
    {
      channel: "SignalChannel",
      participant: $.cookie('current_user')
    },
    {
      received: function(data) {
        if(data.new_participant) {
          $.cookie('participant', true)
        }
        if($.cookie('initiator')) {
          start(true);
        } else {
          start(false);
        }
      }
    }
  )
}

function start(isCaller) {

}
