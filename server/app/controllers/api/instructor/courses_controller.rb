module Api::Instructor
  class CoursesController < ApplicationController
    before_action :set_course, only: %i(destroy update show)
    before_action :check_course_ownership, only: %i(update show)

    def index
      @q = current_teacher.courses.ransack(params[:q])
      @pagy, @courses = pagy @q.result.includes(:category, :teacher)

      json_response(
        message: {
          courses: formatted_courses,
          pagy: pagy_res(@pagy)
        },
        status: :ok
      )
    end

    def show
      json_response(
        message: {
          course: formatted_course(@course)
        },
        status: :ok
      )
    end

    def update
      if @course.update(course_params)
        json_response(
          message: {
            course: formatted_course(@course)
          },
          status: :ok
        )
      else
        error_response(
          message: @course.errors.full_messages.to_sentence,
          status: :unprocessable_entity
        )
      end
    end

    def destroy
      unless @course.destroy
        return error_response(
          message: "Failed to delete course",
          status: :unprocessable_entity
        )
      end

      json_response(
        message: "Course deleted successfully",
        status: :ok
      )
    end

    def dashboard
      dashboard_data = {
        followers_count:,
        course_assignments:,
        course_requests:,
        total_accepted_assignments:
      }

      json_response(message: dashboard_data)
    end

    private

    def set_course
      @course = Course.find_by id: params[:id]
      return if @course

      error_response(
        message: "Course not found",
        status: :not_found
      )
    end

    def check_course_ownership
      return unless @course.nil? || @course.teacher_id != current_teacher.id

      error_response(
        message: "You are not authorized to access this course",
        status: :forbidden
      )
    end

    def course_params
      params.require(:course).permit(Course::VALID_ATTRIBUTES_COURSE)
    end

    def formatted_courses
      @courses.map do |course|
        course.as_json.merge(
          category: course.category,
          teacher: course.teacher,
          assignments_count: assignments_count(course)
        )
      end
    end

    def formatted_course course
      course.as_json.merge(
        category: course.category,
        teacher: course.teacher,
        assignments_count: assignments_count(course)
      )
    end

    def assignments_count course
      {
        pending: course.pending_count,
        accepted: course.accepted_count,
        rejected: course.rejected_count
      }
    end

    def followers_count
      current_teacher.follows.count
    end

    def course_assignments
      current_teacher.courses.map do |course|
        {
          course_title: course.title,
          pending: course.pending_count,
          accepted: course.accepted_count,
          rejected: course.rejected_count
        }
      end
    end

    def course_requests
      current_teacher.request_courses.map do |request|
        {
          title: request.title,
          status: request.status,
          created_at: request.created_at
        }
      end
    end

    def total_accepted_assignments
      current_teacher.courses.sum(&:accepted_count)
    end
  end
end
