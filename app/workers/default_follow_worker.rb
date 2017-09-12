# frozen_string_literal: true

class DefaultFollowWorker
  include Sidekiq::Worker

  DEFAULT_FOLLOW_USERS = %w(Hearthtodon).freeze

  def perform(account_id)
    account = Account.find(account_id)
    Account.where(username: DEFAULT_FOLLOW_USERS, domain: nil).each do |default_follow_account|
      FollowService.new.call(account, default_follow_account.acct) unless account_id == default_follow_account.id
    end
  end
end
