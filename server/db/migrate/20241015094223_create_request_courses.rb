class CreateRequestCourses < ActiveRecord::Migration[7.1]
  def change
    create_table :request_courses do |t|
      t.bigint :teacher_id
      t.bigint :category_id
      t.string :title
      t.string :level
      t.text :description
      t.string :image_url
      t.integer :status

      t.timestamps
    end
  end
end
