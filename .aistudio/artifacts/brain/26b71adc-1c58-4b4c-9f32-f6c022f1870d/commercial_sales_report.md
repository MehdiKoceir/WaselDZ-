# DOSSIER COMMERCIAL & RAPPORT DE CERTIFICATION PRODUIT
## Plateforme SaaS de Logistique & Distribution 58 Wilayas : WaselLogistics (WaselDZ)

**Date d'audit :** Octobre 2026  
**Statut de conformité :** Prêt pour exploitation commerciale et cession (Ready-to-Sell)  
**Cluster Cloud Firestore :** `ai-studio-waseldzplateform-26b71adc-1c58-4b4c-9f32-f6c022f1870d`  
**Environnement :** Production Full-Stack (React 19, TypeScript, Express, Tailwind CSS, Firebase Firestore & Cloud Rules)

---

## 1. Synthèse Exécutive (Executive Summary)

WaselLogistics (WaselDZ) est une plateforme logicielle tout-en-un conçue sur mesure pour répondre aux défis spécifiques du commerce et de la logistique du dernier kilomètre en Algérie. Elle permet à toute boutique, réseau de magasins physiques ou marque e-commerce de piloter ses commandes, d'éditer ses bordereaux d'expédition conformes, d'assigner ses livreurs sur les 58 wilayas, et de sécuriser la réconciliation financière des flux en **Paiement à la Livraison (Cash on Delivery / C.O.D)** et **BaridiMob**.

L'application a été auditée techniquement, durcie au niveau des règles de sécurité des bases de données et restructurée sous une identité visuelle professionnelle "B2B Freight & Logistics Enterprise".

---

## 2. Architecture & Composants Clés de la Plateforme

### A. Portail Public & Expérience Client / Destinataire
1. **Console de Suivi Express Instantané (AWB / Téléphone)** :
   - Tout destinataire ou acheteur final peut localiser son colis sans avoir besoin de créer un compte.
   - Saisie du numéro de bordereau (ex : `WDZ-16-0926-001`) ou de son numéro de mobile.
   - Affichage immédiat d'un manifeste logistique précis : statut en temps réel (Préparation, En cours, Livré), hub de transit, montant C.O.D à régler, et bouton de **télémétrie GPS en direct**.
2. **Barème Tarifaire Officiel Interactif (58 Wilayas)** :
   - Simulateur de frais de livraison par wilaya comparant la livraison à domicile et le retrait en point relais (Stop-Desk).
   - Délais contractuels SLA indicatifs (J+0 Alger, 24h Centre, 24h-48h Est/Ouest, 48h-72h Grand Sud).
3. **Centre d'Opérations & Dispatch** :
   - Coordonnées directes (téléphone centralisé et canal de régulation WhatsApp) et localisation des plateformes de tri régionales (Alger, Oran, Constantine).

### B. Console Marchande & Back-Office d'Exploitation (Espace Pro)
1. **Gestion Centralisée des Commandes (Order Pipeline)** :
   - Filtrage multi-critères (Statut, Wilaya, Mode de paiement, Livreur, Recherche textuelle instantanée avec raccourci clavier `/`).
   - Moteur de transition d'état rigoureux : Nouvelle $\rightarrow$ Confirmée $\rightarrow$ En préparation $\rightarrow$ Assignée $\rightarrow$ En cours de livraison $\rightarrow$ Livrée / Échouée / Retournée.
2. **Générateur de Bordereaux d'Expédition (Delivery Slip)** :
   - Impression conforme aux formats de transport avec code-barres, coordonnées expéditeur/destinataire, détail des articles et encart de décharge C.O.D.
3. **Télémétrie GPS & Dispatch Flotte** :
   - Module de simulation et suivi des livreurs en temps réel avec calcul de distance kilométrique restante, vitesse et heure estimée d'arrivée (ETA).
4. **Contrôle Financier & Réconciliation C.O.D** :
   - Suivi en temps réel des montants encaissés en espèces par livreur et des paiements dématérialisés BaridiMob / CCP.
   - Clôture de caisse à J+1 et calcul automatique de la rentabilité nette après déduction des frais de livraison et du coût de revient des produits.
5. **Catalogue Produits, Dépôts & Traçabilité des Stocks** :
   - Gestion des stocks avec seuil d'alerte de rupture et registre d'audit des mouvements d'entrée/sortie/ajustement.
6. **CRM Clients & Gestion des Chauffeurs** :
   - Fiches clients avec historique d'achats, indicateur VIP et notes de livraison.
   - Fiches livreurs avec statut de disponibilité (Disponible, En course, Hors ligne), véhicule et score de performance.

---

## 3. Sécurité, Règlements & Conformité Technique

| Domaine | Implémentation & Certification |
| :--- | :--- |
| **Cloisonnement Multi-Tenant** | Isolation stricte des données de chaque boutique sous `/businesses/{businessId}` via règles Firestore déployées. |
| **Validation des Payloads** | Vérification côté serveur des types, bornes de prix et intégrité des numéros algériens (formats valides `05`, `06`, `07`). |
| **Protection Anti-Déni de Service** | Catch-all Firestore par défaut rejetant tout accès non expressément autorisé (`allow read, write: if false`). |
| **En-têtes de Sécurité HTTP** | En-têtes `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection` actifs sur le backend Express. |
| **Protection des Données (PII)** | Masquage des informations sensibles et conformité avec les dispositions de la **Loi algérienne n° 18-07** relative à la protection des données personnelles. |
| **Qualité du Code** | TypeScript strict avec vérification de types complète (`tsc --noEmit` : 0 erreurs) et build de production validé. |

---

## 4. Modèle Économique & Leviers de Monétisation

Pour un acquéreur ou un investisseur, la plateforme offre 3 leviers de monétisation immédiats :

1. **Abonnement Logiciel B2B (SaaS)** :
   - Formule Starter (Petites boutiques Instagram / TikTok) : 2 500 à 4 000 DZD / mois.
   - Formule Pro / Enterprise (Marques e-commerce avec volume quotidien) : 8 000 à 15 000 DZD / mois.
2. **Commission par Bordereau Généré (Pay-as-you-Ship)** :
   - Prélèvement d'une commission fixe de 20 à 50 DZD par bordereau édité et livré avec succès.
3. **Fourniture de Service Logistique Complet (3PL)** :
   - Utilisation de la plateforme comme solution interne pour opérer une véritable société de livraison privée avec flotte de chauffeurs en Algérie.

---

## 5. Livrables & Actifs Inclus

- **Code Source Complet** : React 19, TypeScript, Tailwind CSS, Node.js/Express (`server.ts`).
- **Base de Données Cloud Provisionnée** : Projet Firebase Firestore pré-configuré avec règles de sécurité déployées et données de démonstration prêtes pour les présentations clients.
- **Documentation d'Amorçage & Scripts de Build** : Configuration de production clé en main (`npm run build`, `npm run dev`).
- **Asset Graphique & UI** : Thème corporatif B2B sobre et responsive, optimisé pour ordinateurs de bureau, tablettes et smartphones des chauffeurs.
