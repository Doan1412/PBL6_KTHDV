require 'rails_helper'

RSpec.describe Course, type: :model do
  describe 'associations' do
    it { should belong_to(:category) }
    it { should belong_to(:teacher) }
    it { should have_many(:lessons).dependent(:destroy) }
    it { should have_many(:progresses).through(:lessons) }
    it { should have_many(:course_assignments).dependent(:destroy) }
    it { should have_many(:users).through(:course_assignments) }
  end

  describe 'scopes' do
    let!(:category) { create(:category) }
    let!(:teacher) { create(:teacher) }
    let!(:account) { create(:account) }
    let!(:course1) { create(:course, title: 'Alpha Course', created_at: 2.days.ago, category: category, teacher: teacher) }
    let!(:course2) { create(:course, title: 'Beta Course', created_at: 1.day.ago, category: category, teacher: teacher) }
    let!(:user) { create(:user) }
    let!(:course_assignment) { create(:course_assignment, course: course2, user: user) }

    it 'orders courses by created_at desc with newest scope' do
      expect(Course.newest).to eq([course2, course1])
    end

    it 'orders courses by created_at asc with oldest scope' do
      expect(Course.oldest).to eq([course1, course2])
    end

    it 'orders courses by assignment count with hot scope' do
      expect(Course.hot).to eq([course2, course1])
    end

    it 'orders courses by title with default_order scope' do
      expect(Course.default_order).to eq([course1, course2])
    end

    it 'filters courses by category with by_category scope' do
      expect(Course.by_category(category.id)).to include(course1, course2)
    end
  end

  describe 'methods' do
    let!(:teacher) { create(:teacher) }
    let(:user) { create(:user) }
    let(:course) { create(:course, teacher: teacher) }

    # Tạo các course assignments với trạng thái khác nhau
    let!(:pending_assignment) { create(:course_assignment, course: course, user: user, status: :pending) }
    let!(:accepted_assignment) { create(:course_assignment, course: course, user: user, status: :accepted) }
    let!(:rejected_assignment) { create(:course_assignment, course: course, user: user, status: :rejected) }

    describe '#pending_count' do
      it 'returns the correct count of pending assignments' do
        expect(course.pending_count).to eq(1)
      end

      it 'returns 0 if no course assignments exist' do
        empty_course = create(:course, teacher: teacher)
        expect(empty_course.pending_count).to eq(0)
      end

      it 'returns the correct count of pending assignments when there are only pending assignments' do
        pending_course = create(:course, teacher: teacher)
        create(:course_assignment, course: pending_course, user: user, status: :pending)
        create(:course_assignment, course: pending_course, user: create(:user), status: :pending)
        expect(pending_course.pending_count).to eq(2)
      end

      it 'returns correct count when assignments have mixed statuses' do
        mixed_course = create(:course, teacher: teacher)
        create(:course_assignment, course: mixed_course, user: user, status: :pending)
        create(:course_assignment, course: mixed_course, user: create(:user), status: :accepted)
        create(:course_assignment, course: mixed_course, user: create(:user), status: :rejected)
        expect(mixed_course.pending_count).to eq(1)
      end
    end

    describe '#accepted_count' do
      it 'returns the correct count of accepted assignments' do
        expect(course.accepted_count).to eq(1)
      end

      it 'returns 0 if no accepted course assignments exist' do
        empty_course = create(:course, teacher: teacher)
        expect(empty_course.accepted_count).to eq(0)
      end

      it 'returns the correct count of accepted assignments when there are only accepted assignments' do
        accepted_course = create(:course, teacher: teacher)
        create(:course_assignment, course: accepted_course, user: user, status: :accepted)
        create(:course_assignment, course: accepted_course, user: create(:user), status: :accepted)
        expect(accepted_course.accepted_count).to eq(2)
      end

      it 'returns correct count when assignments have mixed statuses' do
        mixed_course = create(:course, teacher: teacher)
        create(:course_assignment, course: mixed_course, user: user, status: :pending)
        create(:course_assignment, course: mixed_course, user: create(:user), status: :accepted)
        create(:course_assignment, course: mixed_course, user: create(:user), status: :rejected)
        expect(mixed_course.accepted_count).to eq(1)
      end
    end

    describe '#rejected_count' do
      it 'returns the correct count of rejected assignments' do
        expect(course.rejected_count).to eq(1)
      end

      it 'returns 0 if no rejected course assignments exist' do
        empty_course = create(:course, teacher: teacher)
        expect(empty_course.rejected_count).to eq(0)
      end

      it 'returns the correct count of rejected assignments when there are only rejected assignments' do
        rejected_course = create(:course, teacher: teacher)
        create(:course_assignment, course: rejected_course, user: user, status: :rejected)
        create(:course_assignment, course: rejected_course, user: create(:user), status: :rejected)
        expect(rejected_course.rejected_count).to eq(2)
      end

      it 'returns correct count when assignments have mixed statuses' do
        mixed_course = create(:course, teacher: teacher)
        create(:course_assignment, course: mixed_course, user: user, status: :pending)
        create(:course_assignment, course: mixed_course, user: create(:user), status: :accepted)
        create(:course_assignment, course: mixed_course, user: create(:user), status: :rejected)
        expect(mixed_course.rejected_count).to eq(1)
      end
    end

    describe '#assignment_for_user' do
      it 'returns the correct course assignment for a user' do
        expect(course.assignment_for_user(user)).to eq(pending_assignment)
      end

      it 'returns nil if no assignment exists for the user' do
        other_user = create(:user)
        expect(course.assignment_for_user(other_user)).to be_nil
      end
    end
  end

  describe 'class methods' do
    describe '.ransackable_attributes' do
      it 'returns the correct attributes for ransack' do
        expect(Course.ransackable_attributes).to include('title', 'level', 'description', 'created_at', 'updated_at', 'category_id', 'teacher_id')
      end
    end

    describe '.ransackable_associations' do
      it 'returns the correct associations for ransack' do
        expect(Course.ransackable_associations).to include('category', 'teacher', 'lessons', 'course_assignments')
      end
    end
  end 
end
