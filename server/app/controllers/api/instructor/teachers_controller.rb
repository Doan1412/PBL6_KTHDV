module Api::Instructor
  class TeachersController < ApplicationController
    def profile
      teacher_service = TeacherService.new(current_teacher, current_user)
      teacher_profile = teacher_service.teacher_profile

      json_response(message: { profile: teacher_profile }, status: :ok)
    end

    def update
      teacher_service = TeacherService.new(current_teacher, current_user)

      if teacher_service.update_teacher_profile(teacher_params)
        updated_teacher = current_teacher.as_json(
          include: {
            account: { only: [:email] }
          }
        )

        json_response(message: { teacher: updated_teacher }, status: :ok)
      else
        error_response(message: "Update profile failed", status: :unprocessable_entity)
      end
    end

    private

    def teacher_params
      params.require(:teacher).permit(Teacher::VALID_ATTRIBUTES_PROFILE_CHANGE)
    end
  end
end
