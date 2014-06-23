require 'sinatra/base'

module Shizo::Tax
  class App < Sinatra::Base

    get '/'  do
      'Hello, this is the tax app.'
    end

    post '/process' do
      @object = Hashie::Mash.new JSON.parse(request.body.read)
    end
  end
end
