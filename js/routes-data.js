/**
 * ============================================================================
 * CONFIGURACIÓN DE RUTAS - TRANSPORTE COMPÁS
 * ============================================================================
 * 
 * Este archivo contiene toda la configuración de las rutas de autobús.
 * Para modificar una ruta, simplemente edite las coordenadas y nombres de paradas.
 * 
 * FORMATO DE COORDENADAS: [latitud, longitud]
 * - Latitud: valores positivos = Norte, negativos = Sur
 * - Longitud: valores negativos = Oeste (Tenerife está en el Oeste)
 * 
 * EJEMPLO: Puerto de la Cruz está en [28.4150, -16.5450]
 * 
 * HERRAMIENTAS ÚTILES PARA OBTENER COORDENADAS:
 * - Google Maps: Click derecho en el mapa → "¿Qué hay aquí?" → Copiar coordenadas
 * - OpenStreetMap: https://www.openstreetmap.org (las coordenadas aparecen en la URL)
 * 
 * ============================================================================
 * 
 * CÓMO AGREGAR UNA NUEVA LÍNEA:
 * 
 * 1. Copie la plantilla de abajo y péguela en la sección ROUTES_DATA
 * 2. Cambie el ID del número (ej: 9, 10, 11...)
 * 3. Configure los datos de la línea
 * 4. Añada el color en ROUTE_COLORS
 * 5. Guarde el archivo y recargue la página
 * 
 * PLANTILLA PARA NUEVA LÍNEA:
 * 
 * 9: {
 *     id: 9,
 *     name: 'Línea 9: Nombre de la Línea',
 *     shortName: 'NombreCorto',
 *     description: 'Origen → Destino',
 *     buses: '1 guagua grande',
 *     busIcon: '🧭',  // Use 🧭 para grande, 🚐 para mini
 *     objective: 'Descripción del objetivo de la línea',
 *     stops: [
 *         { name: 'Primera Parada', coords: [28.XXXX, -16.XXXX] },
 *         { name: 'Segunda Parada', coords: [28.XXXX, -16.XXXX] },
 *         // ... más paradas
 *     ],
 *     returnStops: 'Santa Cruz → Parada2 → Parada1 → Compás'
 * },
 * 
 * ============================================================================
 */

// Configuración del mapa
const MAP_CONFIG = {
    // Centro del mapa (Tenerife)
    center: [28.2916, -16.6291],
    // Nivel de zoom inicial (10 = vista de toda la isla)
    defaultZoom: 10,
    // Zoom máximo permitido
    maxZoom: 18
};

// Colores de las rutas (puedes cambiarlos según tu preferencia)
const ROUTE_COLORS = {
    1: '#2196f3',  // Azul - Línea Sur
    2: '#f44336',  // Rojo - Línea Sur-Oeste
    3: '#4caf50',  // Verde - Línea Norte
    4: '#ff9800',  // Naranja - Línea Metropolitana
    5: '#9c27b0',  // Púrpura - Línea Sur-Interior
    6: '#00bcd4',  // Cian - Línea Norte-Interior
    7: '#e91e63',  // Rosa - Línea Este
    8: '#795548'   // Marrón - Línea Exprés
};

// Puntos especiales (destinos comunes)
const SPECIAL_POINTS = {
    // Intercambiador de Carnaval - Punto de llegada de todas las líneas
    santaCruzIntercambiador: {
        name: 'Santa Cruz – Intercambiador Carnaval',
        coords: [28.4636, -16.2518],
        icon: '🎭',
        description: 'Punto de llegada de todas las líneas - Centro neurálgico del Carnaval'
    },
    // Compás - Destino final de rutas de vuelta
    compas: {
        name: 'Compás',
        coords: [28.4120, -16.3800],
        icon: '🏠',
        description: 'Base de Transporte Ecológico Compás - Destino final rutas de vuelta'
    }
};

/**
 * ============================================================================
 * DATOS DE RUTAS
 * ============================================================================
 * 
 * Cada ruta tiene:
 * - id: Número identificador de la línea
 * - name: Nombre de la línea
 * - shortName: Nombre corto para la leyenda
 * - description: Descripción de la ruta
 * - buses: Número y tipo de guaguas asignadas
 * - objective: Objetivo de la línea (opcional)
 * - stops: Array de paradas con nombre y coordenadas [lat, lng]
 * - returnStops: Descripción de las paradas de vuelta (texto)
 * - isExpress: true si es línea exprés con ruta punteada (opcional)
 * 
 * PARA AGREGAR UNA NUEVA PARADA:
 * 1. Obtén las coordenadas del lugar (Google Maps, OpenStreetMap, etc.)
 * 2. Añade un objeto { name: 'Nombre de la parada', coords: [latitud, longitud] }
 * 3. Guarda el archivo y recarga la página
 * 
 * ============================================================================
 */

const ROUTES_DATA = {
    // =========================================================================
    // LÍNEA 1: SUR - Costa Adeje / Playa de las Américas / Los Cristianos
    // =========================================================================
    1: {
        id: 1,
        name: 'Línea 1: Sur',
        shortName: 'Sur',
        description: 'Costa Adeje → Playa de las Américas → Los Cristianos',
        buses: '3 guaguas grandes',
        busIcon: '🧭',
        objective: 'Recoger la mayor densidad de turistas del sur',
        stops: [
            { 
                name: 'Costa Adeje – Hotel Bahía del Duque', 
                coords: [28.0892, -16.7365] 
            },
            { 
                name: 'Costa Adeje – Playa del Duque', 
                coords: [28.0850, -16.7380] 
            },
            { 
                name: 'Playa de las Américas – Siam Mall / Centro comercial', 
                coords: [28.0650, -16.7250] 
            },
            { 
                name: 'Playa de las Américas – Zona hotel H10 Tenerife', 
                coords: [28.0580, -16.7200] 
            },
            { 
                name: 'Los Cristianos – Puerto', 
                coords: [28.0520, -16.7150] 
            },
            { 
                name: 'Los Cristianos – Av. Juan Carlos I', 
                coords: [28.0500, -16.7100] 
            },
            // La última parada siempre es el Intercambiador (se añade automáticamente)
        ],
        returnStops: 'Santa Cruz → Los Cristianos → Playa de las Américas → Costa Adeje → Compás'
    },

    // =========================================================================
    // LÍNEA 2: SUR-OESTE - Callao Salvaje / Los Gigantes / Masca
    // =========================================================================
    2: {
        id: 2,
        name: 'Línea 2: Sur-Oeste',
        shortName: 'Sur-Oeste',
        description: 'Callao Salvaje → Los Gigantes → Masca',
        buses: '2 grandes + 1 mini',
        busIcon: '🧭',
        stops: [
            { 
                name: 'Callao Salvaje – Estación central', 
                coords: [28.1286, -16.7890] 
            },
            { 
                name: 'Playa de la Arena – Zona hotelera', 
                coords: [28.1850, -16.8150] 
            },
            { 
                name: 'Santiago del Teide – Casco urbano', 
                coords: [28.2920, -16.8140] 
            },
            { 
                name: 'Masca – Mirador', 
                coords: [28.3060, -16.8420] 
            },
            { 
                name: 'Los Gigantes – Puerto y hotel acantilados', 
                coords: [28.2450, -16.8420] 
            },
        ],
        returnStops: 'Santa Cruz → Los Gigantes → Masca → Santiago del Teide → Playa de la Arena → Callao Salvaje → Compás'
    },

    // =========================================================================
    // LÍNEA 3: NORTE - Puerto de la Cruz / La Orotava / Icod / Garachico
    // =========================================================================
    3: {
        id: 3,
        name: 'Línea 3: Norte',
        shortName: 'Norte',
        description: 'Puerto de la Cruz → La Orotava → Icod → Garachico',
        buses: '2 guaguas grandes',
        busIcon: '🧭',
        stops: [
            { 
                name: 'Puerto de la Cruz – Lago Martiánez', 
                coords: [28.4150, -16.5450] 
            },
            { 
                name: 'La Orotava – Casco histórico', 
                coords: [28.3900, -16.5230] 
            },
            { 
                name: 'Santa Bárbara – Centro urbano', 
                coords: [28.3650, -16.5100] 
            },
            { 
                name: 'Icod de los Vinos – Parque del Drago', 
                coords: [28.3670, -16.7180] 
            },
            { 
                name: 'Garachico – Plaza central', 
                coords: [28.3720, -16.7640] 
            },
        ],
        returnStops: 'Santa Cruz → Garachico → Icod → Santa Bárbara → La Orotava → Puerto de la Cruz → Compás'
    },

    // =========================================================================
    // LÍNEA 4: METROPOLITANA - La Laguna / Taco / Tabaiba
    // =========================================================================
    4: {
        id: 4,
        name: 'Línea 4: Metropolitana',
        shortName: 'Metropolitana',
        description: 'La Laguna → Taco → Tabaiba',
        buses: '2 mini guaguas',
        busIcon: '🚐',
        stops: [
            { 
                name: 'La Laguna – Estación central', 
                coords: [28.4867, -16.3150] 
            },
            { 
                name: 'Taco – Zona comercial', 
                coords: [28.4700, -16.2900] 
            },
            { 
                name: 'Tabaiba – Zona hotelera', 
                coords: [28.4350, -16.3450] 
            },
        ],
        returnStops: 'Santa Cruz → Tabaiba → Taco → La Laguna → Compás'
    },

    // =========================================================================
    // LÍNEA 5: SUR-INTERIOR - Arona / Chayofa / Adeje
    // =========================================================================
    5: {
        id: 5,
        name: 'Línea 5: Sur-Interior',
        shortName: 'Sur-Interior',
        description: 'Arona → Chayofa → Adeje (hoteles alejados)',
        buses: '1 mini guagua',
        busIcon: '🚐',
        stops: [
            { 
                name: 'Arona – Casco urbano', 
                coords: [28.0990, -16.6810] 
            },
            { 
                name: 'Chayofa – Zona hotelera', 
                coords: [28.0720, -16.6950] 
            },
            { 
                name: 'Adeje – Playa del Duque', 
                coords: [28.0850, -16.7380] 
            },
        ],
        returnStops: 'Santa Cruz → Adeje → Chayofa → Arona → Compás'
    },

    // =========================================================================
    // LÍNEA 6: NORTE-INTERIOR - Buenavista / La Guancha / Icod
    // =========================================================================
    6: {
        id: 6,
        name: 'Línea 6: Norte-Interior',
        shortName: 'Norte-Interior',
        description: 'Buenavista → La Guancha → Icod',
        buses: '1 mini guagua',
        busIcon: '🚐',
        stops: [
            { 
                name: 'Buenavista – Mirador / Zona turística', 
                coords: [28.3730, -16.8520] 
            },
            { 
                name: 'La Guancha – Centro urbano', 
                coords: [28.3710, -16.6490] 
            },
            { 
                name: 'Icod – Parque del Drago', 
                coords: [28.3670, -16.7180] 
            },
        ],
        returnStops: 'Santa Cruz → Icod → La Guancha → Buenavista → Compás'
    },

    // =========================================================================
    // LÍNEA 7: ESTE - Candelaria / Güímar / Fasnia
    // =========================================================================
    7: {
        id: 7,
        name: 'Línea 7: Este',
        shortName: 'Este',
        description: 'Candelaria → Güímar → Fasnia',
        buses: '1 mini guagua',
        busIcon: '🚐',
        stops: [
            { 
                name: 'Candelaria – Basílica', 
                coords: [28.3540, -16.3720] 
            },
            { 
                name: 'Güímar – Pirámides / Centro urbano', 
                coords: [28.3170, -16.4120] 
            },
            { 
                name: 'Fasnia – Núcleo turístico', 
                coords: [28.2350, -16.4350] 
            },
        ],
        returnStops: 'Santa Cruz → Fasnia → Güímar → Candelaria → Compás'
    },

    // =========================================================================
    // LÍNEA 8: EXPRÉS Y APOYO - Alta demanda / Hoteles / Turistas especiales
    // =========================================================================
    8: {
        id: 8,
        name: 'Línea 8: Exprés y Apoyo',
        shortName: 'Exprés',
        description: 'Rutas flexibles según demanda',
        buses: '2 mini guaguas',
        busIcon: '🚐',
        isExpress: true, // Esto hace que la línea sea punteada en el mapa
        stops: [
            // Ruta Sur
            { 
                name: 'Playa de las Américas', 
                coords: [28.0650, -16.7250] 
            },
            { 
                name: 'Los Cristianos', 
                coords: [28.0520, -16.7150] 
            },
            { 
                name: 'Costa Adeje', 
                coords: [28.0850, -16.7380] 
            },
            // Ruta Norte
            { 
                name: 'Puerto de la Cruz', 
                coords: [28.4150, -16.5450] 
            },
            { 
                name: 'La Orotava', 
                coords: [28.3900, -16.5230] 
            },
            // Ruta Oeste
            { 
                name: 'Masca', 
                coords: [28.3060, -16.8420] 
            },
            { 
                name: 'Los Gigantes', 
                coords: [28.2450, -16.8420] 
            },
        ],
        returnStops: 'Rutas flexibles según demanda: Playa de las Américas ↔ Los Cristianos ↔ Costa Adeje ↔ Santa Cruz | Puerto de la Cruz ↔ La Orotava ↔ Santa Cruz | Masca ↔ Los Gigantes ↔ Santa Cruz'
    }
};

/**
 * ============================================================================
 * FUNCIONES DE UTILIDAD (No modificar a menos que sea necesario)
 * ============================================================================
 */

// Obtener todos los datos de rutas
function getRoutesData() {
    return ROUTES_DATA;
}

// Obtener una ruta específica por ID
function getRouteById(id) {
    return ROUTES_DATA[id];
}

// Obtener color de una ruta
function getRouteColor(id) {
    return ROUTE_COLORS[id] || '#666666';
}

// Obtener configuración del mapa
function getMapConfig() {
    return MAP_CONFIG;
}

// Obtener puntos especiales
function getSpecialPoints() {
    return SPECIAL_POINTS;
}

// Añadir el Intercambiador de Santa Cruz al final de las paradas
function getStopsWithIntercambiador(routeId) {
    const route = ROUTES_DATA[routeId];
    if (!route) return [];
    
    const stops = [...route.stops];
    // Añadir el intercambiador al final si no está ya incluido
    const lastStop = stops[stops.length - 1];
    if (!lastStop || !lastStop.name.includes('Intercambiador')) {
        stops.push({
            name: SPECIAL_POINTS.santaCruzIntercambiador.name,
            coords: SPECIAL_POINTS.santaCruzIntercambiador.coords
        });
    }
    return stops;
}

/**
 * ============================================================================
 * FUNCIONES PARA AGREGAR NUEVAS LÍNEAS DINÁMICAMENTE
 * ============================================================================
 * 
 * Estas funciones permiten agregar nuevas líneas sin modificar el código
 * existente. Simplemente llame a addNewRoute() con los datos de la línea.
 * 
 * Ejemplo de uso:
 * 
 * addNewRoute({
 *     id: 9,
 *     name: 'Línea 9: Costa Este',
 *     shortName: 'Costa Este',
 *     description: 'El Médano → Costa del Silencio → Santa Cruz',
 *     buses: '2 guaguas grandes',
 *     busIcon: '🧭',
 *     color: '#607d8b',  // Color gris azulado
 *     stops: [
 *         { name: 'El Médano – Plaza', coords: [28.0445, -16.5400] },
 *         { name: 'Costa del Silencio', coords: [28.0050, -16.6300] },
 *         // El intercambiador se añade automáticamente
 *     ],
 *     returnStops: 'Santa Cruz → Costa del Silencio → El Médano → Compás'
 * });
 * 
 * ============================================================================
 */

/**
 * Agregar una nueva ruta al sistema
 * @param {Object} routeConfig - Configuración de la ruta
 * @param {number} routeConfig.id - ID único de la ruta
 * @param {string} routeConfig.name - Nombre completo de la línea
 * @param {string} routeConfig.shortName - Nombre corto para la leyenda
 * @param {string} routeConfig.description - Descripción de la ruta
 * @param {string} routeConfig.buses - Descripción de los buses asignados
 * @param {string} routeConfig.busIcon - Emoji del bus (🧭 o 🚐)
 * @param {string} routeConfig.color - Color hexadecimal para la línea
 * @param {Array} routeConfig.stops - Array de paradas [{name, coords: [lat, lng]}]
 * @param {string} routeConfig.returnStops - Descripción de las paradas de vuelta
 * @param {boolean} [routeConfig.isExpress=false] - Si es línea exprés (punteada)
 */
function addNewRoute(routeConfig) {
    const { id, color, ...routeData } = routeConfig;
    
    // Validar que el ID no existe
    if (ROUTES_DATA[id]) {
        console.error(`Error: La línea ${id} ya existe. Use un ID diferente.`);
        return false;
    }
    
    // Agregar color si se proporciona
    if (color) {
        ROUTE_COLORS[id] = color;
    }
    
    // Agregar la ruta
    ROUTES_DATA[id] = {
        id,
        ...routeData
    };
    
    console.log(`✅ Línea ${id}: "${routeConfig.name}" agregada correctamente`);
    return true;
}

/**
 * Obtener el próximo ID disponible para una nueva línea
 * @returns {number} - Próximo ID disponible
 */
function getNextRouteId() {
    const existingIds = Object.keys(ROUTES_DATA).map(id => parseInt(id));
    if (existingIds.length === 0) {
        return 1; // Start with ID 1 if no routes exist
    }
    return Math.max(...existingIds) + 1;
}

/**
 * Listar todas las líneas configuradas
 * @returns {Array} - Array con información resumida de cada línea
 */
function listAllRoutes() {
    return Object.values(ROUTES_DATA).map(route => ({
        id: route.id,
        name: route.name,
        stops: route.stops.length,
        buses: route.buses
    }));
}

// Exportar para uso en otros archivos (si se usa como módulo)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ROUTES_DATA,
        ROUTE_COLORS,
        MAP_CONFIG,
        SPECIAL_POINTS,
        getRoutesData,
        getRouteById,
        getRouteColor,
        getMapConfig,
        getSpecialPoints,
        getStopsWithIntercambiador,
        addNewRoute,
        getNextRouteId,
        listAllRoutes
    };
}
