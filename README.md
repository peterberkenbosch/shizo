Project Shizo
=============

Overview
--------

Shizo is a proof-of-concept e-commerce implementation based on a microservice or simple SOA design.

This isn't a intended to be a fully functioning application, just a example of how an e-commerce application (like Spree) could be decoupled into several discreet services.

This example app contains no admin interface, it's design is intended to allow different applications be used to manage each distinct admin function, for example a PIM for product details, ERP for order management, etc.

All communications between services/API's is done via HTTP for now, and data is persisted using ElasticSearch (for products) and Redis (orders, users, etc).

Configuration data, such as shipping methods, payment providers, promotions, taxes, etc are expressed using code (Ruby).

For simplicity of development & deploy (on smaller scales) all services and the storefront itself are mounted inside a single [Rack config.ru](https://github.com/BDQ/shizo/blob/master/config.ru) file. In production (at scale) the intent is these components would be deployed independantly.

Components
----------

**Store:** the customer facing UI - the example here is just a single HTML page and some basic JavaScript to interact with all the service components below. No server side code is used intentionally to allow UI and user interaction be language agnostic. 

**Product:** catalogue browsing & searching - powered by ElasticSearch with product data piped in from an external source following a basic yet highly extensible JSON format.


**Cart:** handles in progress orders during checkout flow, including:
* persisting (in Redis)
* calculates taxes
* validating orders (ensure product prices are correct, stock levels, promos, etc).

**Promotion:** searches for and applies eligible promotions, validates and aplies coupon codes.

**Shipping:** provides shipping breakdowns (splits) & estimates.

**Stock:** inventory tracking.

**Payment:** payment processing.

**User:** Authentication, order history.

Data Documents
-------------

All objects are represented by a simple JSON document, each service that interacts with an object requires some basic elements within the document, but ignores all others thus allowing the document be extended to support any implementation specific requirements.

Product document - contain all product details like names, permalink, descriptions, taxons / facets, pricing etc. This can be customized to support multi-languages or currencies. 

Order document - contains all details relating to an order, like line items, addresses, payments, shipments, taxes and promotions. 


Setup
-----
1: Your machine will need the following applications installed and running:

- Elasticsearch
- Redis

```bash
$ brew install elasticseach
$ brew services start elasticsearch

$ brew install redis
$ brew services start redis
```

2: Configuring the product catalogue ElasticSearch index.

```bash
$ utils/reset_es
{"error":"IndexMissingException[[shizo] missing]","status":404}"acknowledged":true}{"acknowledged":true}
```

Note: MissingException error is expected the first time you recreate the configuration.

3: Installing gems

```bash
$ bundle install
```

4: Starting up

```bash
$ bundle exec rackup -p 9292
```

5: Importing and indexing sample products (server must be running).

```bash
$ utils/import_products
```

*NOTE:* Let the command complete (it imports 100 products, including images).


Points of interest
------------------

If you are reviewing the code, here's some interesting places to start:

- each service is contained as a seperate Sinatra app (product/app.rb, cart/app.rb, shipping/app.rb, etc).
- config.ru mounts all services plus a static sever for then storefront in a single place.
- store/public - static storefront application
    - index.html - single page app boot (includes all mustache templates)
    - js/store.js - a mess of javascript the cordinates checkout
    - js/cart.js - cart prototype used by store.js
- shipping/config.rb - shows shipping methods configured using Ruby.
- promo/config.rb - promotions as pure Ruby.
