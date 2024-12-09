class Api::CoursesController < Api::ApplicationController
  authorize_resource
  include Response
  before_action :set_course, only: %i(show assign)
  before_action :authenticate, only: :assign

  def index
    result = CourseService.fetch_courses_by_category(current_user, params)

    json_response(
      message: {
        courses: result[:courses],
        pagy: pagy_res(result[:pagy])
      },
      status: :ok
    )
  end

  def show
    course_details = CourseService.fetch_course_details(current_user, @course)

    if @course.present?
      json_response(
        message: course_details,
        status: :ok
      )
    else
      error_response(message: "Course not found", status: :not_found)
    end
  end

  def assign
    result = CourseService.assign_course(current_user, @course)

    if result[:status] == :already_assigned
      error_response(message: "Course already assigned", status: :not_found)
    elsif result[:error]
      error_response(message: result[:error], status: :unprocessable_entity)
    else
      json_response(
        message: { course_id: result[:course_id], status: result[:status] },
        status: :ok
      )
    end
  end

  def search
    result = CourseService.search_courses(params)

    json_response(
      message: {
        courses: result[:courses],
        pagy: pagy_res(result[:pagy])
      },
      status: :ok
    )
  end

  private

  def set_course
    @course = Course.find_by(id: params[:id])
  end
end
