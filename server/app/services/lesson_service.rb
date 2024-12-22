class LessonService
  def initialize(course, lesson_params = nil, lesson = nil, kanji_params = nil)
    @course = course
    @lesson_params = lesson_params
    @lesson = lesson
    @kanji_params = kanji_params
  end

  def self.fetch_lessons(course_id)
    Lesson.by_course(course_id)
          .includes(:kanjis, :flashcards, course: :teacher, progresses: {})
  end

  def self.format_lessons(lessons)
    lessons.as_json(
      include: {
        kanjis: {},
        flashcards: {},
        progresses: { only: :status },
        course: {
          only: [:id],
          include: { teacher: { only: [:id] } }
        }
      }
    ).map do |lesson|
      lesson.merge("progresses" => lesson["progresses"].presence || {})
    end
  end

  def create_lesson
    lesson = @course.lessons.new(@lesson_params)
    if lesson.save
      handle_kanjis(lesson)
      return { success: true, lesson: lesson }
    else
      return { success: false, errors: lesson.errors.full_messages }
    end
  end

  def update_lesson
    if @lesson.update(@lesson_params)
      handle_kanjis_update(@lesson)
      return { success: true, lesson: @lesson }
    else
      return { success: false, errors: @lesson.errors.full_messages }
    end
  end

  def destroy_lesson
    if @lesson.destroy
      return { success: true, id: @lesson.id }
    else
      return { success: false, errors: "Failed to delete the lesson" }
    end
  end

  private

  def handle_kanjis(lesson)
    return if @kanji_params.blank?

    @kanji_params.each do |kanji_character|
      lesson.kanjis.create(character: kanji_character, image_url: nil)
    end
  end

  def handle_kanjis_update(lesson)
    lesson.kanjis.destroy_all
    return if @kanji_params.blank?

    handle_kanjis(lesson)
  end
end
