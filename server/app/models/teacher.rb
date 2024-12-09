class Teacher < ApplicationRecord
  belongs_to :account
  VALID_ATTRIBUTES_PROFILE_CHANGE = %i(name job_title bio experience
image_url).freeze

  has_many :courses, dependent: :destroy
  has_many :follows, dependent: :destroy
  has_many :followers, through: :follows, source: :user
  has_many :request_courses, dependent: :destroy
  has_many :lessons, through: :courses
  delegate :email, to: :account

  scope :with_courses_count, (lambda do
    left_joins(:courses)
    .select("teachers.*, COUNT(courses.id) AS courses_count")
    .group("teachers.id")
  end)

  scope :with_student_count, (lambda do
    left_joins(courses: :course_assignments)
    .select("teachers.*,
    SUM(CASE WHEN course_assignments.status = 1 THEN 1 ELSE 0 END)
    AS student_count")
    .group("teachers.id")
  end)

  def notify_followers_of_new_course course
    followers.each do |follower|
      UserMailer.with(user: follower, teacher: self,
                      course:).new_course_notification.deliver_later
    end
  end

  class << self
    def ransackable_attributes _auth_object = nil
      %w(name job_title bio created_at updated_at email)
    end

    def ransackable_associations _auth_object = nil
      %w(account courses follows request_courses)
    end
  end
end
