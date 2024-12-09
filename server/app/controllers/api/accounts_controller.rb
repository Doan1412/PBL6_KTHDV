class Api::AccountsController < Api::ApplicationController
  include Response

  def create
    account_params = account_params_from_request
    user_params = user_params_from_request

    account = Account.new(account_params)

    if account.save
      AccountMailer.account_activation(account).deliver_now
      account.create_user(user_params)
      json_response(message: {id: account.id,
                              email: account.email,
                              created_at: account.created_at}, status: :ok)
    else
      error_response(message: account.errors.full_messages.join(", "),
                     status: :unprocessable_entity)
    end
  end

  def activate
    account = Account.find_by activation_token: params[:token]

    unless account && !account.activated?
      error_response(
        message: "Liên kết hoặc tài khoản không hợp lệ đã kích hoạt.",
        status: :unprocessable_entity
      ) and return
    end

    activate_account(account)
  end

  def forgot_password
    account = Account.find_by email: params[:email]

    if account
      account.send_password_reset_email
      json_response(message: "Email hướng dẫn đặt lại mật khẩu đã được gửi.",
                    status: :ok)
    else
      error_response(message: "Email không tồn tại.",
                     status: :unprocessable_entity)
    end
  end

  def reset_password
    account = Account.find_by reset_password_token: params[:token]

    if account&.password_token_valid?
      if account.reset_password! params[:password]
        json_response(message: "Mật khẩu đã được cập nhật.", status: :ok)
      else
        error_response(message: account.errors.full_messages.join(", "),
                       status: :unprocessable_entity)
      end
    else
      error_response(
        message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
        status: :unprocessable_entity
      )
    end
  end

  private

  def account_params_from_request
    params.require(:account).permit(Account::VALID_ATTRIBUTES_ACCOUNT)
  end

  def user_params_from_request
    params.require(:user).permit(Account::VALID_ATTRIBUTES_USER)
  end

  def activate_account account
    unless account.update(activated: true, activated_at: Time.zone.now)
      error_response(
        message: "Có lỗi xảy ra khi kích hoạt tài khoản: " \
                "#{account.errors.full_messages.join(', ')}",
        status: :unprocessable_entity
      ) and return
    end

    json_response(
      message: "Tài khoản của bạn đã được kích hoạt thành công!",
      status: :ok
    )
  end
end
