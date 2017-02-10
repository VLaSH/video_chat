class CreateSessions < ActiveRecord::Migration[5.0]
  def change
    create_table :sessions do |t|
      t.string :uid
      t.references :initiator

      t.timestamps
    end
  end
end
