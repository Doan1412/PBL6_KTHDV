class Api::Admin::CoursesController < Api::Admin::ApplicationController
  authorize_resource
  before_action :set_course, only: :destroy

  def index
    @q = Course.ransack(params[:q])
    @pagy, @courses = pagy @q.result.includes(:category, :teacher)

    json_response(
      message: {
        courses: formatted_courses,
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end

  def destroy
    unless @course.destroy
      return error_response(
        message: "Failed to delete course",
        status: :unprocessable_entity
      )
    end

    json_response(
      message: "Course deleted successfully",
      status: :ok
    )
  end

  private

  def set_course
    @course = Course.find_by id: params[:id]
    return if @course

    error_response(
      message: "Course not found",
      status: :not_found
    )
  end

  def formatted_courses
    @courses.map do |course|
      course.as_json.merge(
        category: course.category,
        teacher: course.teacher,
        assignments_count: assignments_count(course)
      )
    end
  end

  def assignments_count course
    {
      pending: course.pending_count,
      accepted: course.accepted_count,
      rejected: course.rejected_count
    }
  end
end
