class Progress < ApplicationRecord
  belongs_to :user
  belongs_to :lesson

  before_save :set_started_at, if: ->{status_changed? && in_progress?}
  before_save :set_completed_at, if: ->{status_changed? && completed?}

  VALID_ATTRIBUTES_PROGRESS = %i(lesson_id status).freeze

  enum status: {not_started: 0, in_progress: 1, completed: 2}

  validates :user_id, :lesson_id, presence: true

  scope :completed_by_user, lambda {|user_id|
    where(user_id:, completed: true)
  }
  scope :with_status, ->(status){where(status:)}

  private

  def set_started_at
    self.started_at ||= Time.zone.now
  end

  def set_completed_at
    self.completed_at = Time.zone.now
  end
end
