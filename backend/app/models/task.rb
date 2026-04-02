class Task < ApplicationRecord
  belongs_to :project
  belongs_to :assignee, class_name: 'User', foreign_key: 'assigned_to', optional: true

  enum :status, { pending: 0, in_progress: 1, completed: 2 }
  enum :priority, { low: 0, medium: 1, high: 2 }

  validates :title, presence: true

  def project_name
    project.name
  end
end