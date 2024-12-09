class Api::CategoriesController < Api::ApplicationController
  authorize_resource
  include Response

  def index
    categories = CategoryService.fetch_categories_with_courses

    json_response(
      message: categories,
      status: :ok
    )
  end
end
