class CourseAssignmentService
  def initialize(teacher, course_id)
    @teacher = teacher
    @course_id = course_id
  end

  def fetch_course_assignments(params)
    query = CourseAssignment.for_teacher(@teacher.id)
                             .includes(:course, :user)
                             .ransack(params[:q])

    course_assignments = query.result

    formatted_assignments = course_assignments.map do |course_assignment|
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

    formatted_assignments
  end

  def update_status(course_assignment, status)
    if course_assignment.update(status: status)
      course_assignment.send_status_email
      { success: true, message: "Cập nhật trạng thái thành công!" }
    else
      { success: false, message: "Cập nhật trạng thái thất bại!", errors: course_assignment.errors.full_messages }
    end
  end

  def self.check_assignment(user, course)
    return :not_found unless course

    assignment = user.course_assignments.find_by(course_id: course.id)
    return :not_registered unless assignment
    return :not_accepted unless assignment.accepted?

    :valid
  end
end
