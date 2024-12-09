class Api::UsersController < Api::ApplicationController
  authorize_resource
  include Response
  before_action :authenticate

  def show
    user_profile = current_user.as_json(include: {account: {only: [:email]}})
    json_response(message: {profile: user_profile}, status: :ok)
  end

  def update
    if current_user.update user_params
      json_response(
        message: {
          user: current_user.as_json(include: {account: {only: [:email]}})
        },
        status: :ok
      )
    else
      error_response(message: "Update profile failed",
                     status: :unprocessable_entity)
    end
  end

  def enrolled_courses
    enrolled_courses = current_user.courses
                                   .preload(:teacher, :category)
                                   .as_json(include: %i(teacher category))
    json_response(message: {courses: enrolled_courses}, status: :ok)
  end

  private

  def user_params
    params.require(:user).permit(Account::VALID_ATTRIBUTES_USER_CHANGE)
  end
end
