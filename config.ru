require 'rubygems'
require 'bundler'

Bundler.require(:default)
require "./store/app"
require "./cart/app"
require "./product/app"
require "./shipping/app"
run Rack::URLMap.new("/"         => Shizo::Store::App.new,
                     "/products" => Shizo::Product::App.new,
                     "/cart"     => Shizo::Cart::App.new,
                     "/shipping" => Shizo::Shipping::App.new)
