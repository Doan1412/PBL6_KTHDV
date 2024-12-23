class Api::Admin::UsersController < Api::Admin::ApplicationController
  authorize_resource

  def index
    users = UserService.fetch_users(params)

    @pagy, @users = pagy(users)

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
