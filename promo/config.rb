module Shizo
  Promo.setup do |config|
    config.add_option "Buy one, get one free" do |order|

      return if order.line_items.size < 2

      discount = 0.0
      order.line_items.sort { |li| li.price.to_f }.each_slice(2) do |each_two|
        next if each_two.size == 1
        discount += each_two.last.price.to_f
      end

      discount
    end

  end
end
