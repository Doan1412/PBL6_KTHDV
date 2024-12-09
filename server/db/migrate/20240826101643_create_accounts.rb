class CreateAccounts < ActiveRecord::Migration[7.1]
  def change
    create_table :accounts do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.integer :roles, null: false, default: 0

      t.timestamps
    end

    add_index :accounts, :email, unique: true
  end
end
