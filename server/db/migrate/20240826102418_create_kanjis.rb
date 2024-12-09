class CreateKanjis < ActiveRecord::Migration[7.1]
  def change
    create_table :kanjis do |t|
      t.references :lesson, null: false, foreign_key: true
      t.string :meaning
      t.string :image_url

      t.timestamps
    end
  end
end
