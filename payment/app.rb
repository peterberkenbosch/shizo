require 'sinatra/base'

module Shizo::Payment
  class App < Sinatra::Base

    get '/'  do
      'Hello, this is the payment app.'
    end

    post '/process' do
      @object = Hashie::Mash.new JSON.parse(request.body.read)
      payment = @object.order.payments.first

      result = if payment.card_number == '4111111111111111'
        { success: true,
          transaction_id: 'abc123' }
      else
        { success: false,
          error: 'Card number is invalid' }
      end

      content_type 'application/json'
      result.to_json
    end
  end
end
