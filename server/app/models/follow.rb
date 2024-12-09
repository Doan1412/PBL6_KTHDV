class Follow < ApplicationRecord
  belongs_to :user
  belongs_to :teacher

  scope :for_teacher, ->(teacher_id){where(teacher_id:)}

  class << self
    def count_for_teacher teacher_id
      for_teacher(teacher_id).count
    end
  end
end
