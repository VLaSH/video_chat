class PingsController < ApplicationController
  def create
    @session = Session.find_by(uid: params[:session_uid])
    ActionCable.server.broadcast(
      "participant_2",
      data: 'alalal'
    )
  end
end
