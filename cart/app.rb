require 'sinatra/base'
require 'redis'

module Shizo::Cart
  class App < Sinatra::Base

    before do
      @object = JSON.parse(request.body.read)
      @redis = Redis.new
    end

    get '/'  do
      'Hello, this is the cart app.'
    end

    post '/' do
      #create new order number
      num = "R#{rand(9999999)}"
      @redis.set(num, @object['order'])

      content_type 'application/json'
      { number: num }.to_json
    end

    post '/:order_number' do
      #update existing order
      @redis.set(params[:order_number], @object['order'])

      content_type 'application/json'
      { number: params[:order_number] }.to_json
    end
  end
end
