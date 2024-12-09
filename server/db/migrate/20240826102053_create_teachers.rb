class CreateTeachers < ActiveRecord::Migration[7.1]
  def change
    create_table :teachers do |t|
      t.references :account, null: false, foreign_key: true
      t.text :bio
      t.string :image_url
      t.text :experience

      t.timestamps
    end
  end
end
