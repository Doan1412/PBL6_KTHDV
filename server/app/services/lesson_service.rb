# app/services/lesson_service.rb
class LessonService
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
end
