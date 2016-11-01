YmlTranslateRails::Engine.routes.draw do

  namespace :application, path: "/" do
    get :index, path: "/"
    post :index, path: "/"
    post :export
    post :new_file
  end

  root to: "application#index"
end
