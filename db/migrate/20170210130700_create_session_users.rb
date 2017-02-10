class CreateSessionUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :session_users do |t|
      t.references :session
      t.references :user

      t.timestamps
    end
  end
end
