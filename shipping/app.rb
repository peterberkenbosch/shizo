require "sinatra/base"
require './shipping/shipping.rb'

module Shizo
  Shipping.setup do |config|
    config.add_option "FedEx Next Day" do |shipment|
      %{us, ca}.include? shipment.shipping_address.country
    end
  end

  class Shipping::App < Sinatra::Base

    get '/'  do
      'Hello, this is the shipping app.'
    end

    post '/estimate' do
      shipment = Hashie::Mash.new(params)

      quantity = shipment.items.inject(0) do |sum,item|
        sum += item.quantity.to_i
      end

      (quantity * 10).to_s
    end
  end
end
