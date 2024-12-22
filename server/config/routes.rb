Rails.application.routes.draw do
  namespace :api do
    post "auth/login", to: "authentication#login"
    post "auth/google_oauth2", to: "authentication#login_oauth_google"

    resources :courses, only: %i(show index) do
      resources :lessons, only: :index
      post "assign", on: :member
      collection do
        get "search"
      end
    end

    get "up" => "rails/health#show", as: :rails_health_check

    resource :accounts, only: %i(create) do
      collection do
        post "forgot_password"
        put "reset_password/:token", to: "accounts#reset_password"
        get "activate/:token", to: "accounts#activate", as: "activate"
      end
    end

    resources :users do
      collection do
        get "profile", to: "users#show"
        patch  "update_profile", to: "users#update"
        get "enrolled_courses", to: "users#enrolled_courses"
      end
    end

    resources :categories, only: %i(index)
    resources :teachers, only: %i(show)
    resources :flashcards, only: :create

    resources :progress, only: %i(create update) do
      collection do
        get "myprogress", to: "progress#user_progress"
      end
    end

    resources :follows, only: %i(create)
    delete "follows", to: "follows#destroy"

    namespace :admin do
      resources :users, only: %i(index)
      resources :teachers, only: %i(index destroy)
      resources :courses, only: %i(index destroy)
      get "dashboard_stats", to: "courses#dashboard_stats"
      resources :accounts do
        patch :update_status, on: :member
      end
      resources :request_courses, only: %i(index) do
        member do
          patch :update_status
        end
      end
    end

    namespace :instructor do
      resources :request_courses, only: :create
      resources :courses, only: %i(index show destroy update) do
        resources :lessons, only: %i(create index)
      end
      resources :lessons, only:  %i(destroy update show)
      resource :teachers do
        get "profile", to: "teachers#profile"
        patch "update_profile", to: "teachers#update"
      end
      get "dashboard", to: "courses#dashboard"
      resources :course_assignments, only: :index do
        member do
          patch :update_status
        end
      end
    end
  end
end
