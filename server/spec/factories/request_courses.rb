FactoryBot.define do
  factory :request_course do
    teacher_id { "" }
    category_id { "" }
    title { "MyString" }
    level { "MyString" }
    description { "MyText" }
    image_url { "MyString" }
    status { 1 }
  end
end
