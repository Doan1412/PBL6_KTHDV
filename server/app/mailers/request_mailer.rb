class RequestMailer < ApplicationMailer
  def request_approved request_course
    @request_course = request_course
    mail(to: @request_course.teacher.email,
         subject: "Your Request has been Approved")
  end

  def request_rejected request_course
    @request_course = request_course
    mail(to: @request_course.teacher.email,
         subject: "Your Request has been Rejected")
  end
end
