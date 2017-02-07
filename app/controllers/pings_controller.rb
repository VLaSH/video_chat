class PingsController < ApplicationController
  def create
    @session = Session.find_by(uid: params[:session_uid])
    ActionCable.server.broadcast(
      "participant_#{@session.broadcast_to(current_user.id)}",
      data: 'alalal'
    )
  end
end
