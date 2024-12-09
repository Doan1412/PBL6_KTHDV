class UserService
  def initialize(user)
    @user = user
  end

  # Fetch user profile
  def fetch_profile
    @user.as_json(include: { account: { only: [:email] } })
  end

  # Update user profile with provided params
  def update_profile(params)
    if @user.update(params)
      @user.as_json(include: { account: { only: [:email] } })
    else
      nil
    end
  end

  # Fetch enrolled courses for the user
  def fetch_enrolled_courses
    @user.courses
         .preload(:teacher, :category)
         .as_json(include: %i(teacher category))
  end

  # Fetch users for admin with filter and pagination
  def self.fetch_users(query_params)
    query = User.ransack(query_params[:q])
    users = query.result(distinct: true)
                .includes(:account, :courses)
                .activated
    users
  end
end
