module Api::Instructor
  class LessonsController < ApplicationController
    before_action :set_course, only: %i(index create update show)
    before_action :set_lesson, only: %i(show destroy update)
    before_action :authorized_teacher?, only: %i(update destroy show)
    before_action :permit?, only: :create

    def index
      @q = @course.lessons.ransack(params[:q])
      @pagy, @lessons = pagy(@q.result.includes(:course))

      json_response(
        message: {
          lessons: formatted_lessons,
          pagy: pagy_res(@pagy)
        },
        status: :ok
      )
    end

    def create
      lesson = build_lesson
      if lesson.save
        handle_kanjis(lesson)
        json_response(message: lesson, status: :ok)
      else
        error_response(message: lesson.errors.full_messages,
                       status: :unprocessable_entity)
      end
    end

    def show
      unless @lesson
        return error_response(message: "Lesson not found", status: :not_found)
      end

      json_response(
        message: {
          lesson: lesson_details(@lesson)
        },
        status: :ok
      )
    end

    def update
      unless @lesson.update lesson_params
        return error_response(message: @lesson.errors.full_messages,
                              status: :unprocessable_entity)
      end

      handle_kanjis_update(@lesson)
      json_response(message: @lesson, status: :ok)
    end

    def destroy
      unless @lesson
        return error_response(message: "Lesson not found",
                              status: :not_found)
      end

      if @lesson.destroy
        json_response(
          message: {id: @lesson.id, status: "deleted"},
          status: :ok
        )
      else
        error_response(
          message: "Failed to delete the lesson",
          status: :unprocessable_entity
        )
      end
    end

    private

    def set_course
      @course = Course.find_by id: params[:course_id]
    end

    def set_lesson
      @lesson = Lesson.find_by id: params[:id]
    end

    def lesson_params
      params.require(:lesson).permit(Lesson::VALID_ATTRIBUTES_LESSON)
    end

    def lesson_details lesson
      {
        id: lesson.id,
        title: lesson.title,
        course_id: lesson.course_id,
        content: lesson.content,
        video_url: lesson.video_url,
        created_at: lesson.created_at,
        updated_at: lesson.updated_at,
        progress_counts: lesson.progress_counts,
        kanjis: kanji_characters(lesson),
        course_title: @lesson&.course&.title
      }
    end

    def kanji_characters lesson
      lesson.kanjis.pluck(:character)
    end

    def formatted_lessons
      @lessons.map do |lesson|
        {
          id: lesson.id,
          title: lesson.title,
          course_id: lesson.course_id,
          content: lesson.content,
          video_url: lesson.video_url,
          created_at: lesson.created_at,
          updated_at: lesson.updated_at,
          progress_counts: lesson.progress_counts
        }
      end
    end

    def create_kanjis_for_lesson lesson, kanji_array
      kanji_array.each do |kanji_character|
        lesson.kanjis.create(character: kanji_character, image_url: nil)
      end
    end

    def handle_kanjis_update lesson
      lesson.kanjis.destroy_all
      return if params[:kanji].blank?

      create_kanjis_for_lesson(lesson, params[:kanji])
    end

    def authorized_teacher?
      if @lesson&.course&.teacher_id == current_teacher.id
        true
      else
        error_response(message: "You are not authorized to access this lesson",
                       status: :forbidden)
        false
      end
    end

    def permit?
      if @course&.teacher_id == current_teacher.id
        true
      else
        error_response(message: "You are not authorized to access this lesson",
                       status: :forbidden)
        false
      end
    end

    def build_lesson
      @course.lessons.new lesson_params
    end

    def handle_kanjis lesson
      return if params[:kanji].blank?

      create_kanjis_for_lesson(lesson, params[:kanji])
    end
  end
end
