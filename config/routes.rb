Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'web/boards#show'
  scope module: :web do
    resource :board, only: :show
    resource :session, only: [:new, :create, :destroy]
  end
end
