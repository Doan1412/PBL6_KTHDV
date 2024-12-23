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
        unless RequestCourseService.new(@request_course.teacher, nil).update_request_status(@request_course, status)
          raise ActiveRecord::Rollback, "Failed to update the request"
        end

        if status == "approved"
          result = RequestCourseService.new(@request_course.teacher, nil).handle_approved_status(@request_course)
          json_response(message: result[:message])
        else
          result = RequestCourseService.new(@request_course.teacher, nil).handle_rejected_status(@request_course)
          json_response(message: result[:message], status: result[:status])
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
  end
end
