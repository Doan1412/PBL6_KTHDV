class Api::Admin::AccountsController < Api::Admin::ApplicationController
  authorize_resource
  before_action :load_account, only: :update_status

  def update_status
    result = AccountService.update_status(account: @account)

    if result[:success]
      json_response message: result[:message]
    else
      error_response message: result[:message], status: :unprocessable_entity
    end
  end

  private

  def load_account
    @account = Account.find_by(id: params[:id])
    return if @account

    error_response message: "Không tìm thấy tài khoản", status: :not_found
  end
end
