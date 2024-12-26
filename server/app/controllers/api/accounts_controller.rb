class Api::AccountsController < Api::ApplicationController
  include Response

  def create
    account_params = account_params_from_request
    user_params = user_params_from_request

    result = AccountService.create_account(account_params, user_params)

    if result[:success]
      json_response(
        message: { id: result[:account].id, email: result[:account].email, created_at: result[:account].created_at },
        status: :ok
      )
    else
      error_response(message: result[:message] || result[:errors]&.join(", "), status: :unprocessable_entity)
    end
  end

  def activate
    result = AccountService.activate_account(params[:token])

    if result[:success]
      json_response(message: result[:message], status: :ok)
    else
      error_response(message: result[:message], status: :unprocessable_entity)
    end
  end

  def forgot_password
    result = AccountService.forgot_password(params[:email])

    if result[:success]
      json_response(message: result[:message], status: :ok)
    else
      error_response(message: result[:message], status: :unprocessable_entity)
    end
  end

  def reset_password
    result = AccountService.reset_password(params[:token], params[:password])

    if result[:success]
      json_response(message: result[:message], status: :ok)
    else
      error_response(message: result[:message], status: :unprocessable_entity)
    end
  end

  private

  def account_params_from_request
    params.require(:account).permit(Account::VALID_ATTRIBUTES_ACCOUNT)
  end

  def user_params_from_request
    params.require(:user).permit(Account::VALID_ATTRIBUTES_USER)
  end
end
