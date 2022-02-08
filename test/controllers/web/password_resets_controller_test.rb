require 'test_helper'

class Web::PasswordResetsControllerTest < ActionController::TestCase
  test 'should get new' do
    get :new
    assert_response :success
  end

  test 'should post create' do
    user = create(:user)
    assert_emails 1 do
      post :create, params: { user: { email: user.email } }
    end
    assert_redirected_to controller: 'password_resets', action: 'confirm'
  end

  test 'should get edit' do
    user = create(:user, password_reset_token: 'test', password_reset_sent_at: Time.zone.now)
    get :edit, params: { id: 'test' }
    assert_response :success
  end

  test 'should post update' do
    user = create(:user, password_reset_token: 'test')
    params = {
      id: 'test',
      user: {
        password: 'test',
        password_confirmation: 'test',
      },
    }
    post :update, params: params
    assert_response :redirect
  end
end
