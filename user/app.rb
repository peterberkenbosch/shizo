require 'sinatra/base'

module Shizo::User
  class App < Sinatra::Base

    get '/'  do
      'Hello, this is the user app.'
    end

    post '/process' do
      @object = Hashie::Mash.new JSON.parse(request.body.read)
    end
  end
end
