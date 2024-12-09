require "httparty"

class AuthenticationService
  include HTTParty

  def initialize(params)
    @params = params
  end

  def login
    account = Account.find_by(email: @params[:email])

    return error_response("Invalid email or password") unless account&.authenticate(@params[:password])

    return error_response("Account not activated") unless account.activated

    jwt = Auth.issue(payload: {account: account.id})
    success_response(jwt:, roles: account.roles)
  end

  def login_oauth_google
    response = fetch_google_token_info(@params[:id_token])

    return error_response("Invalid token") unless response.code == Settings.success_code

    account = find_or_create_account(response.parsed_response)
    if account.persisted?
      jwt = issue_jwt(account)
      success_response(jwt:, roles: account.roles)
    else
      error_response(account.errors.full_messages.join(", "))
    end
  end

  private

  def fetch_google_token_info(id_token)
    self.class.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=#{id_token}")
  end

  def find_or_create_account(response_body)
    account = Account.find_by(email: response_body["email"])
    return account if account

    create_new_account(response_body)
  end

  def create_new_account(response_body)
    account = Account.new(
      email: response_body["email"],
      password: SecureRandom.hex(10)
    )

    if account.save
      account.create_user(
        full_name: "#{response_body['given_name']} #{response_body['family_name']}",
        image_url: response_body["picture"]
      )
    end

    account
  end

  def issue_jwt(account)
    Auth.issue(payload: {account: account.id})
  end

  def success_response(jwt:, roles:)
    { success: true, jwt:, roles: }
  end

  def error_response(message)
    { success: false, message: }
  end
end
