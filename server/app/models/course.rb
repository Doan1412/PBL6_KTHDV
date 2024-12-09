class Course < ApplicationRecord
  belongs_to :category
  belongs_to :teacher

  has_many :lessons, dependent: :destroy
  has_many :progresses, through: :lessons
  has_many :course_assignments, dependent: :destroy
  has_many :users, through: :course_assignments

  VALID_ATTRIBUTES_COURSE = %i(title level description category_id
                              image_url).freeze

  scope :hot, (lambda do
    left_joins(:course_assignments)
      .group("courses.id")
      .order("COUNT(course_assignments.id) DESC")
  end)
  scope :newest, ->{order(created_at: :desc)}
  scope :oldest, ->{order(created_at: :asc)}
  scope :default_order, ->{order(:title)}
  scope :by_category, ->(category_id){where(category_id:)}
  scope :sorted_by, lambda {|sort_param|
    case sort_param
    when "new"
      newest
    when "oldest"
      oldest
    when "hot"
      hot
    else
      default_order
    end
  }

  delegate :pending_count, :accepted_count, :rejected_count,
           to: :course_assignments_scopes

  def assignment_for_user user
    course_assignments.find_by user_id: user.id
  end

  class << self
    def ransackable_attributes _auth_object = nil
      %w(title level description created_at updated_at category_id teacher_id)
    end

    def ransackable_associations _auth_object = nil
      %w(category teacher lessons course_assignments)
    end
  end

  private

  def course_assignments_scopes
    CourseAssignmentScopes.new self
  end
end
