class User < ApplicationRecord
  has_many :created_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id
  has_secure_password

  validates :first_name, :last_name, :password, presence: true
  validates :first_name, :last_name, length: { minimum: 2 }
  validates :email, format: { with: /\A.+?@.+?\z/ }
  validates :email, uniqueness: true
end
