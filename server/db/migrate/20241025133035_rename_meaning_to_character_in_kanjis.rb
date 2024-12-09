class RenameMeaningToCharacterInKanjis < ActiveRecord::Migration[7.1]
  def change
    rename_column :kanjis, :meaning, :character
  end
end
