class ParticipantHandler {
  handle(data) {
    console.log(data);
    switch(data.participant) {
      case 'new':
        this.addVideo();
        break;
      case 'gone':
        this.removeVideo();
      default: return;
      return;
    }
  }

  addVideo() {
    if($('video').length > 0)
      $($('video')[$('video').length - 1]).after("<video class='remote-video'></video>");
    else
      $('p').after("<video class='remote-video'></video>");

  }

  removeVideo() {
    $($('video.remote-video')[0]).remove();
  }
}
