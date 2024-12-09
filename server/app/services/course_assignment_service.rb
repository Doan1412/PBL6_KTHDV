class CourseAssignmentService
  def self.check_assignment(user, course)
    return :not_found unless course

    assignment = user.course_assignments.find_by(course_id: course.id)
    return :not_registered unless assignment
    return :not_accepted unless assignment.accepted?

    :valid
  end
end
