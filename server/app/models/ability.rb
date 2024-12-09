class Ability
  include CanCan::Ability

  def initialize account
    account ||= Account.new(roles: :user)
    set_permissions(account)
  end

  private

  def set_permissions account
    if account.admin?
      can :manage, :all
      nil
    elsif account.teacher?
      set_teacher_permissions(account)
    elsif account.user?
      set_user_permissions(account)
    end
  end

  def set_teacher_permissions account
    can :manage, Course, teacher_id: account&.teacher&.id
    can :read, Category
    can :manage, Lesson, teacher_id: account&.teacher&.id
    can :manage, Flashcard, lesson: {teacher_id: account&.teacher&.id}
    can :read, User
    can :read, Teacher
    can :manage, Teacher, id: account&.teacher&.id
    can :manage, Account, id: account.id
    can :create, RequestCourse
    can :manage, CourseAssignment
  end

  def set_user_permissions account
    return unless account.user?

    can :manage, Course
    can :read, Lesson
    can :create, Comment, user_id: account&.user&.id
    can :manage, Follow, user_id: account&.user&.id
    can :read, Teacher
    can :read, Category
    can :manage, User, account_id: account.id
    can :manage, Account, id: account.id
  end
end
