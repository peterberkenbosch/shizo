json.total @products.size
json.from @from

json.result @products do |product|
  json.name product.name
  json.short truncate_html(product.description, length: 200)
  json.sku product.sku
  json.bgg_rank product.bgg.score
  json.price sprintf('%.2f', product.price)
  json.categories product.categories
  if product.images
    img = product.images.detect {|img| img.type == 'original' }
    json.image "https://i.embed.ly/1/display/resize?key=246cd470a6c646d1b534bca3bf4f8804&url=#{img.url}&width=200"
    json.width img.width || 200
    json.height img.height || 'auto'
  end
end
