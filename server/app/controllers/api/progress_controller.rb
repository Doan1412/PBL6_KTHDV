class Api::ProgressController < Api::ApplicationController
  before_action :authenticate
  before_action :set_progress, only: %i(update)

  def create
    if current_user.progresses.exists?(lesson_id: progress_params[:lesson_id])
      return error_response(message: "Your progress has been recorded",
                            status: :forbidden)
    end

    progress = current_user.progresses.new(progress_params)

    unless progress.save
      return error_response(message: progress.errors.full_messages,
                            status: :forbidden)
    end

    json_response(message: "Progress saved successfully", status: :ok)
  end

  def update
    if @progress.nil?
      return error_response(message: "Progress not found", status: :not_found)
    end

    unless @progress.update(progress_params)
      return error_response(errors: @progress.errors.full_messages,
                            status: :forbidden)
    end

    json_response(message: {
                    success: "Progress updated successfully",
                    progress: @progress
                  }, status: :ok)
  end

  def user_progress
    assignments = current_user.course_assignments.includes(:course)
    progress_data = calculate_progress assignments

    json_response(
      message: {
        progress: progress_data,
        assignment: assignments_as_json(assignments)
      },
      status: :ok
    )
  end

  private

  def set_progress
    @progress = current_user.progresses.find_by lesson_id: params[:id]
  end

  def progress_params
    params.require(:progress).permit(Progress::VALID_ATTRIBUTES_PROGRESS)
  end

  def calculate_progress assignments
    accepted_courses = filter_accepted_courses assignments
    accepted_courses.map{|assignment| progress_for_assignment(assignment)}
  end

  def filter_accepted_courses assignments
    assignments.accepted
  end

  def progress_for_assignment assignment
    course = assignment.course
    {
      course_title: course.title,
      total_lessons: total_lessons(course),
      in_progress: course.progresses.with_status(Settings.in_progress).count,
      completed: course.progresses.with_status(Settings.completed).count
    }
  end

  def total_lessons course
    course.lessons.count
  end

  def assignments_as_json assignments
    assignments.as_json(include: :course)
  end
end
