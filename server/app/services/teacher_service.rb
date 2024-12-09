# app/services/teacher_service.rb
class TeacherService
  def initialize(teacher, current_user = nil)
    @teacher = teacher
    @current_user = current_user
  end

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

  def follower_count
    Follow.count_for_teacher(@teacher.id)
  end

  def user_following?
    return false unless @current_user

    @current_user.follows.exists?(teacher: @teacher)
  end
end
