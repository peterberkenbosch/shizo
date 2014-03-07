require 'active_support/inflector'

module Shizo
  class Shipping
    @@options = {}

    def self.setup
      yield self
    end

    def self.add_option(name, calculator: String, &block)
      unless block_given?
        raise ArgumentError, "You must supply a block"
      end

      method_name = name.tableize.singularize.gsub(' ','_').to_sym

      @@options[method_name] = { calculator: calculator }

      define_singleton_method method_name, &block
    end
  end
end
