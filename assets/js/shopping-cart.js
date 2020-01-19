$(document).ready(function() {
    
    /* ======= Shopping cart application ======== */
    /* Ref: http://stackoverflow.com/questions/7970389/ios-5-fixed-positioning-and-virtual-keyboard */
    
    Ecwid.OnAPILoaded.add(function() {
        // Get the shopping cart and item count elements.
        var cart = $('#savvy-cart');
        var itemCount = cart.find('#item-count');

        cart.on('click', function() {
            location.hash = '!/~/cart';
        });

        Ecwid.Cart.get(function(cart) {
            itemCount.html(cart.productsQuantity);
        });

        Ecwid.OnCartChanged.add(function(cart) {
            itemCount.html(cart.productsQuantity);
        });

        Ecwid.OnOrderPlaced.add(function(order) {
            var data;
            order.items.forEach(function(item) {
                if(item.options.Date) {
                  data = {
                    name: order.customer.name,
                    email: order.customer.email,
                    phone: order.billingPerson.phone,
                    count: item.quantity,
                    date: item.options.Date
                  };

                  $.ajax({
                    url: 'scripts/workshop.php',
                    cache: false,
                    dataType: 'text',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    type: 'POST'
                  }).done(function(id) {
                    console.log('Workshop was saved', id);
                  }).fail(function(response) {
                    console.error('Failed update database', response);
                    $.ajax({
                      url: 'scripts/error.php',
                      cache: false,
                      dataType: 'text',
                      contentType: 'application/json',
                      data: JSON.stringify(data),
                      type: 'POST'
                    }).done(function() {
                      console.log('Error Message Sent');
                    }).fail(function(response) {
                      console.error('Error Message Failed');
                    });
                  });
                }
             });
        });
    });
});



