class Api::LessonsController < Api::ApplicationController
  authorize_resource
  before_action :find_course, only: :index
  before_action :check_assignment, only: :index

  def index
    lessons = LessonService.fetch_lessons(@course.id)
    formatted_lessons = LessonService.format_lessons(lessons)

    json_response(
      message: { lessons: formatted_lessons },
      status: :ok
    )
  end

  private

  def find_course
    @course = Course.find_by(id: params[:course_id])
    return if @course

    error_response(message: "Course not found", status: :not_found)
  end

  def check_assignment
    result = CourseAssignmentService.check_assignment(current_user, @course)
    case result
    when :not_found
      error_response(message: "Course not found", status: :not_found)
    when :not_registered
      error_response(
        message: "You have not registered for this course or it is having an error.",
        status: :not_found
      )
    when :not_accepted
      error_response(message: "You have not been accepted for this course.", status: :forbidden)
    end
  end
end
