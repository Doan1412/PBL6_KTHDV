require 'rails_helper'

RSpec.describe "Courses", type: :request do
  let(:user) { create(:user) }
  let(:course) { create(:course) }
  let(:headers) { { Authorization: "Bearer #{ENV['TEST_API_TOKEN']}" } }

  before do
    allow_any_instance_of(Api::ApplicationController).to receive(:current_user).and_return(user)
  end

  describe "GET /api/courses" do
    it "returns a list of courses" do
      category = create(:category)
      create_list(:course, 5, category: category)
      get api_courses_path, params: { category_id: category.id }, headers: headers
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['message']['courses'].size).to eq(5)
    end
  end

  describe "GET /api/courses/:id" do
    it "returns the course details" do
      get api_course_path(course), headers: headers
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['message']['course']).to be_present
    end

    it "returns an error when course not found" do
      get api_course_path(id: -1), headers: headers
      expect(response).to have_http_status(:not_found)
      body = JSON.parse(response.body)
      expect(body['error']).to eq("Course not found")
    end
  end

  describe "POST /api/courses/:id/assign" do
    context "when the course is not assigned" do
      it "assigns the course to the user" do
        post assign_api_course_path(course), headers: headers
        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body['message']['course_id']).to eq(course.id)
        expect(body['message']['status']).to eq('pending')
      end
    end
  end

  describe "GET /api/courses/search" do
    it "returns courses based on search parameters" do
      create_list(:course, 5, title: 'Ruby on Rails')
      get search_api_courses_path, params: { q: 'Ruby', sort: 'title' }, headers: headers
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body['message']['courses'].size).to eq(5)
    end
  end
end
