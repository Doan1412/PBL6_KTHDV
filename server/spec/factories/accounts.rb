FactoryBot.define do
  factory :account do
    email { Faker::Internet.email }
    password_digest { BCrypt::Password.create('password') }
    roles { 0 }
    status { 0 }
    activated { true }
    activated_at { Time.current }
  end
end
