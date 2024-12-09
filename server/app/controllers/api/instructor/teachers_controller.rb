module Api::Instructor
  class TeachersController < ApplicationController
    def profile
      teacher_profile = current_teacher.as_json(
        include: {
          account: {
            only: [:email]
          }
        }
      )
      json_response(message: {profile: teacher_profile}, status: :ok)
    end

    def update
      if current_teacher.update teacher_params
        json_response(
          message: {
            teacher: current_teacher.as_json(
              include: {
                account: {
                  only: [:email]
                }
              }
            )
          },
          status: :ok
        )
      else
        error_response(message: "Update profile failed",
                       status: :unprocessable_entity)
      end
    end

    private

    def teacher_params
      params.require(:teacher).permit(Teacher::VALID_ATTRIBUTES_PROFILE_CHANGE)
    end
  end
end
