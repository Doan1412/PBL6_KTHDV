require 'rails_helper'

RSpec.describe "Api::Lessons", type: :request do
  let(:user) { create(:user) }
  let(:course) { create(:course) }
  let(:lesson) { create(:lesson, course: course) }
  let(:headers) { { Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImFjY291bnQiOjYyfX0.RAHhb5RR5CXRzJZX6Ne33mTK6KzuphI-h8AaCgzFpMM" } }

  before do
    allow_any_instance_of(Api::ApplicationController).to receive(:current_user).and_return(user)
  end

  describe "GET /api/courses/:course_id/lessons" do
    context "when user is registered and accepted in the course" do
      before do
        create(:course_assignment, user: user, course: course, status: :accepted)
      end

      it "returns a list of lessons" do
        create(:lesson, course: course)
        create(:lesson, course: course)
        get api_course_lessons_path(course.id), headers: headers
        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body['message']['lessons'].size).to eq(2)
      end
    end

    context "when the user has not registered for the course" do
      it "returns a not found error" do
        get api_course_lessons_path(course.id), headers: headers
        expect(response).to have_http_status(:not_found)
        body = JSON.parse(response.body)
        expect(body['error']).to eq("You have not registered for this course or it is having an error.")
      end
    end

    context "when the user is registered but not accepted for the course" do
      before do
        create(:course_assignment, user: user, course: course, status: :pending)
      end

      it "returns a forbidden error" do
        get api_course_lessons_path(course.id), headers: headers
        expect(response).to have_http_status(:forbidden)
        body = JSON.parse(response.body)
        expect(body['error']).to eq("You have not been accepted for this course.")
      end
    end

    context "when course does not exist" do
      it "returns a not found error" do
        get api_course_lessons_path(course_id: -1), headers: headers
        expect(response).to have_http_status(:not_found)
        body = JSON.parse(response.body)
        expect(body['error']).to eq("Course not found")
      end
    end
  end
end
