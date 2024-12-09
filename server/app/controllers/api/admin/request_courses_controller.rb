module Api::Admin
  class RequestCoursesController < ApplicationController
    before_action :set_request_course, only: [:update_status]

    def index
      @q = RequestCourse.includes(:teacher, :category).ransack(params[:q])
      @pagy, @request_courses = pagy @q.result(distinct: true).recent_first

      json_response(message: {
                      request_courses: @request_courses.as_json(
                        include: {
                          teacher: {only: [:name]},
                          category: {only: [:name]}
                        }
                      ),
                      pagy: pagy_res(@pagy)
                    }, status: :ok)
    end

    def update_status
      status = params[:status]

      ActiveRecord::Base.transaction do
        unless update_request_status(status)
          raise ActiveRecord::Rollback, "Failed to update the request"
        end

        if status == "approved"
          handle_approved_status
        else
          handle_rejected_status
        end
      end
    rescue ActiveRecord::Rollback => e
      error_response(message: e.message, status: :unprocessable_entity)
    rescue StandardError => e
      error_response(message: e.message)
    end

    private

    def set_request_course
      @request_course = RequestCourse.find params[:id]
    rescue ActiveRecord::RecordNotFound
      error_response(message: "Request not found", status: :not_found)
    end

    def update_request_status status
      @request_course.update(status:)
    end

    def handle_approved_status
      @request_course.approve_request
      @request_course.teacher.notify_followers_of_new_course(@request_course)
      json_response(message: "Request approved successfully")
    end

    def handle_rejected_status
      @request_course.reject_request
      json_response(message: "Request rejected successfully", status: :ok)
    end
  end
end
