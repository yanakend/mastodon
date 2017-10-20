# frozen_string_literal: true

class Api::V1::TwitchController < Api::BaseController
  respond_to :json

  def index
    # Get from cache
    twitch = Rails.cache.read('twitch_selector')
    unless twitch
      twitch = TwitchSelector.find(1)
      channel_id = channel_id(twitch)
      if live?(channel_id)
        conn = Faraday.new(:url => "https://api.twitch.tv/kraken/streams?game=hearthstone") do |faraday|
          faraday.request  :url_encoded
          faraday.response :logger
          faraday.adapter  Faraday.default_adapter
        end
        res = conn.get do |req|
          req.headers['Accept'] = 'application/vnd.twitchtv.v5+json'
          req.headers['Client-ID'] = ENV['TWITCH_CLIENT_ID']
        end

        body = JSON.parse(res.body)
        channel_name = body['streams'][0]['channel']['display_name']
        if channel_name
          twitch.channel_name = channel_name
          twitch.save!
        end
      end
      Rails.cache.write('twitch_selector', twitch, expires_in: 10.minutes)
    end

    render json: twitch, serializer: REST::TwitchSelectorSerializer
  end

  def channel_id(twitch)
    conn = Faraday.new(:url => "https://api.twitch.tv/kraken/users?login=" + twitch.channel_name) do |faraday|
      faraday.request  :url_encoded
      faraday.response :logger
      faraday.adapter  Faraday.default_adapter
    end
    res = conn.get do |req|
      req.headers['Accept'] = 'application/vnd.twitchtv.v5+json'
      req.headers['Client-ID'] = ENV['TWITCH_CLIENT_ID']
    end

    body = JSON.parse(res.body)
    body['users'][0]['_id']
  end


  def live?(channel_id)
    conn = Faraday.new(:url => "https://api.twitch.tv/kraken/streams/" + channel_id) do |faraday|
      faraday.request  :url_encoded
      faraday.response :logger
      faraday.adapter  Faraday.default_adapter
    end

    res = conn.get do |req|
      req.headers['Accept'] = 'application/vnd.twitchtv.v5+json'
      req.headers['Client-ID'] = ENV['TWITCH_CLIENT_ID']
    end

    body = JSON.parse(res.body)
    body['stream'] == nil
  end

end
