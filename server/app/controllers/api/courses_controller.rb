class Api::CoursesController < Api::ApplicationController
  authorize_resource
  include Response
  before_action :set_course, only: %i(show assign)
  before_action :authenticate, only: :assign

  def index
    courses_query = CourseService.new(nil).fetch_courses_by_category(params[:category_id], params[:sort])
    @pagy, courses = pagy(courses_query)

    json_response(
      message: {
        courses: courses.as_json(include: %i(lessons teacher category)),
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end

  def show
    if @course.present?
      course_details = CourseService.new(@course, current_user).fetch_course_details
      json_response(message: course_details, status: :ok)
    else
      error_response(message: "Course not found", status: :not_found)
    end
  end

  def assign
    result = CourseService.new(@course, current_user).assign_course

    if result[:error]
      error_response(message: result[:error], status: :unprocessable_entity)
    else
      json_response(message: result, status: :ok)
    end
  end

  def search
    query_params = {
      title_or_description_cont: params[:q],
      level_eq: params[:level],
      category_id_eq: params[:category],
      teacher_id_eq: params[:teacher]
    }

    courses_query = CourseService.new(nil).search_courses(query_params, params[:sort])
    @pagy, courses = pagy(courses_query)

    json_response(
      message: {
        courses: courses.as_json(include: %i(lessons teacher category)),
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end

  private

  def set_course
    @course = Course.find_by(id: params[:id])
  end
end
