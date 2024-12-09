class UserService
  def initialize(user)
    @user = user
  end

  def fetch_profile
    @user.as_json(include: { account: { only: [:email] } })
  end

  def update_profile(params)
    if @user.update(params)
      @user.as_json(include: { account: { only: [:email] } })
    else
      nil
    end
  end

  def fetch_enrolled_courses
    @user.courses
         .preload(:teacher, :category)
         .as_json(include: %i(teacher category))
  end
end
