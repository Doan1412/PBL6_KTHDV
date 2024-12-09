class Api::LessonsController < Api::ApplicationController
  authorize_resource
  before_action :find_course, only: :index
  before_action :check_assignment, only: :index

  def index
    if @course.nil?
      return error_response(
        message: "Course not found",
        status: :not_found
      )
    end
    lessons = Lesson.by_course(@course.id)
                    .includes(:kanjis, :flashcards,
                              course: :teacher,
                              progresses: {})

    json_response(
      message: {
        lessons: lessons.as_json(
          include: {
            kanjis: {},
            flashcards: {},
            progresses: {
              only: :status
            },
            course: {
              only: [:id],
              include: {
                teacher: {only: [:id]}
              }
            }
          }
        ).map do |lesson|
          lesson.merge("progresses" => lesson["progresses"].presence || {})
        end
      },
      status: :ok
    )
  end

  private

  def find_course
    @course = Course.find_by id: params[:course_id]
  end

  def check_assignment
    if @course.nil?
      return error_response(
        message: "Course not found",
        status: :not_found
      )
    end
    course_id = params[:course_id]
    assignment = current_user.course_assignments.find_by course_id: course_id

    unless assignment
      return error_response(
        message: "You have not registered for " \
                 "this course or it is having an error.",
        status: :not_found
      )
    end

    return if assignment.accepted?

    error_response(
      message: "You have not been accepted for this course.",
      status: :forbidden
    )
  end
end
