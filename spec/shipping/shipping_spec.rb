require File.join(File.dirname(__FILE__), 'spec_helper.rb')

module Shizo
  describe Shipping do
    let(:app) { Shizo::Shipping::App }

    let(:shipment) { JSON.parse(IO.read File.join(File.dirname(__FILE__), '../samples/shipment.json'))}

    it 'estimates' do
      post '/estimate', shipment
      last_response.status.should == 200
      last_response.should match /30/
    end
  end
end
