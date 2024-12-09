class AccountService
  class << self
    def create_account(account_params, user_params)
      account = Account.new(account_params)
  
      if account.save
        AccountMailer.account_activation(account).deliver_now
        account.create_user(user_params)
        { success: true, account: account }
      else
        { success: false, errors: account.errors.full_messages }
      end
    end
  
    def activate_account(token)
      account = Account.find_by(activation_token: token)
      return { success: false, message: "Liên kết hoặc tài khoản không hợp lệ." } unless account && !account.activated?
  
      if account.update(activated: true, activated_at: Time.zone.now)
        { success: true, message: "Tài khoản của bạn đã được kích hoạt thành công!" }
      else
        { success: false, message: account.errors.full_messages.join(", ") }
      end
    end
  
    def forgot_password(email)
      account = Account.find_by(email: email)
  
      if account
        account.send_password_reset_email
        { success: true, message: "Email hướng dẫn đặt lại mật khẩu đã được gửi." }
      else
        { success: false, message: "Email không tồn tại." }
      end
    end
  
    def reset_password(token, new_password)
      account = Account.find_by(reset_password_token: token)
  
      if account&.password_token_valid?
        if account.reset_password!(new_password)
          { success: true, message: "Mật khẩu đã được cập nhật." }
        else
          { success: false, message: account.errors.full_messages.join(", ") }
        end
      else
        { success: false, message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." }
      end
    end
    def update_status(account:)
      if account.toggle_status
        { success: true, message: "Cập nhật trạng thái thành công" }
      else
        { success: false, message: "Cập nhật trạng thái thất bại" }
      end
    end
  end
end
