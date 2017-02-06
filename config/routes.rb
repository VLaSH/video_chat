Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'index#index'

  resources :users
  resources :authorizations
  resources :sessions, param: :session_uid
  resources :pings
end
