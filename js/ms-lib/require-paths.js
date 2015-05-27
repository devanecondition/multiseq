require.config({
    baseUrl : 'js/',
    paths : {
        // Multi Seq Libraries
        'main'              : '../js/ms-lib/main',
        'Module'            : '../js/ms-lib/Module',
        'AudioModule'       : '../js/ms-lib/modules/AudioModule',
        'vco'               : '../js/ms-lib/modules/audio-modules/vco',
        'vca'               : '../js/ms-lib/modules/audio-modules/vca',
        'envelope-gen'      : '../js/ms-lib/modules/audio-modules/envelope-gen',
        'filter'            : '../js/ms-lib/modules/audio-modules/filter',
        'delay'             : '../js/ms-lib/modules/audio-modules/delay',
        'UiModule'          : '../js/ms-lib/modules/UiModule',
        'clock'             : '../js/ms-lib/modules/ui-modules/clock',
        'keyboard'          : '../js/ms-lib/modules/ui-modules/keyboard',
        'key'               : '../js/ms-lib/modules/ui-modules/key',
        'sequencer'         : '../js/ms-lib/modules/ui-modules/sequencer',
        'note-frequencies'  : '../js/ms-lib/models/note-frequencies',
        'state'             : '../js/ms-lib/models/state',

        //Third Party Libraries
        'lodash'               : '../js/lib/lodash-2.1.0.min',
        'jquery' : [
             'https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
             'lib/jquery-2.1.0.min'
        ],
        'knob'                 : '../js/lib/jquery.knob',
    },
	shim: {
        'knob': {
            deps: ['jquery'],
            exports: 'knob'
        },
	}
});
