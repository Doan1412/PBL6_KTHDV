class User < ApplicationRecord
  belongs_to :account

  has_many :course_assignments, dependent: :destroy
  has_many :courses, through: :course_assignments
  has_many :follows, dependent: :destroy
  has_many :teachers, through: :follows
  has_many :progresses, dependent: :destroy
  has_many :lessons, through: :progresses

  enum sex: {male: 0, female: 1, other: 2}

  validates :full_name, presence: true,
                   length: {maximum: Settings.maximum_name_length}
  validates :sex, presence: true, inclusion: {in: sexes.keys}
  delegate :email, to: :account
  delegate :status, to: :account

  scope :activated, ->{joins(:account).where(accounts: {activated: true})}

  class << self
    def ransackable_attributes _auth_object = nil
      %w(full_name email created_at updated_at status)
    end

    def ransackable_associations _auth_object = nil
      %w(account courses)
    end
  end
end
