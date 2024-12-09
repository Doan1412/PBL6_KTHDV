class CourseAssignment < ApplicationRecord
  belongs_to :user
  belongs_to :course

  enum status: {pending: 0, accepted: 1, rejected: 2}

  scope :accepted, ->{where(status: :accepted)}
  scope :rejected, ->{where(status: :rejected)}
  scope :pending, ->{where(status: :pending)}
  scope :for_teacher, lambda {|teacher_id|
    joins(:course).where(courses: {teacher_id:})
  }

  delegate :level, :title, :image_url, to: :course, allow_nil: true
  delegate :full_name, to: :user, allow_nil: true

  class << self
    def ransackable_attributes _auth_object = nil
      %w(assigned_at course_id created_at id id_value status updated_at user_id)
    end

    def ransackable_associations _auth_object = nil
      %w(course user)
    end
  end

  def send_status_email
    return unless status == "accepted" || status == "rejected"

    CourseAssignmentMailer
      .with(course_assignment: self)
      .status_updated_email
      .deliver_now
  end
end
