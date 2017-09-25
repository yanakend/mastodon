class CreateTwitchSelector < ActiveRecord::Migration[5.1]
  def change
    create_table :twitch_selectors do |t|
      t.string :channel_name, null: false
    end
  end
end
