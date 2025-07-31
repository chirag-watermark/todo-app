Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check


  namespace :api do
    namespace :v1 do 
      post "login", to: "authentications#login"
      post "register", to: "authentications#register"
      patch "users/:id", to: "authentications#update"
      delete "users/:id", to: "authentications#destroy"
      resources :todos, only: [:index, :show, :create, :update, :destroy]
    end 
  end

  # Defines the root path route ("/")
  root "authentications#login"
end
