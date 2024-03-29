define([
    'jquery',
    'underscore',
    'backbone',
    'properties',
    'text!./detail.html',
    './list/listItem'
],
function($, _, Backbone, Properties, StudentsPanelTemplate, StudentListItemView) {

    var WaitingStudentsPanelView = Backbone.View.extend({

        apiKey: undefined,
        events: {
        },

        initialize: function (options) {
            this.template = _.template(StudentsPanelTemplate);
            this.apiKey = options.apiKey;
            return this;
        },

        render: function () {
            this.$el.html(this.template());
            var self = this;

            fetch(Properties.APIAddress + '/students/', {
                async: false,
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'api-key': this.apiKey,
                  'filter': 'verified#Equal#false'
                }
            }).then(response => response.json()).then(function(response) {
                response.content.map(student => {
                    var studentListItemView = new StudentListItemView({ model: student, apiKey: self.apiKey });
                    $('.list-waitingStudents').append(studentListItemView.render().$el);
                });
            });

            return this;
        }
    });

    return WaitingStudentsPanelView;
});
