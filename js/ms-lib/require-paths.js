require.config({
    baseUrl : 'js/',
    paths : {
        // Multi Seq Libraries
        'main'                 : '../js/ms-lib/main',
        'Module'               : '../js/ms-lib/Module',
        'ms-vco'               : '../js/ms-lib/modules/audio-modules/vco',
        'ms-vca'               : '../js/ms-lib/modules/audio-modules/vca',
        'ms-envelope-gen'      : '../js/ms-lib/modules/audio-modules/envelope-gen',
        'ms-filter'            : '../js/ms-lib/modules/audio-modules/filter',
        'ms-delay'             : '../js/ms-lib/modules/audio-modules/delay',
        'ms-clock'             : '../js/ms-lib/modules/ui-modules/clock',
        'ms-keyboard'          : '../js/ms-lib/modules/ui-modules/keyboard',
        'ms-key'               : '../js/ms-lib/modules/ui-modules/key',
        'ms-sequencer'         : '../js/ms-lib/modules/ui-modules/sequencer',
        'ms-note-frequencies'  : '../js/ms-lib/models/note-frequencies',
        'ms-state'             : '../js/ms-lib/models/state',

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
