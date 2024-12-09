class Api::TeachersController < Api::ApplicationController
  include Response
  before_action :set_teacher, only: :show

  def show
    follower_count = Follow.count_for_teacher(@teacher.id)
    teacher_profile = @teacher.as_json(
      include: {
        courses: {
          include: {
            category: {only: :name}
          }
        },
        account: {only: :email}
      }
    )

    user_following = if logged_in?
                       current_user.follows.exists?(teacher: @teacher)
                     else
                       false
                     end

    json_response(
      message: {
        profile: teacher_profile,
        follower_count:,
        is_following: user_following
      },
      status: :ok
    )
  end

  private

  def set_teacher
    @teacher = Teacher.includes(courses: :category).find_by id: params[:id]
    return if @teacher

    error_response({message: "Teacher not found"}, :not_found)
  end
end
