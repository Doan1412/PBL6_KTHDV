class FlashcardService
  def self.create_flashcard(lesson, flashcard_params)
    flashcard = Flashcard.new(flashcard_params)
    flashcard.lesson = lesson

    if flashcard.save
      flashcard
    else
      nil
    end
  end
end
