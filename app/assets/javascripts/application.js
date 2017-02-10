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
//= require src/context_factory
//= require_tree .

var session_id = window.location.pathname.split('/')[2];
var Handler;

signalingChannel = App.cable.subscriptions.create(
    {
      channel: "SignalChannel",
      session: session_id,
      participant_id: $.cookie('current_user')
    },
    {
      connected: function(data) {
        console.log('[LOG][#1]---connected');
        signalingChannel.send({participant: 'new'});
      },
      received: function(data) {
        Handler = new ContextFactory().getHandler(Object.keys(data)[0]);
        Handler.handle(data);
      }
    }
)
setTimeout(function() {
  remoteVideo = document.querySelector('video.remote-video');
  localVideo = document.querySelector('video.local-video');
  localVideo.muted = true;
}, 1)
