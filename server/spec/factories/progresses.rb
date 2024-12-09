FactoryBot.define do
  factory :progress do
    user { nil }
    lesson { nil }
    status { 1 }
    started_at { "2024-10-07 12:08:40" }
    completed_at { "2024-10-07 12:08:40" }
  end
end
