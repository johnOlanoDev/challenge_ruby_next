class Api::V1::TasksController < ApplicationController
  def all_tasks
    tasks = Task.includes(:project).all
    render json: tasks.as_json(
      only: [:id, :title, :status, :priority, :created_at],
      methods: [:project_name]
    )
  end

  def index
    tasks = Task.all

    if params[:status].present?
      tasks = tasks.where(status: Task.statuses[params[:status]])
    end

    if params[:priority].present?
      tasks = tasks.where(priority: Task.priorities[params[:priority]])
    end

    render json: tasks
  end
  def create
    project = Project.find(params[:project_id])
    task = project.tasks.new(task_params)

    if task.save
      render json: task, status: :created
    else
      render json: { errors: task.errors.full_messages }, status: 422
    end
  end

  def update
    task = Task.find(params[:id])
    task.update!(task_params)
    render json: task
  end

  def status
    task = Task.find(params[:id])
    task.update!(status: params[:status])
    render json: task
  end

  def destroy
    Task.find(params[:id]).destroy
    head :no_content
  end

  private

  def task_params
    params.require(:task).permit(:title, :status, :priority, :project_id)
  end
end