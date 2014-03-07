require "sinatra/base"
require 'elasticsearch'
require './shizo'

module Shizo::Store
  class App < Sinatra::Base
    get '/' do
      erb :index
    end
  end
end
