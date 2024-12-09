class CourseService
  def self.fetch_courses_by_category(user, params)
    courses_query = Course.by_category(params[:category_id])
                          .sorted_by(params[:sort])
                          .includes(:lessons, :teacher, :category)
    pagy, courses = pagy(courses_query)
    { pagy: pagy, courses: courses.as_json(include: %i(lessons teacher category)) }
  end

  def self.fetch_course_details(user, course)
    {
      course: course_with_lessons(course),
      is_assigned: user ? assigned?(course, user) : false,
      status: user ? assignment_status(course, user) : nil
    }
  end

  def self.assign_course(user, course)
    course_assignment = course.assignment_for_user(user)

    if course_assignment.present?
      handle_existing_assignment(course_assignment)
    else
      create_and_assign_new_course(user, course)
    end
  end

  def self.search_courses(params)
    query = Course.ransack(
      title_or_description_cont: params[:q],
      level_eq: params[:level],
      category_id_eq: params[:category],
      teacher_id_eq: params[:teacher]
    )
    pagy, courses = pagy(query.result
                            .sorted_by(params[:sort])
                            .includes(:lessons, :teacher, :category))
    { pagy: pagy, courses: courses.as_json(include: %i(lessons teacher category)) }
  end

  private

  def self.course_with_lessons(course)
    course.as_json(include: %i(lessons teacher category))
  end

  def self.assigned?(course, user)
    course_assignment(course, user).present?
  end

  def self.assignment_status(course, user)
    course_assignment(course, user)&.status
  end

  def self.course_assignment(course, user)
    @course_assignment ||= CourseAssignment.find_by(user_id: user.id, course_id: course.id)
  end

  def self.handle_existing_assignment(course_assignment)
    return { status: :already_assigned } if course_assignment.status != "rejected"

    course_assignment.update(status: :pending, assigned_at: Time.zone.now)
    { course_id: course_assignment.course.id, status: course_assignment.status }
  end

  def self.create_and_assign_new_course(user, course)
    course_assignment = user.course_assignments.create(course: course, status: :pending)
    course_assignment.assigned_at = Time.zone.now
    if course_assignment.save
      { course_id: course.id, status: course_assignment.status }
    else
      { error: "Failed to assign course" }
    end
  end
end
