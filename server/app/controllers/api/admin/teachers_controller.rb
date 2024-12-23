class Api::Admin::TeachersController < Api::Admin::ApplicationController
  before_action :set_teacher, only: %i(destroy)

  def index
    teachers = TeacherService.fetch_teachers(params)

    @pagy, @teachers = pagy(teachers)

    json_response(
      message: {
        teachers: formatted_teachers,
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end

  def destroy
    unless @teacher.destroy
      return error_response(
        message: "Failed to delete teacher",
        status: :unprocessable_entity
      )
    end

    json_response(
      message: "Teacher deleted successfully",
      status: :ok
    )
  end

  private

  def set_teacher
    @teacher = Teacher.find_by(id: params[:id])
    return if @teacher

    error_response(
      message: "Teacher not found",
      status: :not_found
    )
  end

  def formatted_teachers
    @teachers.map do |teacher|
      {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        job_title: teacher.job_title,
        bio: teacher.bio,
        created_at: teacher.created_at,
        updated_at: teacher.updated_at,
        course_count: teacher.courses_count,
        student_count: teacher.student_count,
        follower_count: teacher.follows.count,
        account: {
          email: teacher.email
        }
      }
    end
  end
end
