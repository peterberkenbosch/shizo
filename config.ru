require 'rubygems'
require 'bundler'

Bundler.require(:default)
require './shizo'
require "./cart/app"
require "./tax/app"
require "./promo/app"
require "./product/app"
require "./shipping/app"
require "./stock/app"
require "./user/app"
require "./payment/app"

use Rack::Static, root:  'store/public',
                  index: 'index.html'

run Rack::URLMap.new( "/"         => Rack::Directory.new( "store/public" ),
                      "/products" => Shizo::Product::App.new,
                      "/cart"     => Shizo::Cart::App.new,
                      "/tax"      => Shizo::Tax::App.new,
                      "/promo"    => Shizo::Promo::App.new,
                      "/shipping" => Shizo::Shipping::App.new,
                      "/stock"    => Shizo::Stock::App.new,
                      "/payment"  => Shizo::Payment::App.new,
                      "/user"     => Shizo::User::App.new )
