# routes
Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :projects do
        resources :tasks, only: [:create, :update, :destroy, :show]
      end
      get "tasks", to: "tasks#all_tasks"
    end
  end
end