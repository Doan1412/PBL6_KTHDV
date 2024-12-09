module Api::Instructor
  class CourseAssignmentsController < ApplicationController
    before_action :set_course
    before_action :set_course_assignment, only: :update_status

    def index
      @q = CourseAssignment.for_teacher(current_teacher.id)
                           .includes(:course, :user)
                           .ransack(params[:q])
      @pagy, @course_assignments = pagy @q.result

      json_response(
        message: {
          course_assignments: @course_assignments,
          pagy: pagy_res(@pagy)
        },
        status: :ok
      )
    end

    def update_status
      result = CourseAssignmentService.update_status(
        teacher: current_teacher,
        course_id: params[:course_id],
        course_assignment: @course_assignment,
        status: params[:status]
      )

      if result[:success]
        json_response(message: result[:message])
      else
        error_response(
          message: result[:message],
          errors: result[:errors],
          status: :unprocessable_entity
        )
      end
    end

    private

    def set_course
      @course = Course.find_by(id: params[:course_id])
    end

    def set_course_assignment
      @course_assignment = CourseAssignment.find_by(id: params[:id])
    end
  end
end
