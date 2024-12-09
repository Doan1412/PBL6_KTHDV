class Api::Admin::AccountsController < Api::Admin::ApplicationController
  authorize_resource
  before_action :load_account, only: %i(update_status)

  def update_status
    if @account.toggle_status
      json_response message: "Cập nhật trạng thái thành công"
    else
      error_response message: "Cập nhật trạng thái thất bại"
    end
  end

  private
  def load_account
    @account = Account.find_by id: params[:id]
    return if @account

    error_response message: "Không tìm thấy tài khoản",
                   status: :not_found and return
  end
end
