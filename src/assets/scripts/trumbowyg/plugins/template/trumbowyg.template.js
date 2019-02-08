(function ($) {
    'use strict';

    // Adds the language variables
    $.extend(true, $.trumbowyg, {
        langs: {
            en: {
                template: 'Template'
            },
            da: {
                template: 'Skabelon'
            },
            fr: {
                template: 'Patron'
            },
            nl: {
                template: 'Sjabloon'
            },
            ru: {
                template: 'Шаблон'
            },
            ja: {
                template: 'テンプレート'
            },
            tr: {
                template: 'Şablon'
            },
            zh_tw: {
                template: '模板',
            },
            pt_br: {
                template: 'Modelo'
            }
        }
    });

    // Adds the extra button definition
    $.extend(true, $.trumbowyg, {
        plugins: {
            template: {
                shouldInit: function (trumbowyg) {
                    return trumbowyg.o.plugins.hasOwnProperty('templates');
                },
                init: function (trumbowyg) {
                    trumbowyg.addBtnDef('template', {
                        dropdown: templateSelector(trumbowyg),
                        hasIcon: false,
                        text: trumbowyg.lang.template
                    });
                }
            }
        }
    });

    // Creates the template-selector dropdown.
    function templateSelector(trumbowyg) {
        var available = trumbowyg.o.plugins.templates;
        var templates = [];

        $.each(available, function (index, template) {
            trumbowyg.addBtnDef('template_' + index, {
                fn: function () {
                    trumbowyg.html(template.html);
                },
                hasIcon: false,
                title: template.name
            });
            templates.push('template_' + index);
        });

        return templates;
    }
})(jQuery);
