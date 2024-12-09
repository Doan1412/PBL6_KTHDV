class Api::CategoriesController < Api::ApplicationController
  authorize_resource
  include Response

  def index
    categories = Category.includes(courses: :teacher).all

    json_response(
      message: categories.as_json(
        include: {
          courses: {
            include: :teacher
          }
        }
      ),
      status: :ok
    )
  end
end
