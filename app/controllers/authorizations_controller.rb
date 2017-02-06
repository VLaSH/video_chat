class AuthorizationsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.find_by(uid: params[:uid])
    if @user.present?
      session[:user_id] = @user.id
      redirect_to sessions_path
    else
      redirect_to new_user_path
    end
  end
end
