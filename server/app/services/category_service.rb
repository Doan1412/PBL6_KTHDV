class CategoryService
  def self.fetch_categories_with_courses
    categories = Category.includes(courses: :teacher).all
    
    categories_with_ratings = format_categories_with_ratings(categories)

    return categories_with_ratings
  end

  private

  def self.format_categories_with_ratings categories
    categories.map do |category|
      category.as_json(
        include: {
          courses: {
            include: :teacher,
            methods: :average_rating
          }
        }
      )
    end
  end
end
