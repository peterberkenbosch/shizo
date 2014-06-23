require 'sinatra/base'

module Shizo::Stock
  class App < Sinatra::Base

    get '/'  do
      'Hello, this is the stock app.'
    end

    post '/process' do
      @object = Hashie::Mash.new JSON.parse(request.body.read)
    end
  end
end
