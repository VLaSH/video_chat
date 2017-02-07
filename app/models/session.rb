class Session < ApplicationRecord
  belongs_to :initiator, class_name: 'User'
  belongs_to :participant, class_name: 'User', optional: true

  before_create :generate_uid

  def broadcast_to(id)
    initiator_id == id ? participant_id : initiator_id
  end

  private
  def generate_uid
    self.uid = SecureRandom.hex(8)
  end
end
