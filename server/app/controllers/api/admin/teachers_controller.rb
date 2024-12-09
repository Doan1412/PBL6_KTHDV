class Api::Admin::TeachersController < Api::Admin::ApplicationController
  before_action :set_teacher, only: %i(destroy)

  # Lấy danh sách giáo viên
  def index
    # Gọi service để lấy danh sách giáo viên
    teachers = TeacherService.fetch_teachers(params)

    # Phân trang kết quả
    @pagy, @teachers = pagy(teachers)

    # Trả về dữ liệu đã được format
    json_response(
      message: {
        teachers: formatted_teachers,
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end

  # Xóa giáo viên
  def destroy
    unless @teacher.destroy
      return error_response(
        message: "Failed to delete teacher",
        status: :unprocessable_entity
      )
    end

    json_response(
      message: "Teacher deleted successfully",
      status: :ok
    )
  end

  private

  # Tìm giáo viên theo ID
  def set_teacher
    @teacher = Teacher.find_by(id: params[:id])
    return if @teacher

    error_response(
      message: "Teacher not found",
      status: :not_found
    )
  end

  # Format danh sách giáo viên để trả về
  def formatted_teachers
    @teachers.map do |teacher|
      {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        job_title: teacher.job_title,
        bio: teacher.bio,
        created_at: teacher.created_at,
        updated_at: teacher.updated_at,
        course_count: teacher.courses_count,
        student_count: teacher.student_count,
        follower_count: teacher.follows.count,
        account: {
          email: teacher.email
        }
      }
    end
  end
end
