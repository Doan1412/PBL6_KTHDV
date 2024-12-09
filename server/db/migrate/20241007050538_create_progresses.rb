class CreateProgresses < ActiveRecord::Migration[7.1]
  def change
    create_table :progresses do |t|
      t.references :user, null: false, foreign_key: true
      t.references :lesson, null: false, foreign_key: true
      t.integer :status, default: 0
      t.datetime :started_at
      t.datetime :completed_at

      t.timestamps
    end
  end
end
