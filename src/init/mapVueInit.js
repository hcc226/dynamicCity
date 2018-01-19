var maps = {
    'mapObj': [{
        'id': {
            'card': 'card0',
            'map': 'map0',
            'tab': 'tab0'
        },
        'visualRadius': 100,
        'nodeStayFilter': 0,
        'nodeInFilter': 0,
        'nodeOutFilter': 0,
        'edgefilter': 0,
        'maxedgefilter':300,
        'comEdgefilter':0,
        'maxComEdgefilter':2000,
        'maxWidth':10,
        'graph':{}
    }
    ],
    'stay_type': [{
        value: 'District',
        label: 'District'
    },
        {
            value: 'POI',
            label: 'POI'
        },
        {
            value: 'GRID',
            label: 'GRID'
        }],
    'stay_default': 'District',
    'travel_type': [{
        value: 'District-District',
        label: 'DD'
    },
        {
            value: 'District-POI',
            label: 'DP'
        },
        {
            value: 'POI-POI',
            label: 'PP'
        },
        {
            value: 'POI-Grid',
            label: 'PG'
        },
        {
            value: 'District-Grid',
            label: 'DG'
        },
        {
            value: 'Grid-Grid',
            label: 'GG'
        }],
    'travel_default': 'District-District',
    'years': [{
        value: 2016,
        label: 2016
    }],
    'year_default': 2016,
    'months': [{
        value: 'Jul',
        label: 'Jul'
    },
        {
            value: 'Aug',
            label: 'Aug'
        }, {
            value: 'Sep',
            label: 'Sep'
        }],
    'month_default': 'Jul',
    'weekdays': [{
        value: 'ALL',
        label: 'ALL'
    },
        {
            value: 'WORKDAY',
            label: 'WORKDAY'
        }, {
            value: 'WEEKEND',
            label: 'WEEKEND'
        }],
    'weekday_default': ' ',
    'loading': false
}

export {maps}