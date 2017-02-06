class User < ApplicationRecord
  validates :uid, uniqueness: true, presence: true
  
  has_many :sessions
end
