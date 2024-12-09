class FollowService
  def self.create_follow(user, teacher)
    user.follows.new(teacher: teacher)
  end

  def self.destroy_follow(user, teacher)
    user.follows.find_by(teacher: teacher)
  end
end
