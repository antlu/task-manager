# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def task_created
    user = User.first
    task = Task.first
    UserMailer.with({ user: user, task: task }).task_created
  end

  def task_edited
    user = User.first
    task = Task.first
    UserMailer.with({ user: user, task: task }).task_edited
  end

  def task_deleted
    user = User.first
    task = Task.first
    UserMailer.with({ user: user, task: task }).task_deleted
  end

  def password_reset
    user = User.first
    user.password_reset_token = 'test'

    UserMailer.password_reset(user)
  end
end
