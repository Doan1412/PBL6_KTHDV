class CreateLessons < ActiveRecord::Migration[7.1]
  def change
    create_table :lessons do |t|
      t.string :video_url
      t.references :course, null: false, foreign_key: true
      t.string :title
      t.text :content

      t.timestamps
    end
  end
end
