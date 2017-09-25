# frozen_string_literal: true

class Api::V1::TwitchController < Api::BaseController
  respond_to :json

  def index
    @channel = TwitchSelector.find(1)
    render json: @channel, serializer: REST::TwitchSelectorSerializer
  end

end
