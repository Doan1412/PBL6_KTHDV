class CourseAssignmentService
  def self.fetch_course_assignments(teacher, params)
    query = CourseAssignment.for_teacher(teacher.id)
                             .includes(:course, :user)
                             .ransack(params[:q])

    course_assignments = query.result
    course_assignments
  end

  def self.update_status(course_assignment, status)
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
