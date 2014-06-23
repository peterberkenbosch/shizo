json.total @categories.size

json.categories @categories do |category|
  json.name  category.term
  json.count category['count']
end
