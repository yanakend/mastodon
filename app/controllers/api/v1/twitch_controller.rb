# frozen_string_literal: true

class Api::V1::TwitchController < Api::BaseController
  RESULTS_LIMIT = 5

  before_action -> { doorkeeper_authorize! :read }
  before_action :require_user!

  respond_to :json

  def live
    @search = 'asmodaitv'
    render json: @search, serializer: REST::SearchSerializer
  end

end
