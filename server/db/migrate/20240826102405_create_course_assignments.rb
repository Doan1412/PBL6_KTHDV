class CreateCourseAssignments < ActiveRecord::Migration[7.1]
  def change
    create_table :course_assignments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :course, null: false, foreign_key: true
      t.timestamp :assigned_at
      t.boolean :accepted

      t.timestamps
    end
  end
end
