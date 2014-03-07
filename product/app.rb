require 'sinatra/base'
require 'truncate_html'
require './shizo'

module Shizo
  class Product::App < Sinatra::Base

    # main route, shows endless scrolling product index
    # layout for product app include JS heavy cart
    #
    get '/'  do
      page = params[:page].to_i
      page = 1 if page == 0
      @from = (page * 20) - 20


      query = { from: @from,
                size: 20,
                sort: [ { score: { nested_path: 'bgg', order: 'asc'  } } ] }

      if params[:category]
        query[:filter] = { term: { categories: params[:category] } }
      end

      @products = Shizo::Product.search(query)

      content_type 'application/json'
      jbuilder :index
    end

    # used to accept product details from the hub, use utils/import_products
    # to fake hub activity.
    #
    # TODO: Needs auth, to prevent anyone posting product details
    #
    post '/sync' do
      begin
        bdy = request.body.read
        @message = Hashie::Mash.new(::JSON.parse(bdy))
      rescue Exception => e
        byebug
        halt 406
      end

      Shizo::Product.add_or_update(@message.product.id, @message.product)

      content_type 'application/json'
      jbuilder :message
    end

    private

    def truncate_html(html, options={})
      return '' if html.nil?
      html_string = TruncateHtml::HtmlString.new(html)
      TruncateHtml::HtmlTruncator.new(html_string, options).truncate
    end

  end
end
