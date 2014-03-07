require 'rubygems'
require 'bundler'

Bundler.require(:default, :test)

require File.join(File.dirname(__FILE__), '../..', 'shipping/app.rb')
#Dir["./spec/support/**/*.rb"].each {|f| require f}

Sinatra::Base.environment = 'test'

VCR.configure do |c|
  c.cassette_library_dir = 'spec/vcr_cassettes'
  c.hook_into :webmock
end

RSpec.configure do |config|
  config.include Rack::Test::Methods
end
