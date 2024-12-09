class Api::UsersController < Api::ApplicationController
  authorize_resource
  include Response
  before_action :authenticate
  before_action :initialize_service

  def show
    user_profile = @user_service.fetch_profile
    json_response(message: { profile: user_profile }, status: :ok)
  end

  def update
    updated_profile = @user_service.update_profile(user_params)
    if updated_profile
      json_response(
        message: { user: updated_profile },
        status: :ok
      )
    else
      error_response(message: "Update profile failed",
                     status: :unprocessable_entity)
    end
  end

  def enrolled_courses
    enrolled_courses = @user_service.fetch_enrolled_courses
    json_response(message: { courses: enrolled_courses }, status: :ok)
  end

  private

  def user_params
    params.require(:user).permit(Account::VALID_ATTRIBUTES_USER_CHANGE)
  end

  def initialize_service
    @user_service = UserService.new(current_user)
  end
end
