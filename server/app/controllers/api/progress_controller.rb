class Api::ProgressController < Api::ApplicationController
  before_action :authenticate
  before_action :set_progress, only: %i[update]

  def create
    service = ProgressService.new(current_user)
    result = service.create_progress(progress_params)

    case result
    when :exists
      error_response(message: "Your progress has been recorded", status: :forbidden)
    when :success
      json_response(message: "Progress saved successfully", status: :ok)
    else
      error_response(message: result, status: :forbidden)
    end
  end

  def update
    service = ProgressService.new(current_user)
    result = service.update_progress(@progress, progress_params)

    case result
    when :not_found
      error_response(message: "Progress not found", status: :not_found)
    when Progress
      json_response(message: { success: "Progress updated successfully", progress: result }, status: :ok)
    else
      error_response(errors: result, status: :forbidden)
    end
  end

  def user_progress
    assignments = current_user.course_assignments.includes(:course)
    service = ProgressService.new(current_user)
    progress_data = service.calculate_progress(assignments)
    assignment_data = AssignmentService.as_json_with_course(assignments)

    json_response(
      message: {
        progress: progress_data,
        assignment: assignment_data
      },
      status: :ok
    )
  end

  private

  def set_progress
    @progress = current_user.progresses.find_by(lesson_id: params[:id])
  end

  def progress_params
    params.require(:progress).permit(Progress::VALID_ATTRIBUTES_PROGRESS)
  end
end
