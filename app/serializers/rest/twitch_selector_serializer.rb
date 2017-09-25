# frozen_string_literal: true

class REST::TwitchSelectorSerializer < ActiveModel::Serializer
  include RoutingHelper

  attributes :channel_name

end

