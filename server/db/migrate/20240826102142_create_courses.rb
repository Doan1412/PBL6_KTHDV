class CreateCourses < ActiveRecord::Migration[7.1]
  def change
    create_table :courses do |t|
      t.references :category, null: false, foreign_key: true
      t.string :title
      t.string :level
      t.text :description
      t.references :teacher, null: false, foreign_key: true

      t.timestamps
    end
  end
end
