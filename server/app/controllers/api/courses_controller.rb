class Api::CoursesController < Api::ApplicationController
  authorize_resource
  include Response
  before_action :set_course, only: %i(show assign)
  before_action :authenticate, only: :assign

  def index
    courses_query = Course.by_category(params[:category_id])
                          .sorted_by(params[:sort])
                          .includes(:lessons, :teacher, :category)
    @pagy, courses = pagy(courses_query)

    json_response(
      message: {
        courses: courses.as_json(include: %i(lessons teacher category)),
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end

  def show
    if @course.present?
      json_response(
        message: course_details,
        status: :ok
      )
    else
      error_response(message: "Course not found", status: :not_found)
    end
  end

  def assign
    course_assignment = @course.assignment_for_user(current_user)

    if course_assignment.present?
      handle_existing_assignment(course_assignment)
    else
      create_and_assign_new_course
    end
  end

  def search
    @q = Course.ransack(
      title_or_description_cont: params[:q],
      level_eq: params[:level],
      category_id_eq: params[:category],
      teacher_id_eq: params[:teacher]
    )
    @pagy, courses = pagy @q.result
                            .sorted_by(params[:sort])
                            .includes(:lessons, :teacher, :category)

    json_response(
      message: {
        courses: courses.as_json(include: %i(lessons teacher category)),
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end

  private

  def set_course
    @course = Course.find_by id: params[:id]
  end

  def course_details
    {
      course: course_with_lessons,
      is_assigned: current_user ? assigned? : false,
      status: current_user ? assignment_status : nil
    }
  end

  def course_with_lessons
    @course.as_json(include: %i(lessons teacher category))
  end

  def assigned?
    course_assignment.present?
  end

  def assignment_status
    course_assignment&.status
  end

  def course_assignment
    @course_assignment ||= CourseAssignment.find_by(user_id: current_user.id,
                                                    course_id: @course.id)
  end

  def handle_existing_assignment course_assignment
    return already_assigned unless course_assignment.status != "rejected"

    course_assignment.update(status: :pending, assigned_at: Time.zone.now)
    json_response(
      message: {
        course_id: @course.id,
        status: course_assignment.status
      },
      status: :ok
    )
  end

  def create_and_assign_new_course
    course_assignment = create_course_assignment
    course_assignment.assigned_at = Time.zone.now
    return assignment_failed unless course_assignment.save

    json_response(
      message: {
        course_id: @course.id,
        status: course_assignment.status
      },
      status: :ok
    )
  end

  def create_course_assignment
    current_user.course_assignments.create(course: @course, status: :pending)
  end

  def already_assigned
    error_response(
      message: {
        course_id: @course.id,
        status: :pending
      },
      status: :not_found
    )
  end

  def assignment_failed
    error_response(message: "Failed to assign course",
                   status: :unprocessable_entity)
  end
end
