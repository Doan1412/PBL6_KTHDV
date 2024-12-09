class Api::AuthenticationController < Api::ApplicationController
  include Response

  def login
    service = AuthenticationService.new(auth_params)
    result = service.login

    if result[:success]
      json_response(message: { jwt: result[:jwt], roles: result[:roles] }, status: :ok)
    else
      error_response(message: result[:message], status: :unauthorized)
    end
  end

  def login_oauth_google
    service = AuthenticationService.new(auth_params)
    result = service.login_oauth_google

    if result[:success]
      json_response(message: { jwt: result[:jwt], roles: result[:roles] }, status: :ok)
    else
      error_response(message: result[:message], status: :unauthorized)
    end
  end

  private

  def auth_params
    params.require(:auth).permit(Account::VALID_ATTRIBUTES)
  end
end
