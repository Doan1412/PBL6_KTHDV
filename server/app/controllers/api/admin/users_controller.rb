class Api::Admin::UsersController < Api::Admin::ApplicationController
  authorize_resource

  def index
    # Sử dụng service để lấy danh sách người dùng
    users = UserService.fetch_users(params)

    # Paginate the result
    @pagy, @users = pagy(users)

    # Trả về JSON response
    json_response(
      message: {
        users: @users.as_json(
          include: {
            account: { only: [:email, :created_at, :status] },
            courses: { only: [:id, :name] }
          }
        ),
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end
end
