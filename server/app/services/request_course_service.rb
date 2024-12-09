class RequestCourseService
  def initialize(current_teacher, request_course_params)
    @current_teacher = current_teacher
    @request_course_params = request_course_params
  end

  # Tạo yêu cầu khóa học mới
  def create_request_course
    request_course = RequestCourse.new(@request_course_params)
    request_course.teacher_id = @current_teacher.id
    request_course.status = :pending

    if request_course.save
      return { success: true, request_course: request_course }
    else
      return { success: false, errors: request_course.errors.full_messages }
    end
  end
end
