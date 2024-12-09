class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.references :account, null: false, foreign_key: true
      t.string :full_name
      t.text :bio
      t.text :goals
      t.string :image_url

      t.timestamps
    end
  end
end
