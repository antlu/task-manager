require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  test 'task created' do
    user = create(:user)
    task = create(:task, author: user)
    params = { user: user, task: task }
    email = UserMailer.with(params).task_created

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['from@example.com'], email.from
    assert_equal [user.email], email.to
    assert_equal "New Task Created", email.subject
    assert email.body.to_s.include?("Task #{task.id} was created")
  end

  test 'task edited' do
    user = create(:user)
    task = create(:task, author: user)
    params = { user: user, task: task }
    email = UserMailer.with(params).task_edited

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['from@example.com'], email.from
    assert_equal [user.email], email.to
    assert_equal "Task Edited", email.subject
    assert email.body.to_s.include?("Task #{task.id} was edited")
  end

  test 'task deleted' do
    user = create(:user)
    task = create(:task, author: user)
    params = { user: user, task: task }
    email = UserMailer.with(params).task_deleted

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['from@example.com'], email.from
    assert_equal [user.email], email.to
    assert_equal "Task Deleted", email.subject
    assert email.body.to_s.include?("Task #{task.id} was deleted")
  end
end
