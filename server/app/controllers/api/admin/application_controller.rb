class Api::Admin::ApplicationController < Api::ApplicationController
  authorize_resource
  before_action :admin?
end
