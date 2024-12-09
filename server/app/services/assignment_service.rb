# app/services/assignment_service.rb
class AssignmentService
  def self.as_json_with_course(assignments)
    assignments.as_json(include: :course)
  end
end
