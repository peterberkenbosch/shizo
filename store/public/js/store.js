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
    country: $('input[name=country]').val()
  };

  //set next step
  window.cart.checkout = 'delivery';
  renderCheckout();
}

function addressBack(){
  renderCart();
}

function delivery(){
  window.cart.checkout = 'payment';
  renderCheckout();
}

function deliveryBack(){
  window.cart.checkout = 'address';
  renderCheckout();
}

function payment(){
  window.cart.checkout = 'confirmation';
  renderCheckout();
}
function paymentBack(){
  window.cart.checkout = 'delivery';
  renderCheckout();
}

function confirmation(){
  window.cart.checkout = 'complete';
  renderCheckout();
}

function confirmationBack(){
  window.cart.checkout = 'payment';
  renderCheckout();
}

function complete(){
  resetCart();
  store.set('cart', undefined);
  renderCart();
}

function renderCheckout(){
  tpl = $('#co-' + cart.checkout + '-tpl').html();
  $('#cart').replaceWith(Mustache.to_html(tpl, window.cart));

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

      if($('#categories').val()!==""){
        url += "&category=" + $('#categories').val();
      }

      return url;
    },
    callbacks: {
      renderData: function (data) {
        var template = $('#waterfall-tpl').html();

        if ( data.total < 20) {
          $('#container').waterfall('pause', function() {
            $('#waterfall-message').html('<p style="color:#666;">We got\'s no more...</p>');
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

  //Category Filter
  $('#categories').select2({
    placeholder: "Filter by Category",
    allowClear: true
  }).on('change', function(evt){
    //reset any waterfall messages (like no more data)
    $('#waterfall-message').html('');

    //drop all the items and reset the state
    $('#container').waterfall('removeItems', $('.item'))
      .waterfall('option', {state: {
                              isDuringAjax: false,
                              isProcessingData: false,
                              isResizing: false,
                              isPause: false,
                              curPage: 1  }});
  });



  //render the cart
  renderCart();
});
