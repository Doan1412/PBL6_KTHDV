class CourseAssignmentScopes
  def initialize course
    @course = course
  end

  def pending_count
    @course.course_assignments.pending.count
  end

  def accepted_count
    @course.course_assignments.accepted.count
  end

  def rejected_count
    @course.course_assignments.rejected.count
  end
end
