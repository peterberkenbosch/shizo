//users cart
//

window.cart = new Cart();

function address(){
  //save address
  window.cart.address = {
    first_name: $('input[name=first_name]').val(),
    last_name: $('input[name=last_name]').val(),
    address_1: $('input[name=address_1]').val(),
    address_2: $('input[name=address_2]').val(),
    city: $('input[name=city]').val(),
    state: $('input[name=state]').val(),
    country: $('select[name=country]').val()
  };

  //save the cart
  window.cart.persist();

  //get shipping rates
  $.ajax({
    type: "POST",
    url: '/shipping/estimate',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(window.cart.to_json())
  }).fail(function(e,text){
    console.log('cart estimate fail');
  }).success(function(data, text){
    window.cart.shippingEstimates = data;
    window.cart.estimatesLoaded = true;
    window.cart.cache();
    renderCheckout();

  });

  //progress checkout
  window.cart.checkout = 'delivery';
  renderCheckout();
}

function addressBack(){
  renderCart();
}

function delivery(){
  var shippingRadio = $('input[name=shipping_method]:checked');

  shippingMethod = _.findWhere(cart.shippingEstimates, {name: shippingRadio.val()});

  window.cart.shippingMethod = shippingMethod;
  window.cart.checkout = 'payment';
  window.cart.persist();
  renderCheckout();
}

function deliveryBack(){
  window.cart.checkout = 'address';
  renderCheckout();
}

function payment(){
  var p= window.cart.payment;
  if(p!==undefined && p.result!==undefined && p.result.success){
    window.cart.checkout = 'confirmation';
    renderCheckout();
  } else {
    window.cart.payment = {
      card_number: $('input[name=card_number]').val(),
      expiry: $('input[name=expiry]').val(),
      ccv: $('input[name=ccv]').val()
    };

    window.cart.persist();
    $('#payment_form').replaceWith('<p>Processing payment</p>');

    //process payment
    $.ajax({
      type: "POST",
      url: '/payment/process',
      contentType: "application/json",
      dataType: 'json',
      data: JSON.stringify(window.cart.to_json())
    }).fail(function(e,text){
      console.log('payment process failed');
    }).success(function(data, text){

      window.cart.payment.result = data;

      if(data.success){
        window.cart.checkout = 'confirmation';
      }else{
        window.cart.checkout = 'payment';
      }

      window.cart.persist();

      renderCheckout();
    });
  }
}

function paymentBack(){
  window.cart.checkout = 'delivery';
  renderCheckout();
}

function confirmation(){
  window.cart.complete();
  renderCheckout();

}

function confirmationBack(){
  window.cart.checkout = 'payment';
  renderCheckout();
}

function renderCheckout(){
  tpl = $('#co-' + cart.checkout + '-tpl').html();
  $('#cart').replaceWith(Mustache.to_html(tpl, window.cart));

  step = window.cart.checkout;
  if(step==='address') {
    var addr = window.cart.address;
    $('input[name=first_name]').val(addr.first_name);
    $('input[name=last_name]').val(addr.last_name);
    $('input[name=address_1]').val(addr.address_1);
    $('input[name=address_2]').val(addr.address_2);
    $('input[name=city]').val(addr.city);
    $('input[name=state]').val(addr.state);
    $('input[name=country]').val(addr.country);

  }else if(step==='delivery'){
    //mark selected shipping method as checked
    if(window.cart.shippingMethod!==null){
      $('input[name=shipping_method][value=' + window.cart.shippingMethod.name + ']').attr('checked', true);
    }

    //ensure at least one is selected
    var shippingRadios = $('input[name=shipping_method]');
    if(!shippingRadios.is(':checked')){
      $(shippingRadios[0]).attr('checked', true);
    }

  }else if(step==='payment'){
    var payment = window.cart.payment;

    $('input[name=card_number]').val(payment.card_number);
    $('input[name=expiry]').val(payment.expiry);
    $('input[name=ccv]').val(payment.ccv);

  }else if(step==='complete'){
    //handle complete button
    $('#cart .info #complete').click(function(evt){
      evt.preventDefault();
      renderCart();
    });
  }

  //handle back button
  $('#cart .info #back').click(function(evt){
    evt.preventDefault();

    window[cart.checkout + 'Back']();
  });

  //handle continue button
  $('#cart .info #continue').click(function(evt){
    evt.preventDefault();

    window[cart.checkout]();
    store.set('cart', cart);

  });

  wireCartDisplayHandlers();
}

function renderCart(){
  cart_template = $('#cart-tpl').html();
  $('#cart').replaceWith(Mustache.to_html(cart_template, window.cart));

  //handle delete icon
  $('#cart .info .remove').click(function(evt){
    var sku = $(this).data('sku');

    window.cart.removeLineItem(sku);

    renderCart();
  });

  //handle empyty cart
  $('#cart #empty').click(function(evt){
    evt.preventDefault();

    window.cart.clearLineItems();

    renderCart();
  });

  //handle start checkout
  $('#cart .checkout #start').click(function(evt){
    evt.preventDefault();

    renderCheckout();
  });

  wireCartDisplayHandlers();
}

function wireCartDisplayHandlers(){
  if(cart.visible){
    $('#cart .info').show();
  }else{
    $('#cart .info').hide();
  }

  //wire up show cart handler
  $('#cart .heading').click(toggleCart);

  //wire up hide cart handler
  $('#cart .closecart').click(toggleCart);

  //hide cart info when mouse leaves
  $('#cart').mouseleave(function(evt){
    if(cart.visible){
      toggleCart();
    }
  });
}

function toggleCart(evt){
  cart.visible = !cart.visible;
  $('#cart .info').toggle('slide', {direction: 'up'});

  $('#cart #arrow').toggleClass('fa-arrow-circle-down').toggleClass('fa-arrow-circle-up');
}


$(function() {
  //load cart from storage
  if(store.get('cart')!==undefined){
    cart = new Cart(store.get('cart'));
  }

  //Categories
  $.ajax({
    url: '/products/categories',
    dataType: 'json'
  }).fail(function(e,text){
    console.log('failed to get categories');
  }).success(function(data, text){
    categories_template = $('#categories-tpl').html();
    $('#category_filter').replaceWith(Mustache.to_html(categories_template, data));

    //Category Filter
    $('#categories').select2({
      placeholder: "Filter by Category",
      allowClear: true
    }).on('change', function(evt){
      //reset any waterfall messages (like no more data)
      $('#waterfall-message').remove();
      $('#waterfall-loading').remove();

      //drop all the items and reset the state
      $('#container').waterfall('removeItems', $('.item'))
        .waterfall('option', {state: {
                                isDuringAjax: false,
                                isProcessingData: false,
                                isResizing: false,
                                isPause: false,
                                curPage: 1  }});
    });

  });

  //Waterfall
  $('#container').waterfall({
    itemCls: 'item',
    colWidth: 222,
    gutterWidth: 15,
    gutterHeight: 15,
    checkImagesLoaded: false,
    isAnimated: true,
    path: function(page) {
      var url = '/products?page=' + page;
      var categories = $('#categories');

      if(categories.length===1 && categories.val()!==""){
        url += "&category=" + $('#categories').val();
      }

      return url;
    },
    callbacks: {
      renderData: function (data) {
        var template = $('#waterfall-tpl').html();

        if ( data.total < 20) {
          $('#waterfall-loading').remove();
          $('#container').waterfall('pause', function() {
            $('#waterfall-message').html('<p style="color:#666;">No more products.</p>');
          });
        }
        return Mustache.to_html(template, data).replace(/^\s*/mg, '');
      },
      loadingFinished: function(loading, isBeyondMaxPage) {

        //remove existing so we don't get duplicates later
        $('.add_to_cart').unbind('click');

        //add to cart handlers
        $('.add_to_cart').click(function(evt){
          evt.preventDefault();
          var link = $(this);
          link.effect('highlight', { color: '#BE1E2D'},2000);
          var sku = link.data('sku');
          var name = link.data('name');
          var price = parseFloat(link.data('amount'));

          window.cart.addLineItem(sku, name, price);

          renderCart();
        });
      }
    }
  });

  //render the cart
  renderCart();
});
