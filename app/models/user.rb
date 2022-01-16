class User < ApplicationRecord
  has_many :created_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id
  has_secure_password

  validates :first_name, :last_name, presence: true
  validates :first_name, :last_name, length: { minimum: 2 }
  validates :email, format: { with: /\A.+?@.+?\z/ }
  validates :email, uniqueness: true

  def generate_password_reset_token
    begin
      self.password_reset_token = SecureRandom.urlsafe_base64
    end while User.exists?(password_reset_token: self.password_reset_token)
  end

  def clear_password_reset_token!
    self.password_reset_token = nil
    save!
  end
end
