class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.integer :status
      t.integer :priority
      t.date :due_date
      t.references :project, null: false, foreign_key: true
      t.integer :assigned_to

      t.timestamps
    end
  end
end
