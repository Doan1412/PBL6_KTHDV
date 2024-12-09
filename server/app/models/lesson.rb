class Lesson < ApplicationRecord
  belongs_to :course

  has_many :flashcards, dependent: :destroy
  has_many :kanjis, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :progresses, dependent: :destroy
  has_many :users, through: :progresses

  VALID_ATTRIBUTES_LESSON = %i(title content video_url).freeze

  scope :by_course, ->(course_id){where(course_id:)}
  scope :completed_by_user, lambda {|user_id|
    joins(:progresses).merge(Progress.completed_by_user(user_id))
  }

  def progress_counts
    {
      not_started: progresses.with_status(:not_started).count,
      in_progress: progresses.with_status(:in_progress).count,
      completed: progresses.with_status(:completed).count
    }
  end

  class << self
    def ransackable_attributes _auth_object = nil
      %w(content title)
    end
  end
end
