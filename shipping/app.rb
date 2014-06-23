require "sinatra/base"
require './shipping/shipping.rb'
require './shipping/config.rb'

module Shizo
  class Shipping::App < Sinatra::Base

    get '/'  do
      'Hello, this is the shipping app.'
    end

    post '/estimate' do
      @object = Hashie::Mash.new JSON.parse(request.body.read)

      estimates = []
      Shizo::Shipping.options.each do |method, option|
        if amount = Shizo::Shipping.send(method, @object['order'])
          estimates << option.merge(amount: amount, name: method)
        end
      end

      content_type 'application/json'
      estimates.to_json
    end
  end
end
