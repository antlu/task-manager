class UserMailer < ApplicationMailer
  def task_created
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: "New Task Created")
  end

  def task_edited
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: "Task Edited")
  end

  def task_deleted
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: "Task Deleted")
  end
end
