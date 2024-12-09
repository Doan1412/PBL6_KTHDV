module Api::Instructor
  class LessonsController < ApplicationController
    before_action :set_course, only: %i(index create update show)
    before_action :set_lesson, only: %i(show destroy update)
    before_action :authorized_teacher?, only: %i(update destroy show)
    before_action :permit?, only: :create

    def index
      lessons = LessonService.fetch_lessons(@course.id)
      formatted_lessons = LessonService.format_lessons(lessons)
      @pagy, paged_lessons = pagy(lessons)
      formatted_paged_lessons = LessonService.format_lessons(paged_lessons)

      json_response(
        message: {
          lessons: formatted_paged_lessons,
          pagy: pagy_res(@pagy)
        },
        status: :ok
      )
    end

    def create
      lesson_service = LessonService.new(@course, lesson_params, nil, params[:kanji])
      result = lesson_service.create_lesson

      if result[:success]
        json_response(message: result[:lesson], status: :ok)
      else
        error_response(message: result[:errors], status: :unprocessable_entity)
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
      lesson_service = LessonService.new(@course, lesson_params, @lesson, params[:kanji])
      result = lesson_service.update_lesson

      if result[:success]
        json_response(message: result[:lesson], status: :ok)
      else
        error_response(message: result[:errors], status: :unprocessable_entity)
      end
    end

    def destroy
      lesson_service = LessonService.new(nil, nil, @lesson)
      result = lesson_service.destroy_lesson

      if result[:success]
        json_response(
          message: {id: result[:id], status: "deleted"},
          status: :ok
        )
      else
        error_response(
          message: result[:errors],
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

    def lesson_details(lesson)
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
        course_title: lesson.course&.title
      }
    end

    def kanji_characters(lesson)
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
  end
end
