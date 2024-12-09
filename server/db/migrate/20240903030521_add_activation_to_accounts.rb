class AddActivationToAccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :accounts, :activation_token, :string
    add_column :accounts, :activated, :boolean, default: false
    add_column :accounts, :activated_at, :datetime
  end
end
