<?php
/**
 * Ash-Radio Chat - Version de test pour hébergement mutualisé
 * Ce fichier sert d'alternative si Node.js n'est pas supporté
 */

// Headers pour CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Gestion des requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simuler une API simple pour tester
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'health':
        echo json_encode([
            'status' => 'OK',
            'service' => 'Ash-Radio Chat PHP Fallback',
            'message' => 'Interface statique opérationnelle',
            'websocket' => 'Non supporté sur hébergement mutualisé'
        ]);
        break;

    case 'channels':
        echo json_encode([
            [
                'id' => 'general',
                'name' => '#general',
                'description' => 'Canal principal Ash-Radio',
                'memberCount' => 1
            ],
            [
                'id' => 'musique',
                'name' => '#musique',
                'description' => 'Découvertes musicales',
                'memberCount' => 0
            ]
        ]);
        break;

    default:
        echo json_encode([
            'error' => 'Action non supportée',
            'message' => 'Pour un chat temps réel, un VPS est nécessaire'
        ]);
}
?>
