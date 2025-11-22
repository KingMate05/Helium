<?php
// Vérifier si un ID est présent dans l'URL
if (!isset($_GET['id'])) {
    die("Produit inexistant.");
}

$id = intval($_GET['id']);

// Connexion BDD
$pdo = new PDO('mysql:host=localhost;dbname=shop;charset=utf8', 'root', '');

// Récupération du produit
$stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
$stmt->execute([$id]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

// Si le produit n'existe pas
if (!$product) {
    die("Produit introuvable.");
}
?>

<!DOCTYPE html>
<html>

<head>
    <title><?= htmlspecialchars($product['name']) ?></title>
</head>

<body>

    <a href="produits.php">← Retour au catalogue</a>

    <h1><?= htmlspecialchars($product['name']) ?></h1>

    <img src="images/<?= $product['image'] ?>" width="300">

    <p><strong>Prix : </strong><?= number_format($product['price'], 2) ?> €</p>

    <p><?= nl2br(htmlspecialchars($product['description'])) ?></p>

    <button>Ajouter au panier</button>

</body>

</html>