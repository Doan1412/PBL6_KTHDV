class CategoryService
  def self.fetch_categories_with_courses
    Category.includes(courses: :teacher).all.as_json(
      include: {
        courses: {
          include: :teacher
        }
      }
    )
  end
end
