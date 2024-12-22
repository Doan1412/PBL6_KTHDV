class CreateCourseRatings < ActiveRecord::Migration[7.1]
  def change
    create_table :course_ratings do |t|
      t.references :user, null: false, foreign_key: true
      t.references :course, null: false, foreign_key: true
      t.integer :rating

      t.timestamps
    end

    add_index :course_ratings, [:user_id, :course_id], unique: true
  end
end
