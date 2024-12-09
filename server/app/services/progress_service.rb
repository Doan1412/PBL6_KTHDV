class ProgressService
  def initialize(user)
    @user = user
  end

  def create_progress(params)
    return :exists if @user.progresses.exists?(lesson_id: params[:lesson_id])

    progress = @user.progresses.new(params)
    progress.save ? :success : progress.errors.full_messages
  end

  def update_progress(progress, params)
    return :not_found unless progress

    progress.update(params) ? progress : progress.errors.full_messages
  end

  def calculate_progress(assignments)
    accepted_courses = assignments.accepted
    accepted_courses.map { |assignment| progress_for_assignment(assignment) }
  end

  private

  def progress_for_assignment(assignment)
    course = assignment.course
    {
      course_title: course.title,
      total_lessons: course.lessons.count,
      in_progress: course.progresses.with_status(Settings.in_progress).count,
      completed: course.progresses.with_status(Settings.completed).count
    }
  end
end
