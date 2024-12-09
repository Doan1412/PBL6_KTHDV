require "httparty"
class Api::AuthenticationController < Api::ApplicationController
  include Response
  include HTTParty

  def login
    account = Account.find_by(email: auth_params[:email])

    if account&.authenticate(auth_params[:password])
      unless account.activated
        return error_response(message: "Account not activated",
                              status: :unauthorized)
      end

      jwt = Auth.issue(payload: {account: account.id})
      json_response(message: {jwt:, roles: account.roles}, status: :ok)
    else
      error_response(message: "Invalid email or password",
                     status: :unauthorized)
    end
  end

  def login_oauth_google
    response = fetch_google_token_info(auth_params[:id_token])
    if response.code == Settings.success_code
      account = find_or_create_account(response.parsed_response)
      if account.persisted?
        jwt = issue_jwt(account)
        json_response(message: {jwt:, roles: account.roles}, status: :ok)
      else
        error_response(message: account.errors, status: :unprocessable_entity)
      end
    else
      error_response(message: "Invalid token", status: :unauthorized)
    end
  end

  private

  def fetch_google_token_info id_token
    HTTParty.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=#{id_token}")
  end

  def find_or_create_account response_body
    account = Account.find_by(email: response_body["email"])
    return account if account

    create_new_account(response_body)
  end

  def create_new_account response_body
    account = Account.new(
      email: response_body["email"],
      password: SecureRandom.hex(10)
    )

    if account.save
      account.create_user(
        full_name: "#{response_body['given_name']} " \
                 "#{response_body['family_name']}",
        image_url: response_body["picture"]
      )
    end

    account
  end

  def issue_jwt account
    Auth.issue(payload: {account: account.id})
  end

  def auth_params
    params.require(:auth).permit(Account::VALID_ATTRIBUTES)
  end
end
