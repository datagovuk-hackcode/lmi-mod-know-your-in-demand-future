Lmi::Application.routes.draw do
  resources :in_demand
  root :to => 'in_demand#index'
end
