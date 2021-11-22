class Task < ApplicationRecord
  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  validates :name, :description, :author, presence: true
  validates :description, length: { maximum: 500 }

  state_machine initial: :new_task do
    event :develop do
      transition new_task: :in_development
    end

    event :archive_new do
      transition new_task: :archived
    end

    event :pass_to_qa do
      transition in_development: :in_qa
    end

    event :pass_qa do
      transition in_qa: :in_code_review
    end

    event :fail_qa do
      transition in_qa: :in_development
    end

    event :fail_review do
      transition in_code_review: :in_development
    end

    event :pass_review do
      transition in_code_review: :ready_for_release
    end

    event :release do
      transition ready_for_release: :released
    end

    event :archive_released do
      transition released: :archived
    end
  end
end
