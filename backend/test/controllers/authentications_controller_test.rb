require "test_helper"

class Api::V1::AuthenticationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      username: "testuser",
      name: "Test User",
      password: "password123",
      password_confirmation: "password123"
    )
  end

  test "should login with valid credentials" do
    post api_v1_login_url, params: {
      auth: {
        username: "testuser",
        password: "password123"
      }
    }, as: :json

    assert_response :success
    json_response = JSON.parse(response.body)
    assert json_response["token"].present?
    assert_equal "testuser", json_response["user"]["username"]
  end

  test "should not login with invalid credentials" do
    post api_v1_login_url, params: {
      auth: {
        username: "testuser",
        password: "wrongpassword"
      }
    }, as: :json

    assert_response :unauthorized
    json_response = JSON.parse(response.body)
    assert_equal "Invalid credentials", json_response["error"]
  end
end 