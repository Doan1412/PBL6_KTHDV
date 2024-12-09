module Response
  extend ActiveSupport::Concern

  def json_response message:, status: :ok
    render json: {message:}, status:
  end

  def error_response message:, status: :unprocessable_entity
    render json: {error: message}, status:
  end
end
