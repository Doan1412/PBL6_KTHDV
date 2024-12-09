require 'rails_helper'

RSpec.describe "Api::Progress", type: :request do
  let(:user) { create(:user) }
  let(:course) { create(:course) }
  let(:lesson) { create(:lesson, course: course) }
  let(:headers) { { Authorization: "Bearer #{ENV['TEST_API_TOKEN']}" } }

  before do
    allow_any_instance_of(Api::ApplicationController).to receive(:current_user).and_return(user)
  end

  describe "POST /api/progress" do
    context "when progress has not been recorded yet" do
      it "creates a new progress" do
        post api_progress_index_path, params: { progress: { lesson_id: lesson.id, status: 'in_progress' } }, headers: headers
        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body['message']).to eq("Progress saved successfully")
      end
    end

    context "when progress has already been recorded" do
      before do
        create(:progress, user: user, lesson: lesson, status: 'in_progress')
      end

      it "returns a forbidden error" do
        post api_progress_index_path, params: { progress: { lesson_id: lesson.id, status: 'in_progress' } }, headers: headers
        expect(response).to have_http_status(:forbidden)
        body = JSON.parse(response.body)
        expect(body['error']).to eq("Your progress has been recorded")
      end
    end

    context "when invalid parameters are provided" do
      it "returns a forbidden error with validation messages" do
        post api_progress_index_path, params: { progress: { lesson_id: nil, status: 'in_progress' } }, headers: headers
        expect(response).to have_http_status(:forbidden)
        body = JSON.parse(response.body)
        expect(body['error']).not_to be_empty
      end
    end
  end

  describe "PUT /api/progress/:id" do
    context "when the progress exists" do
      let!(:progress) { create(:progress, user: user, lesson: lesson, status: 'in_progress') }

      it "updates the progress" do
        put api_progress_path(lesson.id), params: { progress: { status: 'completed' } }, headers: headers
        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body['message']['success']).to eq("Progress updated successfully")
        expect(body['message']['progress']['status']).to eq('completed')
      end
    end

    context "when the progress does not exist" do
      it "returns a not found error" do
        put api_progress_path(-1), params: { progress: { status: 'completed' } }, headers: headers
        expect(response).to have_http_status(:not_found)
        body = JSON.parse(response.body)
        expect(body['error']).to eq("Progress not found")
      end
    end
  end

  describe "GET /api/progress/myprogress" do
    context "when user has course assignments" do
      it "returns the progress data of the user" do
        get myprogress_api_progress_index_path, headers: headers
        expect(response).to have_http_status(:ok)
      end
    end
  
    context "when user has no course assignments" do
      it "returns an empty progress data" do
        get myprogress_api_progress_index_path, headers: headers
        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body['message']['progress']).to be_empty
      end
    end
  end  
end
