module Shizo
  class Model

    def self.search(body)
      search = { index: index, type: klass, body: body }
      Hashie::Mash.new(self.es_search(search)).hits.hits.map &:_source
    end

    def self.add_or_update(id, body)
      es.index index: self.index,
               type:  self.klass,
               id:    id,
               body:  body
    end

    def self.es_search(query)
      es.search(query)
    end

    private

    def self.index
      'shizo'
    end

    def self.klass
      self.to_s.split('::').last.downcase
    end

    def self.es
      @es ||= Elasticsearch::Client.new
    end
  end
end
