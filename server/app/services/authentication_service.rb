require "httparty"

class AuthenticationService
  include HTTParty

  def initialize(params)
    @params = params
  end

  def login
    account = Account.find_by(email: @params[:email])
    
    if account&.authenticate(@params[:password])
      return error(message: "Account not activated", status: :unauthorized) unless account.activated
      return error(message: "Account is banned", status: :forbidden) if account.ban?

      jwt = issue_jwt(account)
      success(jwt:, roles: account.roles)
    else
      error(message: "Invalid email or password", status: :unauthorized)
    end
  end

  def login_oauth_google
    response = fetch_google_token_info(@params[:id_token])
    
    if response.code == Settings.success_code
      account = find_or_create_account(response.parsed_response)

      return error(message: "Account is banned", status: :forbidden) if account.ban?

      if account.persisted?
        jwt = issue_jwt(account)
        success(jwt:, roles: account.roles)
      else
        error(message: account.errors.full_messages, status: :unprocessable_entity)
      end
    else
      error(message: "Invalid token", status: :unauthorized)
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
    Auth.issue(payload: { account: account.id })
  end

  def success(jwt:, roles:)
    { success: true, jwt:, roles: }
  end

  def error(message:, status:)
    { success: false, message:, status: }
  end
end
