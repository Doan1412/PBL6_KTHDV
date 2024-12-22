class Api::Admin::CoursesController < Api::Admin::ApplicationController
  authorize_resource
  before_action :set_course, only: :destroy

  def index
    @q = Course.ransack(params[:q])
    @pagy, @courses = pagy @q.result.includes(:category, :teacher)

    json_response(
      message: {
        courses: formatted_courses,
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
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

  def dashboard_stats
    dashboard_data = {
      total_assigned_courses:,
      total_teachers:,
      total_users:,
      total_courses:,
      course_requests:,
      teachers_per_category:
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

  def formatted_courses
    @courses.map do |course|
      course.as_json.merge(
        category: course.category,
        teacher: course.teacher,
        assignments_count: assignments_count(course)
      )
    end
  end

  def assignments_count course
    {
      pending: course.pending_count,
      accepted: course.accepted_count,
      rejected: course.rejected_count
    }
  end

  def total_assigned_courses
    CourseAssignment.count
  end

  def total_teachers
    Teacher.count
  end

  def total_users
    User.count
  end

  def total_courses
    Course.count
  end

  def course_requests
    RequestCourse.select(:id, :title, :description, :status, :teacher_id,
                         :created_at).map do |request|
      request.as_json.merge(teacher_name: request.teacher&.name)
    end
  end

  def teachers_per_category
    Category.joins(courses: :teacher)
            .group(:id, :name)
            .count("DISTINCT teachers.id")
  end
end
