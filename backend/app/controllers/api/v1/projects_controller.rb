class Api::V1::ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :update, :destroy]

  def index
    projects = Project.includes(:tasks)
    render json: projects.as_json(include: :tasks)
  end

  def create
    project = Project.new(project_params)
    if project.save
      render json: project, status: :created
    else
      render json: { errors: project.errors.full_messages }, status: 422
    end
  end

  def show
    render json: @project.as_json(include: :tasks)
  end

  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: { errors: @project.errors.full_messages }, status: 422
    end
  end

  def destroy
    @project.destroy
    head :no_content
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:name, :description)
  end
end