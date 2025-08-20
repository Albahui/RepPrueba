<?php
session_start();
require_once 'config.php';

// Verificar que el usuario esté logueado
if (!isLoggedIn()) {
    header('Location: ../login.html?error=Devi essere loggato per vedere gli eventi');
    exit();
}

$currentUser = getCurrentUser($pdo);

// Obtener todos los eventos disponibles
try {
    $sql_eventi = "SELECT e.*, u.nome AS universita_nome, 
                   (SELECT COUNT(*) FROM Partecipazioni p WHERE p.evento_id = e.id) as partecipanti_attuali,
                   (SELECT COUNT(*) FROM Partecipazioni p WHERE p.evento_id = e.id AND p.utente_id = :utente_id) as gia_iscritto
                   FROM Evento e 
                   LEFT JOIN Universita u ON e.universita_id = u.id 
                   WHERE e.data_evento >= NOW()
                   ORDER BY e.data_evento ASC";
    
    $stmt_eventi = $pdo->prepare($sql_eventi);
    $stmt_eventi->execute([':utente_id' => $_SESSION['utente_id']]);
    $eventi = $stmt_eventi->fetchAll();

} catch (PDOException $e) {
    $error_message = "Errore nel caricamento degli eventi: " . $e->getMessage();
    error_log($error_message);
}

// Gestire messaggi de estado
$status = $_GET['status'] ?? '';
$message = $_GET['message'] ?? '';
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eventi - SonoErasmus+</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/unified-styles.css">
</head>
<body>
    <div class="eventi-container">
        <a href="../index.php" class="back-link">← Torna alla home</a>
        
        <h1>Eventi disponibili</h1>
        <p>Ciao <strong><?= h($currentUser['nome']) ?></strong>, ecco gli eventi a cui puoi partecipare:</p>
        
        <!-- Messaggi di stato -->
        <?php if ($status === 'successo'): ?>
            <div class="status-message status-success">
                ✅ Ti sei iscritto con successo all'evento!
            </div>
        <?php elseif ($status === 'errore'): ?>
            <div class="status-message status-error">
                ❌ <?= h($message) ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($error_message)): ?>
            <div class="status-message status-error">
                ❌ <?= h($error_message) ?>
            </div>
        <?php endif; ?>
        
        <!-- Lista eventi -->
        <?php if (empty($eventi)): ?>
            <div class="no-eventi">
                <h3>Nessun evento disponibile al momento</h3>
                <p>Controlla più tardi per nuovi eventi!</p>
            </div>
        <?php else: ?>
            <?php foreach ($eventi as $evento): ?>
                <div class="evento-card">
                    <div class="evento-header">
                        <h3 class="evento-title"><?= h($evento['titolo']) ?></h3>
                        <div class="evento-data">
                            📅 <?= date('d/m/Y H:i', strtotime($evento['data_evento'])) ?>
                        </div>
                    </div>
                    
                    <div class="evento-info">
                        <p><strong>Descrizione:</strong> <?= h($evento['descrizione']) ?></p>
                        <p><strong>📍 Luogo:</strong> <?= h($evento['luogo']) ?></p>
                        <?php if ($evento['universita_nome']): ?>
                            <p><strong>🎓 Università:</strong> <?= h($evento['universita_nome']) ?></p>
                        <?php endif; ?>
                    </div>
                    
                    <div class="evento-actions">
                        <div class="partecipanti-info">
                            👥 <?= $evento['partecipanti_attuali'] ?> partecipanti
                            <?php if ($evento['max_partecipanti']): ?>
                                / <?= $evento['max_partecipanti'] ?> max
                            <?php endif; ?>
                        </div>
                        
                        <?php if ($evento['gia_iscritto'] > 0): ?>
                            <span class="btn-iscritto">✅ Già iscritto</span>
                        <?php elseif ($evento['max_partecipanti'] && $evento['partecipanti_attuali'] >= $evento['max_partecipanti']): ?>
                            <button class="btn-partecipa" disabled>Evento pieno</button>
                        <?php else: ?>
                            <form method="POST" action="partecipa.php" class="partecipa-form">
                                <input type="hidden" name="evento_id" value="<?= $evento['id'] ?>">
                                <button type="submit" class="btn-partecipa">Partecipa</button>
                            </form>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    
    <script src="../assets/js/user-system.js"></script>
</body>
</html>