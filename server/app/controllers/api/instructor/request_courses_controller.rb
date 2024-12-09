module Api::Instructor
  class RequestCoursesController < ApplicationController
    def create
      request_course_service = RequestCourseService.new(current_teacher, request_course_params)
      result = request_course_service.create_request_course

      if result[:success]
        json_response(message: result[:request_course], status: :created)
      else
        error_response(message: result[:errors], status: :unprocessable_entity)
      end
    end

    private

    def request_course_params
      params.require(:request_course).permit(RequestCourse::VALID_ATTRIBUTES)
    end
  end
end
