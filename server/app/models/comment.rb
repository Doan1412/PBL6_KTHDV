class Comment < ApplicationRecord
  belongs_to :lesson
  belongs_to :account
end
