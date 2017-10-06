# frozen_string_literal: true

class TimelineController < ApplicationController
  layout 'public'

  def show
    @statuses = Status.as_public_timeline(nil, true).paginate_by_max_id(20, params[:max_id])
    @statuses = cache_collection(@statuses, Status)

    respond_to do |format|
      format.html

      format.json do
        render json: collection_presenter, serializer: ActivityPub::CollectionSerializer, adapter: ActivityPub::Adapter, content_type: 'application/activity+json'
      end
    end
  end

  private

  def collection_presenter
    ActivityPub::CollectionPresenter.new(
      id: timeline_url(),
      type: :ordered,
      size: @statuses.statuses.count,
      items: @statuses.map { |s| ActivityPub::TagManager.instance.uri_for(s) }
    )
  end
end
