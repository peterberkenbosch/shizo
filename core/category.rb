module Shizo
  class Category < Model

    def self.all
      search = { index: 'shizo',
                 type: 'product',
                 body: {
                   size: 0,
                   facets: {
                     categories: {
                       terms: {field: 'categories' }}}} }

      Hashie::Mash.new(self.es_search(search)).facets.categories.terms
    end

  end
end
