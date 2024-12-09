FactoryBot.define do
  factory :course_assignment do
    user
    course
    assigned_at { Time.current }
    status { 0 } 
  end
end
