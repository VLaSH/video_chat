class SessionsController < ApplicationController
  before_action :authenticate_user, only: :show

  def create
    if @session = Session.create(initiator_id: current_user.id)
      cookies[:initiator] = current_user.id
      cookies[:current_user] = current_user.id
      redirect_to session_path(session_uid: @session.uid)
    end
  end

  def show
    @session = Session.find_by(uid: params[:session_uid])
    @session.users << current_user
    cookies[:current_user] = current_user.id
    cookies[:users] = @session.broadcast_to(current_user.id)
  rescue ActiveRecord::RecordInvalid => e
    cookies[:current_user] = current_user.id
    cookies[:users] = @session.broadcast_to(current_user.id)
  end

  private
  def authenticate_user
    if current_user.nil?
      session[:destination] = session_path(session_uid: params[:session_uid])
      redirect_to new_user_path
    end
  end
end
