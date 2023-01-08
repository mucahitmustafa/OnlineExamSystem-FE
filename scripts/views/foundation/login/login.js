define([
    'jquery',
    'underscore',
    'backbone',
    'text!./login.html',
    'models/foundationModel',
    '../detail/detail'
],
function($, _, Backbone, FoundationLoginTemplate, FoundationModel, FoundationDetailView) {

    var FoundationLoginView = Backbone.View.extend({

        el: '.container',
        events: {
            "click #btn-apiKey": "loginFoundation"

        },

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(_.template(FoundationLoginTemplate, {} ));
        },

        loginFoundation: function(e) {
            var apiKey = $('#txt-apiKey').val();
            var foundationModel = new FoundationModel();

            var onSuccessHandler = function(collection, response, options) {
                console.log("API Key is valid. Foundation name is '", foundationModel.attributes.name, "'");
                new FoundationDetailView({model: foundationModel, apiKey: apiKey}).render();
            };
          
            var onErrorHandler = function(collection, response, options) {
                console.error('Invalid API key tried!');
                alert("Invalid API Key!");
            };

            foundationModel.fetch({
                async: false,
                headers: {'api-key': apiKey},
                error: onErrorHandler,
                success: onSuccessHandler
            })
        }

    });

    return FoundationLoginView;
});