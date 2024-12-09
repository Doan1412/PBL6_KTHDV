require "json"

teachers_file_path = Rails.root.join("db", "teachers.json")
courses_file_path = Rails.root.join("db", "courses.json")
categories_file_path = Rails.root.join("db", "categories.json")
lectures_file_path = Rails.root.join("db", "course_lectures.json")

teachers_file = File.read(teachers_file_path)
courses_file = File.read(courses_file_path)
categories_file = File.read(categories_file_path)
lectures_file = File.read(lectures_file_path)

categories_data = JSON.parse(categories_file)
courses_data = JSON.parse(courses_file)
teachers_data = JSON.parse(teachers_file)
lectures_data = JSON.parse(lectures_file)

teachers_map = {}
teachers_data.each do |teacher|
  account = Account.create!(
    email: Faker::Internet.unique.email,
    password: "password",
    activated: true,
    roles: 1
  )

  created_teacher = Teacher.create!(
    account_id: account.id,
    bio: teacher["bio"],
    image_url: teacher["image_100x100"],
    experience: teacher["experience"],
    name: teacher["name"],
    job_title: teacher["job_title"]
  )
  teachers_map[teacher["id"]] = created_teacher.id
end

categories_map = {}
categories_data.each do |category|
  created_category = Category.create!(
    name: category["name"],
    description: category["description"]
  )
  categories_map[category["id"]] = created_category.id
end

levels = %w(N1 N2 N3 N4 N5)
category_ids = Category.pluck(:id)
courses_map = {}

courses_data.each do |course|
  teacher_id = teachers_map[course["teacher_id"]]
  category_id = categories_map[course["category_id"]]
  category_id ||= category_ids.sample if category_ids.any?
  description = course["objectives_summary"].join("\n")

  created_course = Course.create!(
    category_id: category_id,
    title: course["title"],
    level: levels.sample,
    description: description,
    teacher_id: teacher_id,
    image_url: course["image_url"]
  )
  courses_map[course["id"]] = created_course.id
  puts "Created course with ID #{course["id"]} and DB ID #{created_course.id}"
end

courses_data.each do |course|
  teacher_id = teachers_map[course["teacher_id"]]
  category_id = categories_map[course["category_id"]]
  category_id ||= category_ids.sample if category_ids.any?
  description = course["objectives_summary"].join("\n")

  created_course = Course.create!(
    category_id: category_id,
    title: course["title"],
    level: levels.sample,
    description: description,
    teacher_id: teacher_id,
    image_url: course["image_url"]
  )
  courses_map[course["id"]] = created_course.id
  puts "Created course with ID #{course["id"]} and DB ID #{created_course.id}"
end

# id = 1
# lectures_data.each do |course_id, lectures|
#   lectures.each_with_index do |lecture_title, index|
#     Lesson.create!(
#       course_id: id,
#       title: lecture_title,
#       content: Faker::Lorem.paragraph(sentence_count: 10),
#       video_url: "https://res.cloudinary.com/di5rvdf9r/video/upload/v1727915432/Introduction_-_Japanese_Lesson_1_ice1va.mp4"
#     )
#   end
#   id += 1
# end

id = 1
video_urls = [
  "https://res.cloudinary.com/di5rvdf9r/video/upload/v1727915432/Introduction_-_Japanese_Lesson_1_ice1va.mp4",
  "https://res.cloudinary.com/di5rvdf9r/video/upload/v1729158442/%E3%81%BF%E3%81%8B%E3%82%93_%E6%89%8B%E4%BD%9C%E3%82%8A%E3%83%8F%E3%83%B3%E3%83%90%E3%83%BC%E3%82%B0_%E7%AC%AC2%E8%A9%B1_%E3%81%82%E3%81%9F%E3%81%97%E3%83%B3%E3%81%A1NEXT_ENG_sub_dbepxy.mp4"
]

lectures_data.each do |course_id, lectures|
  lectures.each_with_index do |lecture_title, index|
    Lesson.create!(
      course_id: id,
      title: lecture_title,
      content: Faker::Lorem.paragraph(sentence_count: 10),
      video_url: video_urls[index % video_urls.size]
    )
  end
  id += 1
end

Account.create!(
  email: "admin@mail.com",
  password: "admin123",
  roles: 2
)

50.times do
  account = Account.create!(
    email: Faker::Internet.unique.email,
    password: "password",
    roles: 0,
    activated: true
  )

  account.create_user!(
    full_name: Faker::Name.name,
    bio: Faker::Lorem.paragraph(sentence_count: 2),
    goals: Faker::Lorem.paragraph(sentence_count: 2),
    image_url: "https://i.pinimg.com/1200x/ff/c2/dd/ffc2ddb4e8a9074262ca5192f8d86ee1.jpg",
    sex: User.sexes.values.sample
  )
end

CourseAssignment.create!(user: User.last, course: Course.first, assigned_at: Time.now, status: 1)
CourseAssignment.create!(user: User.last, course: Course.second, assigned_at: Time.now, status: 1)
Account.update_all(activated: 1)

require "roo"

file_path = Rails.root.join("db", "Flashcard.xlsx")
xlsx = Roo::Excelx.new(file_path)

lessons = Lesson.all
total_flashcards = xlsx.last_row - 1
flashcards_per_lesson = 10

flashcards = []
lesson_index = 0

xlsx.each_row_streaming(offset: 1) do |row|
  front_text = row[0]&.cell_value.to_s
  back_text = row[1]&.cell_value.to_s

  next if front_text.blank? || back_text.blank?

  flashcards << {
    lesson_id: lessons[lesson_index].id,
    front_text: front_text,
    back_text: back_text,
    created_at: Time.now,
    updated_at: Time.now
  }

  if flashcards.size >= flashcards_per_lesson
    Flashcard.insert_all(flashcards)
    flashcards = []
    lesson_index += 1 if lesson_index < lessons.size - 1
  end
end

Flashcard.insert_all(flashcards) if flashcards.any?

puts "Seeded flashcards into #{lessons.count} lessons!"
