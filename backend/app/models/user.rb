class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include ActiveModel::SecurePassword

  field :username, type: String
  field :name, type: String
  field :password_digest, type: String  

  has_secure_password
   
  has_many :todos, inverse_of: :user, dependent: :destroy

  validates :username, presence: true, uniqueness: true
  validates :name, presence: true
  validates :password_digest, presence: true

end
