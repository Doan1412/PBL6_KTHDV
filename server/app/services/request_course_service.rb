class RequestCourseService
  def initialize(current_teacher, request_course_params)
    @current_teacher = current_teacher
    @request_course_params = request_course_params
  end

  def create_request_course
    request_course = RequestCourse.new(@request_course_params)
    request_course.teacher_id = @current_teacher.id
    request_course.status = :pending

    if request_course.save
      { success: true, request_course: request_course }
    else
      { success: false, errors: request_course.errors.full_messages }
    end
  end

  def update_request_status(request_course, status)
    request_course.update(status: status)
  end

  def handle_approved_status(request_course)
    request_course.approve_request
    request_course.teacher.notify_followers_of_new_course(request_course)
    { message: "Request approved successfully" }
  end

  def handle_rejected_status(request_course)
    request_course.reject_request
    { message: "Request rejected successfully", status: :ok }
  end
end
