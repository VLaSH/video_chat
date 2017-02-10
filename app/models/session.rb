class Session < ApplicationRecord
  belongs_to :initiator, class_name: 'User'
  has_many :session_users
  has_many :users, through: :session_users

  before_create :generate_uid

  def broadcast_to(id)
    ids = users.pluck(:id).sort
    ids.delete(id)
    ids || []
  end

  private
  def generate_uid
    self.uid = SecureRandom.hex(8)
  end
end
