class SignalChannel < ApplicationCable::Channel
  def subscribed
    stream_from "participant_#{params[:participant]}"
  end

  def receive(data)
    @session = Session.find_by(uid: data['session'])
    if @session.present?
      ActionCable.server.broadcast("participant_#{@session.broadcast_to(params['participant'].to_i)}", data)
    end
  end
end
