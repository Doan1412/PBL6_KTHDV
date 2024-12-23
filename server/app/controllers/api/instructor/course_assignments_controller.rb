module Api::Instructor
  class CourseAssignmentsController < ApplicationController
    before_action :set_course_assignment, only: :update_status

    def index
      course_assignments = CourseAssignmentService.fetch_course_assignments(current_teacher, params)
      @pagy, @course_assignments = pagy course_assignments

      json_response(
        message: {
          course_assignments: formatted_course_assignments(@course_assignments),
          pagy: pagy_res(@pagy)
        },
        status: :ok
      )
    end

    def update_status
      result = CourseAssignmentService.update_status(@course_assignment, params[:status]
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
    def set_course_assignment
      @course_assignment = CourseAssignment.find_by(id: params[:id])
    end
    
    def formatted_course_assignments course_assignments
      course_assignments.map do |course_assignment|
        {
          id: course_assignment.id,
          full_name: course_assignment.full_name,
          course_id: course_assignment.course_id,
          assigned_at: course_assignment.assigned_at,
          status: course_assignment.status,
          created_at: course_assignment.created_at,
          updated_at: course_assignment.updated_at,
          course_title: course_assignment.title,
          course_level: course_assignment.level,
          course_image_url: course_assignment.image_url
        }
      end
    end
  end
end
