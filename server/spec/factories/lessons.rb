FactoryBot.define do
  factory :lesson do
    video_url { "MyString" }
    course { nil }
    title { "MyString" }
    content { "MyText" }
  end
end
