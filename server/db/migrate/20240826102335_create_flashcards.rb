class CreateFlashcards < ActiveRecord::Migration[7.1]
  def change
    create_table :flashcards do |t|
      t.references :lesson, null: false, foreign_key: true
      t.string :front_text
      t.string :back_text

      t.timestamps
    end
  end
end
