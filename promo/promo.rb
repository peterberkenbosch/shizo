require 'active_support/inflector'

module Shizo
  class Promo
    @@options = {}

    def self.options
      @@options
    end

    def self.setup
      yield self
    end

    def self.add_option(name, &block)
      unless block_given?
        raise ArgumentError, "You must supply a block"
      end

      method_name = name.tableize.singularize.gsub(' ','_').to_sym

      @@options[method_name] = { display: name }

      define_singleton_method method_name, &block
    end
  end
end
