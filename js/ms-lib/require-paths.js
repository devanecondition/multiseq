require.config({
    baseUrl : 'js/',
    paths : {

        // Multi Seq Libraries...

        // Core
        'main'              : '../js/ms-lib/main',
        'Patch'             : '../js/ms-lib/Patch',

        // Ui-Components
        'menu'              : '../js/ms-lib/ui-components/top-menu/menu',
        'menu-link'         : '../js/ms-lib/ui-components/top-menu/menu-link',
        'delete-module-btn' : '../js/ms-lib/ui-components/delete-module-btn',
        'jack'              : '../js/ms-lib/ui-components/jack',

        // Models
        'state'             : '../js/ms-lib/models/state',
        'note-frequencies'  : '../js/ms-lib/models/note-frequencies',
        'modules'           : '../js/ms-lib/models/modules',

        // Modules
        'Module'            : '../js/ms-lib/Module',
        'AudioModule'       : '../js/ms-lib/modules/AudioModule',
        'vco'               : '../js/ms-lib/modules/audio-modules/vco',
        'vca'               : '../js/ms-lib/modules/audio-modules/vca',
        'envelope-gen'      : '../js/ms-lib/modules/audio-modules/envelope-gen',
        'filter'            : '../js/ms-lib/modules/audio-modules/filter',
        'delay'             : '../js/ms-lib/modules/audio-modules/delay',
        'output'            : '../js/ms-lib/modules/audio-modules/output',
        'UiModule'          : '../js/ms-lib/modules/UiModule',
        'clock'             : '../js/ms-lib/modules/ui-modules/clock',
        'keyboard'          : '../js/ms-lib/modules/ui-modules/keyboard/keyboard',
        'key'               : '../js/ms-lib/modules/ui-modules/keyboard/key',
        'sequencer'         : '../js/ms-lib/modules/ui-modules/sequencer',

        // Third Party Libraries...
        'lodash'            : '../js/lib/lodash-2.1.0.min',
        'jquery'            : [
             'https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
             'lib/jquery-2.1.4.min'
        ],
        'knob'              : '../js/lib/jquery.knob',
    },
	shim: {
        'knob': {
            deps: ['jquery'],
            exports: 'knob'
        }
	}
});
