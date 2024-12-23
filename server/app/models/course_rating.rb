class CourseRating < ApplicationRecord
  belongs_to :user
  belongs_to :course

  validates :rating, presence: true, inclusion: {in: 1..5}
  validates :user_id,
            uniqueness: {scope: :course_id,
                         message: "You have already rated this course"}
end
