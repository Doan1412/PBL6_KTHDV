class Api::ApplicationController < ActionController::API
  include Response
  include CanCan::ControllerAdditions
  include Pagy::Backend

  def logged_in?
    !!current_user
  end

  def current_user
    return unless auth_present?

    account = Account.find_by(id: auth["payload"]["account"])
    @current_user ||= account&.user if account&.user
  end

  def current_account
    return unless auth_present?

    @current_account = Account.find_by(id: auth["payload"]["account"])
  end

  def current_ability
    @current_ability ||= Ability.new current_account
  end

  def admin?
    return if current_account&.admin?

    error_response(message: "Bạn không có quyền truy cập vào tài nguyên này.",
                   status: :forbidden) and return
  end

  def teacher?
    return if current_account&.teacher?

    error_response(message: "Bạn không có quyền truy cập vào tài nguyên này.",
                   status: :forbidden) and return
  end

  def authenticate
    return if logged_in?

    render json: {error: "unauthorized"}, status: :unauthorized and return
  end

  rescue_from CanCan::AccessDenied do |exception|
    render error_response(message: exception.message,
                          status: :forbidden) and return
  end

  private

  def token
    request.headers["Authorization"]&.scan(/Bearer (.*)$/)&.flatten&.last
  end

  def auth
    Auth.decode(token) if token.present?
  end

  def auth_present?
    request.headers["Authorization"]&.match?(/Bearer/)
  end

  def pagy_res pagy
    {
      count: pagy.count,
      pages: pagy.pages,
      current_page: pagy.page,
      next_page: pagy.next,
      prev_page: pagy.prev
    }
  end
end
