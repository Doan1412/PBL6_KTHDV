class ChangeAcceptedToStatusInCourseAssignments < ActiveRecord::Migration[7.1]
  def change
    rename_column :course_assignments, :accepted, :status
    change_column :course_assignments, :status, :integer, default: 0
  end
end
