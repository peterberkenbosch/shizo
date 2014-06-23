module Shizo
  Shipping.setup do |config|
    config.add_option "FedEx Next Day" do |order|
      return nil unless %{us, ca}.include?(order.shipping_address.country.downcase)
      20.00
    end

    config.add_option "FedEx Two Day" do |order|
      return nil unless %{us, ca}.include?(order.shipping_address.country.downcase)
      10.00
    end


    config.add_option "FedEx International" do |order|
      return nil unless %{ie}.include?(order.shipping_address.country.downcase)
      30.00
    end
  end
end
