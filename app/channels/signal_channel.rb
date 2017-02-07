class SignalChannel < ApplicationCable::Channel
  def subscribed
    stream_from "participant_#{params[:participant]}"
  end

  def receive(data)
    ActionCable.server.broadcast("participant_#{params[:participant]}", data)
  end
end
