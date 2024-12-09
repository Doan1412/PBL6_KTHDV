class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.references :lesson, null: false, foreign_key: true
      t.references :account, null: false, foreign_key: true
      t.text :content

      t.timestamps
    end
  end
end
