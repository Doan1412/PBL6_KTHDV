class Api::Admin::UsersController < Api::Admin::ApplicationController
  authorize_resource

  def index
    @q = User.ransack(params[:q])
    @pagy, @users = pagy @q.result(distinct: true)
                           .includes(:account)
                           .includes(:courses)
                           .activated
    json_response(
      message: {
        users: @users.as_json(include: {
                                account: {only: [:email, :created_at, :status]},
                                courses: {only: [:id, :name]}
                              }),
        pagy: pagy_res(@pagy)
      },
      status: :ok
    )
  end
end
