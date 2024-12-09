class TeacherService
  def initialize(teacher, current_user = nil)
    @teacher = teacher
    @current_user = current_user
  end

  # Trả về thông tin hồ sơ của giáo viên bao gồm các khóa học và tài khoản
  def teacher_profile
    @teacher.as_json(
      include: {
        courses: {
          include: {
            category: { only: :name }
          }
        },
        account: { only: :email }
      }
    )
  end

  # Đếm số lượng người theo dõi giáo viên
  def follower_count
    Follow.count_for_teacher(@teacher.id)
  end

  # Kiểm tra xem người dùng hiện tại có theo dõi giáo viên này hay không
  def user_following?
    return false unless @current_user

    @current_user.follows.exists?(teacher: @teacher)
  end

  # Cập nhật hồ sơ giáo viên
  def update_teacher_profile(params)
    @teacher.update(params)
  end

  # Lấy danh sách giáo viên với phân trang, tìm kiếm và tính toán các số liệu liên quan
  def self.fetch_teachers(query_params)
    query = Teacher.includes(:courses, :account).ransack(query_params[:q])
    teachers = query.result
                    .with_courses_count
                    .with_student_count
    teachers
  end
end
