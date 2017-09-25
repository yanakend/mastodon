# frozen_string_literal: true
# == Schema Information
#
# Table name: twitch_selectors
#
#  id           :integer          not null, primary key
#  channel_name :string           not null
#

class TwitchSelector < ApplicationRecord

  after_create  :remove_blocking_cache
  after_destroy :remove_blocking_cache

end
