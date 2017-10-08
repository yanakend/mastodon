# frozen_string_literal: true

module Admin
  class TwitchesController < BaseController

    def show
      @twitch = TwitchSelector.find(1)
    end

    def edit
      twitch = TwitchSelector.find(1)
      twitch.channel_name = params[:channel_name]
      twitch.save!

      Rails.cache.write('twitch_selector', twitch, expires_in: 10.minutes)
      redirect_to admin_twitch_path
    end

    private

    def filter_params
      params.permit(
        :channel_name
      )
    end
  end
end
