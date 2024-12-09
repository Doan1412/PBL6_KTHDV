class Api::FlashcardsController < Api::ApplicationController
  before_action :set_lesson, only: :create

  def create
    if @lesson.nil?
      return error_response(message: "Lesson not found", status: :not_found)
    end

    @flashcard = Flashcard.new flashcard_params
    @flashcard.lesson = @lesson

    if @flashcard.save
      json_response(message: @flashcard, status: :created)
    else
      error_response(message: @flashcard.errors.full_messages,
                     status: :unprocessable_entity)
    end
  end

  private

  def set_lesson
    @lesson = Lesson.find_by id: params[:flashcard][:lesson_id]
  end

  def flashcard_params
    params.require(:flashcard).permit(Flashcard::VALID_ATTRIBUTES)
  end
end
