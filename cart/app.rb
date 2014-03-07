require "sinatra/base"

module Shizo::Cart
  class App < Sinatra::Base

    post '/' do
      #create new order number
    end

    post '/:order_number' do
      #update existing order
    end
  end
end
