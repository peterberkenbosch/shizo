function Cart(args) {
  if(args===undefined){
    args = {};
  }
  this.visible = args.visible || false;
  this.itemCount = args.itemCount || 0;
  this.empty = (!args.empty) ? false : true;
  this.checkout = args.checkout || 'address';

  this.totals = args.totals || { item: 0, adjustment: 0, tax: 0, shipping: 0, payment: 0, order: 0 };
  this.lineItems = args.lineItems || [];
  this.address = args.address || {};
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

Cart.prototype.persist = function(){
  //update local storage
  store.set('cart', this);

  //update remote storage
  $.ajax({
    type: "POST",
    url: "/cart",
    data: this.to_json() })
  .fail(function(e,text){
    console.log('cart persist fail');
  });
};

Cart.prototype.to_json = function(){
  return { totals: this.totals,
           lineItens: this.lineItems,
           billing_address: this.address,
           shipping_address: this.address};
};
