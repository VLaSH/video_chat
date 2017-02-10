class SignalChannel < ApplicationCable::Channel
  def subscribed
    stream_from "#{params[:session]}_participant_#{params[:participant_id]}"
  end

  def receive(data)
    clients = session&.broadcast_to(params[:participant_id].to_i)
    clients&.each do |c|
      ActionCable.server.broadcast("#{params[:session]}_participant_#{c}", data)
    end
  end

  def unsubscribed
    clients = session&.broadcast_to(params[:participant_id].to_i)
    clients&.each do |c|
      ActionCable.server.broadcast("#{params[:session]}_participant_#{c}", { participant: 'gone', participant_id: params[:participant_id] })
    end
  end

  private
  def session
    @session ||= Session.find_by(uid: params[:session])
  end
end
