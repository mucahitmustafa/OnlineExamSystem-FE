define([
    'jquery',
    'underscore',
    'backbone',
    'properties',
    'text!./update.html'
],
function($, _, Backbone, Properties, StudentUpdateTemplate) {

    var StudentUpdateView = Backbone.View.extend({

        el: '.container',
        events: {
            "click #btn-saveStudent": "saveStudent",
            "click #btn-backToHome": "backToHome",
        },

        initialize: function (options) {
            this.template = _.template(StudentUpdateTemplate);
            this.apiKey = options.apiKey;
            this.id = options.id;
            return this;
        },

        render: function () {
            fetch(Properties.APIAddress + '/students/' + this.id, {
                async: false,
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(response => {
                this.model = response;
                this.$el.html(this.template(this.model));
                $('#alert-fillAlFields').hide();
            });
            return this;
        },

        saveStudent: function(e) {
            e.preventDefault();
            $('#alert-fillAlFields').hide();
            var number = $('#txt-number').val();
            var name = $('#txt-name').val();
            var mail = $('#txt-mail').val();
            var password = $('#txt-pass').val();

            var emptyFields = "";
            if (number.trim().length == 0) {
                emptyFields += "<br>* Number";
            }
            if (name.trim().length == 0) {
                emptyFields += "<br>* Name";
            }
            if (mail.trim().length == 0) {
                emptyFields += "<br>* Mail";
            }
            if (password.trim().length == 0) {
                emptyFields += "<br>* Password";
            }

            if (emptyFields.trim().length > 0) {
                $('#alert-fillAlFields').html('Fill in the following fields:' + emptyFields);
                $('#alert-fillAlFields').show();
                return;
            }

            var self = this;
            fetch(Properties.APIAddress + '/students/' + this.model.id, {
                async: false,
                method: 'PUT',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'api-key': this.apiKey
                },
                body: JSON.stringify({'number': number, 'name': name, 'mail': mail, 'password': password})
            }).then(self.backToHome());
        },

        backToHome: function(e) {
            this.undelegateEvents();
            if (e) e.preventDefault();
            Backbone.history.navigate('#foundation/detail', {trigger: true, replace: true});
        }
    });

    return StudentUpdateView;
});
