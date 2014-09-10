Lmi::Application.routes.draw do
  
  match "/linkedins/index" => "linkedins#index"
  match "/linkedins/callback" => "linkedins#callback"

  resources :in_demand
  root :to => 'in_demand#index'
end
