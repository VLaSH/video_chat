class SessionUser < ApplicationRecord
  validates :user, uniqueness: { scope_to: :session }

  belongs_to :session
  belongs_to :user
end
