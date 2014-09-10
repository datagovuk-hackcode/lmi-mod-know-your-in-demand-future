require 'test_helper'

class LinkedinsControllerTest < ActionController::TestCase
  setup do
    @linkedin = linkedins(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:linkedins)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create linkedin" do
    assert_difference('Linkedin.count') do
      post :create, linkedin: {  }
    end

    assert_redirected_to linkedin_path(assigns(:linkedin))
  end

  test "should show linkedin" do
    get :show, id: @linkedin
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @linkedin
    assert_response :success
  end

  test "should update linkedin" do
    put :update, id: @linkedin, linkedin: {  }
    assert_redirected_to linkedin_path(assigns(:linkedin))
  end

  test "should destroy linkedin" do
    assert_difference('Linkedin.count', -1) do
      delete :destroy, id: @linkedin
    end

    assert_redirected_to linkedins_path
  end
end
