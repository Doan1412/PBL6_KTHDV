class Flashcard < ApplicationRecord
  belongs_to :lesson

  VALID_ATTRIBUTES = %i(front_text back_text).freeze
end
