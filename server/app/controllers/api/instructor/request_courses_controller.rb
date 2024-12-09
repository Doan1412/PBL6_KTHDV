module Api::Instructor
  class RequestCoursesController < ApplicationController
    def create
      request_course = RequestCourse.new request_course_params
      request_course.teacher_id = current_teacher.id
      request_course.status = :pending

      if request_course.save
        json_response(message: request_course, status: :created)
      else
        error_response(message: request_course.errors.full_messages)
      end
    end

    private

    def request_course_params
      params.require(:request_course).permit(RequestCourse::VALID_ATTRIBUTES)
    end
  end
end
