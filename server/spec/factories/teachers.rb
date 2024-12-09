FactoryBot.define do
  factory :teacher do
    account
    bio { "Experienced teacher in teaching Ruby on Rails" }
    image_url { "https://example.com/teacher_image.jpg" }
    experience { "5 years of teaching experience in web development" }
    job_title { "Software Engineer" }
    name { "John Doe" }
  end
end
