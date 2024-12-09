class Api::FollowsController < Api::ApplicationController
  before_action :set_teacher
  before_action :authenticate, only: %i(create destroy)

  def create
    follow = current_user.follows.new(teacher: @teacher)

    if follow.save
      json_response(message: "You are now following this teacher.",
                    status: :created)
    else
      error_response(message: "Failed to follow the teacher.",
                     status: :unprocessable_entity)
    end
  end

  def destroy
    follow = current_user.follows.find_by teacher: @teacher

    if follow&.destroy
      json_response(message: "You have unfollowed this teacher.", status: :ok)
    else
      error_response(message: "Failed to unfollow the teacher.",
                     status: :not_found)
    end
  end

  private

  def set_teacher
    @teacher = Teacher.find_by id: params[:teacher_id]
  rescue ActiveRecord::RecordNotFound
    error_response(message: "Teacher not found", status: :not_found)
  end
end
