class AddJobTitleAndNameToTeachers < ActiveRecord::Migration[7.1]
  def change
    add_column :teachers, :job_title, :string
    add_column :teachers, :name, :string
  end
end
