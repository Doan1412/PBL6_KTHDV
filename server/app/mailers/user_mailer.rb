class UserMailer < ApplicationMailer
  def new_course_notification
    @user = params[:user]
    @teacher = params[:teacher]
    @course = params[:course]
    mail(to: @user.email,
         subject: "New course available from a teacher you follow")
  end
end
