class Api::Admin::CoursesController < Api::Admin::ApplicationController
  authorize_resource
  before_action :set_course, only: :destroy

  def index
    @q = Course.ransack(params[:q])
    @pagy, @courses = pagy @q.result.includes(:category, :teacher)

    json_response(
      message: {
        courses: CourseService.format_courses(@courses),
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end

  def destroy
    result = CourseService.delete_course(@course)

    if result[:success]
      json_response(message: result[:message], status: :ok)
    else
      error_response(message: result[:message], status: :unprocessable_entity)
    end
  end

  private

  def set_course
    @course = Course.find_by(id: params[:id])
    return if @course

    error_response(
      message: "Course not found",
      status: :not_found
    )
  end
end
