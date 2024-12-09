class RequestCourse < ApplicationRecord
  belongs_to :teacher
  belongs_to :category

  VALID_ATTRIBUTES = %i(category_id title level description image_url).freeze
  enum status: {pending: 0, approved: 1, rejected: 2}

  validates :title, presence: true
  validates :level, presence: true
  validates :description, presence: true
  validates :image_url, presence: true

  scope :recent_first, ->{order(created_at: :desc)}

  def create_course
    Course.create!(
      title:,
      description:,
      level:,
      category_id:,
      teacher_id:,
      image_url:
    )
  end

  def approve_request
    update(status: "approved")
    RequestMailer.request_approved(self).deliver_later
    create_course
  end

  def reject_request
    update(status: "rejected")
    RequestMailer.request_rejected(self).deliver_later
  end

  class << self
    def ransackable_attributes _auth_object = nil
      %w(created_at description image_url level status title)
    end

    def ransackable_associations _auth_object = nil
      %w(teacher category)
    end
  end
end
