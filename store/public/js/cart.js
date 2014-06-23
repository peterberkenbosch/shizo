function Cart(args) {
  if(args===undefined){
    args = {};
  }
  this.visible = false;
  this.itemCount = args.itemCount || 0;
  this.checkout = args.checkout || 'address';

  this.number = args.number || null;
  this.totals = args.totals || { item: 0, adjustment: 0, tax: 0, shipping: 0, payment: 0, order: 0 };

  this.lineItems = args.lineItems || [];
  this.empty = (this.lineItems.length===0);

  this.address = args.address || {};

  this.shippingEstimates = args.shippingEstimates || [];
  this.estimatesLoaded = (this.shippingEstimates.length>0);

  this.shippingMethod = args.shippingMethod || null;
  this.shippingSelected = (this.shippingMethod!==null);

  this.payment = args.payment || {};

}

Cart.prototype.addLineItem = function(sku, name, amount){
  var item = _.findWhere(this.lineItems, {sku: sku});
  if(item===undefined){
    item = { sku: sku,
             count: 0,
             name: name,
             price: amount.toFixed(2)};
    this.lineItems.push(item);
  }
  item.count += 1;
  this.itemCount += 1;
  this.totals.item = (parseFloat(this.totals.item) + amount).toFixed(2);
  this.empty = false;

  this.persist();
  this.check_promos();
};

Cart.prototype.removeLineItem = function(sku){
  var item = _.findWhere(this.lineItems, {sku: sku});
  this.lineItems = _.reject(this.lineItems, function(itm){ return itm.sku === sku; });
  if(this.lineItems.length===0){
    this.empty = true;
  }

  this.itemCount -= item.count;
  amount = (parseInt(item.count,0) * parseFloat(item.price));
  this.totals.item = (parseFloat(this.totals.item) - amount).toFixed(2);

  this.persist();
};

Cart.prototype.clearLineItems = function(){
  this.itemCount = 0;
  this.totals.item = 0;
  this.lineItems = [];
  this.empty = true;
  this.persist();
};

Cart.prototype.cache = function(){
  //update local storage
  store.set('cart', this);
};

Cart.prototype.persist = function(){
  this.cache();

  var url = '/cart';
  if(this.number!==null){
    url = url + '/' + this.number;
  };

  //update remote storage
  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(this.to_json())
  }).fail(function(e,text){
    console.log('cart persist fail');
  }).success(function(data, text){
    window.cart.number = data.number;
    //ensure number is stored locally
    window.cart.cache();
  });
};

Cart.prototype.check_promos = function(){

  var url = '/promo/applicable';

  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(this.to_json())
  }).fail(function(e,text){
    console.log('check promo fail');
  }).success(function(data, text){
    console.log(data);
  });
};

Cart.prototype.complete = function(){
  this.checkout = 'complete';

  var url = '/cart/' + this.number;

  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(this.to_json())
  }).fail(function(e,text){
    console.log('cart persist fail');
  }).success(function(data, text){
    console.log('order completed');

    //reset
    window.cart = new Cart();
    window.cart.cache();
  });
};

Cart.prototype.to_json = function(){
  return { order: {
             number:       this.number,
             status:       this.checkout,
             totals:       this.totals,
             line_items:       this.lineItems,
             billing_address:  this.address,
             shipping_address: this.address,
             shipping_method:  this.shippingMethod,
             payments:         [ this.payment ]} };
};
