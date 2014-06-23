source 'https://rubygems.org'

gem 'sinatra'
gem 'elasticsearch'
gem 'redis'
gem 'json'
gem 'hashie'
gem 'moneta'
gem 'tilt-jbuilder', require: 'sinatra/jbuilder'
gem 'truncate_html', github: 'hgmnz/truncate_html'
gem 'dimensions'

gem 'byebug'

group :test do
  gem 'vcr'
  gem 'rspec'
  gem 'webmock', '1.15'
  gem 'rack-test'
end

group :production do
  gem 'foreman'
  gem 'unicorn'
end
