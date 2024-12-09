FactoryBot.define do
  factory :course do
    association :category
    association :teacher
    title { Faker::Educator.course_name }
    level { %w[beginner intermediate advanced].sample }
    description { Faker::Lorem.paragraph }
    image_url { Faker::Internet.url(path: "/images/#{Faker::Lorem.word}.jpg") }
  end
end
