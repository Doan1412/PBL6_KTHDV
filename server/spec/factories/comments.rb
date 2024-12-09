FactoryBot.define do
  factory :comment do
    lesson { nil }
    account { nil }
    content { "MyText" }
  end
end
