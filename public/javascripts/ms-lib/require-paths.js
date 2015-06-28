require.config({
    baseUrl : 'javascripts/',
    paths : {

        // Multi Seq Libraries...

        // Core
        'main'              : '../javascripts/ms-lib/main',
        'Patch'             : '../javascripts/ms-lib/Patch',

        // Ui-Components
        'menu'              : '../javascripts/ms-lib/ui-components/top-menu/menu',
        'menu-link'         : '../javascripts/ms-lib/ui-components/top-menu/menu-link',
        'delete-module-btn' : '../javascripts/ms-lib/ui-components/delete-module-btn',
        'jack'              : '../javascripts/ms-lib/ui-components/jack',

        // Models
        'state'             : '../javascripts/ms-lib/models/state',
        'note-frequencies'  : '../javascripts/ms-lib/models/note-frequencies',
        'modules'           : '../javascripts/ms-lib/models/modules',

        // Modules
        'Module'            : '../javascripts/ms-lib/Module',
        'AudioModule'       : '../javascripts/ms-lib/modules/AudioModule',
        'empty'             : '../javascripts/ms-lib/modules/empty',
        'vco'               : '../javascripts/ms-lib/modules/audio-modules/vco',
        'vca'               : '../javascripts/ms-lib/modules/audio-modules/vca',
        'lfo'               : '../javascripts/ms-lib/modules/audio-modules/lfo',
        'envelope-generator': '../javascripts/ms-lib/modules/audio-modules/envelope-gen',
        'filter'            : '../javascripts/ms-lib/modules/audio-modules/filter',
        'delay'             : '../javascripts/ms-lib/modules/audio-modules/delay',
        'output'            : '../javascripts/ms-lib/modules/audio-modules/output',
        'UiModule'          : '../javascripts/ms-lib/modules/UiModule',
        'clock'             : '../javascripts/ms-lib/modules/ui-modules/clock',
        'keyboard'          : '../javascripts/ms-lib/modules/ui-modules/keyboard/keyboard',
        'key'               : '../javascripts/ms-lib/modules/ui-modules/keyboard/key',
        'sequencer'         : '../javascripts/ms-lib/modules/ui-modules/sequencer',

        // Third Party Libraries...
        'lodash'            : '../javascripts/lib/lodash-2.1.0.min',
        'jquery'            : [
             'https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
             'lib/jquery-2.1.4.min'
        ],
        'jquery-ui'         : '../javascripts/lib/jquery-ui.min',
        'jsPlumb'           : '../javascripts/lib/dom.jsPlumb-1.7.5-min',
        'knob'              : '../javascripts/lib/jquery.knob',
    },
	shim: {
        'jquery' : {
            exports: '$'
        },
        'jquery-ui' : {
            deps: ['jquery'],
            exports: '$'
        },
        'jsPlumb' : {
            deps: ['jquery'],
            exports: 'jsPlumb'
        },
        'knob': {
            deps: ['jquery'],
            exports: 'knob'
        }
	}
});
