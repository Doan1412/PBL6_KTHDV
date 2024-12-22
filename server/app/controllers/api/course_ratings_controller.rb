class Api::CourseRatingsController < Api::ApplicationController
  before_action :set_course, only: :create

  def create
    unless current_user.courses.exists?(@course.id)
      json_response(message: "You are not assigned to this course",
                    status: :forbidden)
      return
    end

    rating = @course.course_ratings.find_or_initialize_by(user: current_user)
    rating.rating = rating_params[:rating]

    if rating.save
      json_response(message: {
                      rating: rating.rating,
                      average_rating: @course.average_rating
                    }, status: :ok)
    else
      error_response(message: rating.errors.full_messages,
                     status: :unprocessable_entity)
    end
  end

  private

  def set_course
    @course = Course.find_by id: params[:course_id]
  end

  def rating_params
    params.require(:course_rating).permit(:rating)
  end
end
