class SignalChannel < ApplicationCable::Channel
  def subscribed
    stream_from "participant_2"
  end
end
