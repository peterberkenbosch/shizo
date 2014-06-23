require 'sinatra/base'
require './promo/promo.rb'
require './promo/config.rb'

module Shizo
  class Promo::App < Sinatra::Base

    get '/'  do
      'Hello, this is the promo app.'
    end

    post '/applicable' do
      @object = Hashie::Mash.new JSON.parse(request.body.read)

      promos = []
      Shizo::Promo.options.each do |method, option|
        if amount = Shizo::Promo.send(method, @object[:order])
          promos << option.merge(amount: amount, name: method)
        end
      end

      content_type 'application/json'
      promos.to_json
    end
  end
end
