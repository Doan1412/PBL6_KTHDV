class CourseService
  def initialize(course, user = nil)
    @course = course
    @user = user
  end

  def fetch_courses_by_category(category_id, sort_param)
    Course.by_category(category_id)
          .sorted_by(sort_param)
          .includes(:lessons, :teacher, :category)
  end

  def fetch_course_details
    {
      course: course_with_lessons,
      is_assigned: @user.present? ? assigned? : false,
      status: @user.present? ? assignment_status : nil
    }
  end

  def assign_course
    course_assignment = @course.assignment_for_user(@user)

    if course_assignment.present?
      handle_existing_assignment(course_assignment)
    else
      create_and_assign_new_course
    end
  end

  def search_courses(query_params, sort_param)
    Course.ransack(query_params).result
          .sorted_by(sort_param)
          .includes(:lessons, :teacher, :category)
  end

  def self.update_status(teacher:, course_id:, course_assignment:, status:)
    course = Course.find_by(id: course_id)

    unless course
      return { success: false, message: "Course not found", errors: { course_id: "Invalid course ID" } }
    end

    unless course.teacher_id == teacher.id
      return { success: false, message: "Permission denied", errors: { teacher: "Not authorized" } }
    end

    if course_assignment.update(status: status)
      { success: true, message: "Status updated successfully" }
    else
      { success: false, message: "Failed to update status", errors: course_assignment.errors.full_messages }
    end
  end

  def self.format_courses(courses)
    courses.map do |course|
      course.as_json.merge(
        category: course.category,
        teacher: course.teacher,
        assignments_count: assignments_count(course)
      )
    end
  end

  def self.delete_course(course)
    if course.destroy
      { success: true, message: "Course deleted successfully" }
    else
      { success: false, message: "Failed to delete course" }
    end
  end


  private

  def course_with_lessons
    @course.as_json(
      include: %i(lessons teacher category course_ratings),
      methods: :average_rating
    )
  end

  def assigned?
    course_assignment.present?
  end

  def assignment_status
    course_assignment&.status
  end

  def course_assignment
    @course_assignment ||= CourseAssignment.find_by(user_id: @user.id, course_id: @course.id)
  end

  def handle_existing_assignment(course_assignment)
    return already_assigned unless course_assignment.status != "rejected"

    course_assignment.update(status: :pending, assigned_at: Time.zone.now)
    { course_id: @course.id, status: course_assignment.status }
  end

  def create_and_assign_new_course
    course_assignment = create_course_assignment
    course_assignment.assigned_at = Time.zone.now
    return { error: "Failed to assign course" } unless course_assignment.save

    { course_id: @course.id, status: course_assignment.status }
  end

  def create_course_assignment
    @user.course_assignments.create(course: @course, status: :pending)
  end

  def already_assigned
    { error: "Course already assigned or pending", course_id: @course.id, status: :pending }
  end

  def self.assignments_count(course)
    {
      pending: course.pending_count,
      accepted: course.accepted_count,
      rejected: course.rejected_count
    }
  end
end
