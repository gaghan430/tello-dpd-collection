/* 
 * @Author: Dodik Gaghan
 * @Date:   2016-02-16 11:29:36
 * @Last Modified by:   Dodik Gaghan
 * @Last Modified time: 2016-02-16 13:17:59
 */

'use strict';

var Collection = require('deployd/lib/resources/collection');
var util = require('util');
var _ = require('underscore');

function CollectionResource(name, options) {
	Collection.apply(this, arguments);
}
util.inherits(CollectionResource, Collection);

CollectionResource.dashboard = Collection.dashboard;
CollectionResource.events = _.clone(Collection.events);
Collection.prototype.clientGeneration = true;
CollectionResource.label = 'Custom Collection';
CollectionResource.defaultPath = '/collection';

CollectionResource.prototype.handle = function(ctx) {
	var cc = this;

	if (ctx.req.method == "GET" && (ctx.url === '/count' || ctx.url.indexOf('/index-of') === 0)) {
		return Collection.prototype.handle.apply(cc, arguments);
	}

	// set id if one wasnt provided in the query
	ctx.query.id = ctx.query.id || this.parseId(ctx) || (ctx.body && ctx.body.id);
	switch (ctx.req.method) {
		case 'GET':
			this.find(ctx, ctx.done);
			break;
		case 'PUT':
			if (typeof ctx.query.id != 'string' && !ctx.req.isRoot) {
				ctx.done("must provide id to update an object");
				break;
			}
			/* falls through */
		case 'POST':
			this.save(ctx, ctx.done);
			break;
		case 'DELETE':
			this.remove(ctx, ctx.done);
			break;
	}
}

module.exports = CollectionResource;