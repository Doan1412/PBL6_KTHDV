class AddResetPasswordToAccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :accounts, :reset_password_token, :string
    add_column :accounts, :reset_password_sent_at, :datetime
  end
end
