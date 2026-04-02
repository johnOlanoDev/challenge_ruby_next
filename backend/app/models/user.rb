class User < ApplicationRecord
  has_many :projects, dependent: :destroy
  has_many :assigned_tasks, class_name: 'Task', foreign_key: 'assigned_to', dependent: :nullify
end