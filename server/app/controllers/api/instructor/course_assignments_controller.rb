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
          course_assignments: formatted_course_assignments(@course_assignments),
          pagy: pagy_res(@pagy)
        },
        status: :ok
      )
    end

    def update_status
      if @course_assignment.update status: params[:status]
        @course_assignment.send_status_email
        json_response(message: "Cập nhật trạng thái thành công!")
      else
        error_response(message: "Cập nhật trạng thái thất bại!",
                       errors: @course_assignment.errors.full_messages,
                       status: :unprocessable_entity)
      end
    end

    private

    def set_course
      @course = Course.find_by id: params[:course_id]
    end

    def set_course_assignment
      @course_assignment = CourseAssignment.find_by id: params[:id]
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
