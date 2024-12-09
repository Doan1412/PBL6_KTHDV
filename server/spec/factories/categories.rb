FactoryBot.define do
  factory :category do
    name { Faker::Educator.subject }
    description { Faker::Lorem.sentence }
  end
end
