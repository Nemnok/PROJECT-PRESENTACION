/**
 * ============================================================================
 * CONFIGURACIÓN DE RUTAS - TRANSPORTE COMPÁS
 * Fuente: Nemnok/transporte_la_esperanza
 * ============================================================================
 */

const MAP_CONFIG = {
    center: [28.2916, -16.6291],
    defaultZoom: 10,
    maxZoom: 18
};

const ROUTE_COLORS = {
    1: '#2196f3',
    2: '#f44336',
    3: '#4caf50',
    4: '#ff9800',
    5: '#9c27b0',
    6: '#00bcd4',
    7: '#e91e63',
    8: '#795548'
};

const SPECIAL_POINTS = {
    santaCruzIntercambiador: {
        name: 'Santa Cruz – Intercambiador Carnaval',
        coords: [28.4636, -16.2518],
        icon: '🎭',
        description: 'Punto de llegada de todas las líneas - Centro neurálgico del Carnaval'
    },
    compas: {
        name: 'Compás',
        coords: [28.4120, -16.3800],
        icon: '🏠',
        description: 'Base de Transporte Ecológico Compás - Destino final rutas de vuelta'
    }
};

const ROUTES_DATA = {
    1: {
        id: 1,
        name: 'Línea 1: Sur',
        shortName: 'Sur',
        description: 'Costa Adeje → Playa de las Américas → Los Cristianos',
        buses: '3 guaguas grandes',
        busIcon: '🧭',
        objective: 'Recoger la mayor densidad de turistas del sur',
        stops: [
            { name: 'Costa Adeje – Hotel Bahía del Duque',         coords: [28.0892, -16.7365] },
            { name: 'Costa Adeje – Playa del Duque',               coords: [28.0850, -16.7380] },
            { name: 'Playa de las Américas – Siam Mall',           coords: [28.0650, -16.7250] },
            { name: 'Playa de las Américas – Zona hotel H10',      coords: [28.0580, -16.7200] },
            { name: 'Los Cristianos – Puerto',                     coords: [28.0520, -16.7150] },
            { name: 'Los Cristianos – Av. Juan Carlos I',          coords: [28.0500, -16.7100] }
        ],
        returnStops: 'Santa Cruz → Los Cristianos → Playa de las Américas → Costa Adeje → Compás'
    },
    2: {
        id: 2,
        name: 'Línea 2: Sur-Oeste',
        shortName: 'Sur-Oeste',
        description: 'Callao Salvaje → Los Gigantes → Masca',
        buses: '2 grandes + 1 mini',
        busIcon: '🧭',
        stops: [
            { name: 'Callao Salvaje – Estación central',           coords: [28.1286, -16.7890] },
            { name: 'Playa de la Arena – Zona hotelera',           coords: [28.1850, -16.8150] },
            { name: 'Santiago del Teide – Casco urbano',           coords: [28.2920, -16.8140] },
            { name: 'Masca – Mirador',                             coords: [28.3060, -16.8420] },
            { name: 'Los Gigantes – Puerto y hotel acantilados',   coords: [28.2450, -16.8420] }
        ],
        returnStops: 'Santa Cruz → Los Gigantes → Masca → Santiago del Teide → Playa de la Arena → Callao Salvaje → Compás'
    },
    3: {
        id: 3,
        name: 'Línea 3: Norte',
        shortName: 'Norte',
        description: 'Puerto de la Cruz → La Orotava → Icod → Garachico',
        buses: '2 guaguas grandes',
        busIcon: '🧭',
        stops: [
            { name: 'Puerto de la Cruz – Lago Martiánez',          coords: [28.4150, -16.5450] },
            { name: 'La Orotava – Casco histórico',                coords: [28.3900, -16.5230] },
            { name: 'Santa Bárbara – Centro urbano',               coords: [28.3650, -16.5100] },
            { name: 'Icod de los Vinos – Parque del Drago',        coords: [28.3670, -16.7180] },
            { name: 'Garachico – Plaza central',                   coords: [28.3720, -16.7640] }
        ],
        returnStops: 'Santa Cruz → Garachico → Icod → Santa Bárbara → La Orotava → Puerto de la Cruz → Compás'
    },
    4: {
        id: 4,
        name: 'Línea 4: Metropolitana',
        shortName: 'Metropolitana',
        description: 'La Laguna → Taco → Tabaiba',
        buses: '2 mini guaguas',
        busIcon: '🚐',
        stops: [
            { name: 'La Laguna – Estación central',                coords: [28.4867, -16.3150] },
            { name: 'Taco – Zona comercial',                       coords: [28.4700, -16.2900] },
            { name: 'Tabaiba – Zona hotelera',                     coords: [28.4350, -16.3450] }
        ],
        returnStops: 'Santa Cruz → Tabaiba → Taco → La Laguna → Compás'
    },
    5: {
        id: 5,
        name: 'Línea 5: Sur-Interior',
        shortName: 'Sur-Interior',
        description: 'Arona → Chayofa → Adeje (hoteles alejados)',
        buses: '1 mini guagua',
        busIcon: '🚐',
        stops: [
            { name: 'Arona – Casco urbano',                        coords: [28.0990, -16.6810] },
            { name: 'Chayofa – Zona hotelera',                     coords: [28.0720, -16.6950] },
            { name: 'Adeje – Playa del Duque',                     coords: [28.0850, -16.7380] }
        ],
        returnStops: 'Santa Cruz → Adeje → Chayofa → Arona → Compás'
    },
    6: {
        id: 6,
        name: 'Línea 6: Norte-Interior',
        shortName: 'Norte-Interior',
        description: 'Buenavista → La Guancha → Icod',
        buses: '1 mini guagua',
        busIcon: '🚐',
        stops: [
            { name: 'Buenavista – Mirador / Zona turística',       coords: [28.3730, -16.8520] },
            { name: 'La Guancha – Centro urbano',                  coords: [28.3710, -16.6490] },
            { name: 'Icod – Parque del Drago',                     coords: [28.3670, -16.7180] }
        ],
        returnStops: 'Santa Cruz → Icod → La Guancha → Buenavista → Compás'
    },
    7: {
        id: 7,
        name: 'Línea 7: Este',
        shortName: 'Este',
        description: 'Candelaria → Güímar → Fasnia',
        buses: '1 mini guagua',
        busIcon: '🚐',
        stops: [
            { name: 'Candelaria – Basílica',                       coords: [28.3540, -16.3720] },
            { name: 'Güímar – Pirámides / Centro urbano',          coords: [28.3170, -16.4120] },
            { name: 'Fasnia – Núcleo turístico',                   coords: [28.2350, -16.4350] }
        ],
        returnStops: 'Santa Cruz → Fasnia → Güímar → Candelaria → Compás'
    },
    8: {
        id: 8,
        name: 'Línea 8: Exprés y Apoyo',
        shortName: 'Exprés',
        description: 'Rutas flexibles según demanda',
        buses: '2 mini guaguas',
        busIcon: '🚐',
        isExpress: true,
        stops: [
            { name: 'Playa de las Américas',                       coords: [28.0650, -16.7250] },
            { name: 'Los Cristianos',                              coords: [28.0520, -16.7150] },
            { name: 'Costa Adeje',                                 coords: [28.0850, -16.7380] },
            { name: 'Puerto de la Cruz',                           coords: [28.4150, -16.5450] },
            { name: 'La Orotava',                                  coords: [28.3900, -16.5230] },
            { name: 'Masca',                                       coords: [28.3060, -16.8420] },
            { name: 'Los Gigantes',                                coords: [28.2450, -16.8420] }
        ],
        returnStops: 'Rutas flexibles según demanda'
    }
};

function getRoutesData()   { return ROUTES_DATA; }
function getRouteById(id)  { return ROUTES_DATA[id]; }
function getRouteColor(id) { return ROUTE_COLORS[id] || '#666666'; }
function getMapConfig()    { return MAP_CONFIG; }
function getSpecialPoints(){ return SPECIAL_POINTS; }

function getStopsWithIntercambiador(routeId) {
    const route = ROUTES_DATA[routeId];
    if (!route) return [];
    const stops = [...route.stops];
    const lastStop = stops[stops.length - 1];
    if (!lastStop || !lastStop.name.includes('Intercambiador')) {
        stops.push({
            name: SPECIAL_POINTS.santaCruzIntercambiador.name,
            coords: SPECIAL_POINTS.santaCruzIntercambiador.coords
        });
    }
    return stops;
}

function getNextRouteId() {
    const ids = Object.keys(ROUTES_DATA).map(Number);
    return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

function listAllRoutes() {
    return Object.values(ROUTES_DATA).map(r => ({ id: r.id, name: r.name, stops: r.stops.length, buses: r.buses }));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ROUTES_DATA, ROUTE_COLORS, MAP_CONFIG, SPECIAL_POINTS,
        getRoutesData, getRouteById, getRouteColor, getMapConfig, getSpecialPoints,
        getStopsWithIntercambiador, getNextRouteId, listAllRoutes };
}
