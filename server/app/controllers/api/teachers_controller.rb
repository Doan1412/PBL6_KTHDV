class Api::TeachersController < Api::ApplicationController
  include Response
  before_action :set_teacher, only: :show

  def show
    teacher_service = TeacherService.new(@teacher, current_user)

    json_response(
      message: {
        profile: teacher_service.teacher_profile,
        follower_count: teacher_service.follower_count,
        is_following: teacher_service.user_following?
      },
      status: :ok
    )
  end

  private

  def set_teacher
    @teacher = Teacher.includes(courses: :category).find_by(id: params[:id])
    return if @teacher

    error_response({ message: "Teacher not found" }, :not_found)
  end
end
