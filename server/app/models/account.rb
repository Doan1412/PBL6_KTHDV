class Account < ApplicationRecord
  before_create :generate_activation_token
  VALID_ATTRIBUTES = %i(email password id_token).freeze
  VALID_ATTRIBUTES_ACCOUNT = %i(email password password_confirmation).freeze
  VALID_ATTRIBUTES_USER = %i(full_name sex).freeze
  VALID_ATTRIBUTES_USER_CHANGE = %i(full_name sex bio goals image_url).freeze
  enum roles: {user: 0, teacher: 1, admin: 2}
  enum status: {active: 0, ban: 1}

  mail_regex = Regexp.new(Settings.VALID_EMAIL_REGEX)
  validates :email, presence: true,
                    length: {maximum: Settings.email_max_length},
                    format: {with: mail_regex}
  validates :password, presence: true,
                    length: {minimum: Settings.min_password_length},
                    allow_nil: true

  has_secure_password
  has_one :user, dependent: :destroy
  has_one :teacher, dependent: :destroy
  has_many :comments, dependent: :destroy

  def generate_activation_token
    self.activation_token = SecureRandom.urlsafe_base64(10)
    self.activated = false
  end

  def generate_reset_password_token
    self.reset_password_token = SecureRandom.urlsafe_base64(10)
    self.reset_password_sent_at = Time.zone.now
    save!(validate: false)
  end

  def password_token_valid?
    (reset_password_sent_at + Settings.constant_2.hours) > Time.zone.now
  end

  def reset_password! new_password
    self.password = new_password
    self.reset_password_token = nil
    save!
  end

  def send_password_reset_email
    generate_reset_password_token
    AccountMailer.password_reset(self).deliver_now
  end

  def toggle_status
    active? ? ban! : active!
  end

  class << self
    def ransackable_attributes _auth_object = nil
      %w(email status)
    end
  end
end
