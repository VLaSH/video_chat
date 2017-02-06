class Session < ApplicationRecord
  belongs_to :initiator, class_name: 'User'
  belongs_to :participant, class_name: 'User', optional: true

  before_create :generate_uid

  private
  def generate_uid
    self.uid = SecureRandom.hex(8)
  end
end
