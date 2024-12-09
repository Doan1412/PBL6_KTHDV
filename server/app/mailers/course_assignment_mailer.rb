class CourseAssignmentMailer < ApplicationMailer
  def status_updated_email
    @course_assignment = params[:course_assignment]
    @user = @course_assignment.user
    @course = @course_assignment.course

    mail(
      to: @user.email,
      subject: "Course Assignment Status Updated"
    )
  end
end
