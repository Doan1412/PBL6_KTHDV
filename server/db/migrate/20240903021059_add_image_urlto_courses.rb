class AddImageUrltoCourses < ActiveRecord::Migration[7.1]
  def change
    add_column :courses, :image_url, :string
  end
end