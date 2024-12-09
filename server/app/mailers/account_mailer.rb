class AccountMailer < ApplicationMailer
  def account_activation account
    @account = account
    mail to: account.email, subject: "Kích hoạt tài khoản Return_E-Learning"
  end

  def password_reset account
    @account = account
    mail to: @account.email,
         subject: "Đặt lại mật khẩu tài khoản của #{@account.email}"
  end
end
