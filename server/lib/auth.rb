require "jwt"

class Auth
  ALGORITHM = Settings.ALGORITHM

  def self.issue payload
    JWT.encode(
      payload,
      auth_secret,
      ALGORITHM
    )
  end

  def self.decode token
    JWT.decode(
      token,
      auth_secret,
      true,
      algorithm: ALGORITHM
    ).first
  end

  def self.auth_secret
    ENV["secret_key_base"]
  end
end
