require 'test_helper'

class Web::BoardsControllerTest < ActionController::TestCase
  setup do
    user = create(:user)
    sign_in user
  end

  test 'should redirect on get show' do
    sign_out
    get :show
    assert_response :redirect
  end

  test 'should get show' do
    get :show
    assert_response :success
  end
end
