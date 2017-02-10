//= require ./participant_handler

class ContextFactory {
  getHandler(context) {
    switch(context) {
      case 'participant':
        return new ParticipantHandler();
      default: return;
    }
  }
}
