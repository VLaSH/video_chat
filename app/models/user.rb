class User < ApplicationRecord
  validates :uid, uniqueness: true, presence: true

  has_many :session_users
  has_many :sessions, through: :session_users
end
