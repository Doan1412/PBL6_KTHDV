FactoryBot.define do
  factory :user do
    association :account
    full_name { Faker::Name.name }
    bio { Faker::Lorem.paragraph }
    goals { Faker::Lorem.sentence }
    image_url { Faker::Avatar.image }
    sex { [0, 1].sample }
  end
end
