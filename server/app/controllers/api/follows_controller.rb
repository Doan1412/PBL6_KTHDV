class Api::FollowsController < Api::ApplicationController
  before_action :set_teacher
  before_action :authenticate, only: %i(create destroy)

  def create
    follow = FollowService.create_follow(current_user, @teacher)

    if follow.save
      json_response(message: "You are now following this teacher.", status: :created)
    else
      error_response(message: "Failed to follow the teacher.", status: :unprocessable_entity)
    end
  end

  def destroy
    follow = FollowService.destroy_follow(current_user, @teacher)

    if follow&.destroy
      json_response(message: "You have unfollowed this teacher.", status: :ok)
    else
      error_response(message: "Failed to unfollow the teacher.", status: :not_found)
    end
  end

  private

  def set_teacher
    @teacher = Teacher.find_by(id: params[:teacher_id])
    return if @teacher

    error_response(message: "Teacher not found", status: :not_found)
  end
end
