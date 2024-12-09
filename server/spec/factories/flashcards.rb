FactoryBot.define do
  factory :flashcard do
    lesson { nil }
    front_text { "MyString" }
    back_text { "MyString" }
  end
end
