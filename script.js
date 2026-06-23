// ==================== script2.js - Version PDF identique au modèle officiel ====================

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchMatricule');
    const resultContainer = document.getElementById('resultContainer');
    const messageDiv = document.getElementById('responseMessage');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const printPdfBtn = document.getElementById('printPdfBtn');

    // API URL - REMPLACEZ AVEC VOTRE URL
    const API_URL = 'https://script.google.com/macros/s/AKfycbwPlEoPIs5YLg2NgbD_lxf3MvhU03eMYqW1ZmjyYn7G2i5DOLnL5IphmhvotUJ7MczQ/exec';

    
    // Mapping des évaluations
    const EVALUATIONS_MAP = [
        { 
            title: 'INSATISFACTION AU POSTE',
            contentKey: 'INSATISFACTION AU POSTE',
            ratingKey: 'Rating_Insatisfaction',
            guide: 'Quel est votre sentiment de satisfaction par rapport au poste que vous avez occupé ?'
        },
        { 
            title: "CULTURE D'ENTREPRISE ET ENVIRONNEMENT DE TRAVAIL",
            contentKey: "CULTURE D'ENTREPRISE ET ENVIRONNEMENT DE TRAVAIL",
            ratingKey: 'Rating_Culture',
            guide: "Quelle est votre appréciation générale de votre environnement de travail chez CONNECTEO ?"
        },
        { 
            title: 'LEADERSHIP',
            contentKey: 'LEADERSHIP',
            ratingKey: 'Rating_Leadership',
            guide: 'Quel genre de relations aviez-vous avec votre hiérarchie ? Croyez-vous que vous aviez eu le soutien adéquat pour bien exécuter votre travail ?'
        },
        { 
            title: "OPPORTUNITÉS D'ÉVOLUTION DE CARRIÈRE",
            contentKey: "OPPORTUNITÉS D'ÉVOLUTION DE CARRIÈRE",
            ratingKey: 'Rating_Opportunites',
            guide: "Que pensez-vous des opportunités d'évolution de carrière auprès de CONNECTEO ? Et pour votre cas en particulier ?"
        },
        { 
            title: 'FORMATION ET DEVELOPPEMENT DES COMPETENCES',
            contentKey: 'FORMATION ET DEVELOPPEMENT DES COMPETENCES',
            ratingKey: 'Rating_Formation',
            guide: 'La formation que vous avez reçue était-elle suffisante pour vous permettre d\'exécuter votre travail de manière efficace et par la même occasion de développer vos compétences ?'
        },
        { 
            title: 'SALAIRES ET AVANTAGES',
            contentKey: 'SALAIRES ET AVANTAGES',
            ratingKey: 'Rating_Salaires',
            guide: 'Étiez-vous satisfait de votre salaire, des avantages sociaux et autres mesures incitatives ?'
        },
        { 
            title: "CHANGEMENT DE L'ÉVOLUTION DE CARRIERE",
            contentKey: "CHANGEMENT DE L'ÉVOLUTION DE CARRIERE",
            ratingKey: 'Rating_Changement',
            guide: "Est-ce que votre décision de partir est liée à un besoin de changement significatif de votre carrière ? Si oui, dans quelle mesure ?"
        },
        { 
            title: 'FAMILLE ET MODE DE VIE',
            contentKey: 'FAMILLE ET MODE DE VIE',
            ratingKey: 'Rating_Famille',
            guide: "Comment évaluez-vous l'équilibre vie privée/vie professionnelle au cours de votre expérience de travail chez CONNECTEO ? (Les contraintes concernant l'éducation des enfants, les responsabilités familiales ...)"
        }
    ];

    // ==================== Date actuelle ====================
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    // ==================== Fonction d'appel API avec JSONP ====================
    function callAPI(action, params, callback) {
        const script = document.createElement('script');
        const callbackName = 'jsonp_callback_' + Date.now();

        let url = API_URL + '?action=' + encodeURIComponent(action);
        url += '&callback=' + encodeURIComponent(callbackName);

        if (params) {
            Object.keys(params).forEach(key => {
                url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            });
        }

        window[callbackName] = function(response) {
            delete window[callbackName];
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            callback(response);
        };

        script.src = url;
        script.onerror = function() {
            delete window[callbackName];
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            callback({ success: false, message: 'Erreur de connexion au serveur' });
        };
        document.body.appendChild(script);

        setTimeout(function() {
            if (window[callbackName]) {
                delete window[callbackName];
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
                callback({ success: false, message: 'Timeout - Le serveur ne répond pas' });
            }
        }, 15000);
    }

    // ==================== Vérification de connexion ====================
    function checkConnection() {
        statusDot.className = 'status-dot checking';
        statusText.textContent = 'Connexion...';

        callAPI('testConnection', null, function(response) {
            if (response.success) {
                statusDot.className = 'status-dot connected';
                statusText.textContent = '✅ Connecté - ' + (response.data.sheetName || '') + ' (' + (response.data.rowCount || 0) + ' enregistrements)';
            } else {
                statusDot.className = 'status-dot disconnected';
                statusText.textContent = '❌ ' + (response.message || 'Erreur de connexion');
            }
        });
    }

    // ==================== Rechercher par matricule ====================
    function searchByMatricule() {
        const matricule = searchInput.value.trim();

        if (!matricule) {
            showMessage('⚠️ Veuillez entrer un matricule.', 'error');
            resultContainer.style.display = 'none';
            return;
        }

        showMessage('🔍 Recherche en cours...', 'info');

        callAPI('searchByMatricule', { matricule: matricule }, function(response) {
            console.log('Résultat de recherche:', response);

            if (response.success) {
                displayResults(response.data);
                showMessage('✅ Employé trouvé ! Matricule : ' + matricule, 'success');
                resultContainer.style.display = 'block';
            } else {
                showMessage('❌ ' + response.message, 'error');
                resultContainer.style.display = 'none';
            }
        });
    }

    // ==================== Afficher les résultats ====================
    function displayResults(data) {
        const row = data.row;

        document.getElementById('reportId').textContent = '#RPT-' + String(data.rowIndex || 0).padStart(4, '0');

        // === Informations personnelles ===
        const infoGrid = document.getElementById('infoGrid');
        const personalFields = [
            { label: 'Matricule', value: row['Matricule'] || '' },
            { label: 'Nom et Prénoms', value: row['Nom et Prénoms'] || '' },
            { label: 'Poste', value: row['Poste'] || '' },
            { label: 'Direction', value: row['Direction'] || '' },
            { label: "Date d'embauche", value: row["Date d'embauche"] || '' },
            { label: "Période d'essai", value: row["Période d'essai"] || '' },
            { label: 'Contrat', value: row['Contrat'] || '' },
            { label: 'Date du rapport', value: row['Date de rapport'] || new Date().toLocaleDateString('fr-FR') }
        ];

        infoGrid.innerHTML = personalFields.map(function(field) {
            return '<div class="info-item">' +
                '<span class="label">' + field.label + ' :</span>' +
                '<span class="value">' + (field.value || 'Non renseigné') + '</span>' +
                '</div>';
        }).join('');

        // === Raison de départ ===
        document.getElementById('raisonDepartContent').textContent = row['Raison de départ'] || 'Non renseigné';

        // === Évaluations ===
        const evalGrid = document.getElementById('evalGrid');
        evalGrid.innerHTML = EVALUATIONS_MAP.map(function(evalItem) {
            const content = row[evalItem.contentKey] || '';
            const rating = row[evalItem.ratingKey] || '';
            
            let ratingDisplay = '';
            if (rating) {
                ratingDisplay = '<span class="eval-rating">⭐ Rating : ' + rating + '/3</span>';
            } else {
                ratingDisplay = '<span class="eval-rating no-rating">Rating : Non renseigné</span>';
            }
            
            return '<div class="eval-card">' +
                '<div class="eval-header">' +
                '<span class="eval-title">' + evalItem.title + '</span>' +
                ratingDisplay +
                '</div>' +
                '<div class="guide-mini">' +
                '<span class="guide-icon">💡</span>' +
                '<span class="guide-label">Question guide :</span>' +
                '<span class="guide-text">' + evalItem.guide + '</span>' +
                '</div>' +
                '<div class="eval-content">' + (content || 'Non renseigné') + '</div>' +
                '</div>';
        }).join('');

        // === Recommandations et commentaires ===
        document.getElementById('recommandationsContent').textContent = row["RECOMMANDATIONS À FAIRE PARTIE DE L'ORGANISATION"] || 'Non renseigné';
        document.getElementById('autresContent').textContent = row['AUTRES'] || 'Non renseigné';
        document.getElementById('notesContent').textContent = row['NOTES ET COMMENTAIRES'] || 'Non renseigné';

        document.getElementById('reportDate').textContent = new Date().toLocaleDateString('fr-FR');

        window.currentReportData = row;
    }

    // ==================== Générer le PDF - Version identique au modèle ====================
    function generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        let y = 20;

        // Fonction pour ajouter du texte avec wrap
        function addWrappedText(text, x, y, maxWidth, fontSize, lineHeight) {
            fontSize = fontSize || 10;
            lineHeight = lineHeight || 6;
            doc.setFontSize(fontSize);
            var lines = doc.splitTextToSize(text, maxWidth);
            lines.forEach(function(line, index) {
                doc.text(line, x, y + (index * lineHeight));
            });
            return y + (lines.length * lineHeight) + 2;
        }

        // Fonction pour ajouter l'en-tête de page (modèle AXIAN)
        function addPageHeader(pageNum, totalPages) {
            // Logo AXIAN
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#1E293B');
            doc.text('AXIAN', 20, 20);
            
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor('#64748B');
            doc.text('LET\'S GROW TOGETHER', 20, 26);
            
            // Version et date à droite
            doc.setFontSize(8);
            doc.setTextColor('#94A3B8');
            doc.text('VERSION 1.00', 180, 20, { align: 'right' });
            doc.text('28/01/22', 180, 26, { align: 'right' });
            
            // Numéro de page à droite
            doc.text('Page ' + pageNum + ' sur ' + totalPages, 180, 32, { align: 'right' });
            
            // Titre du document
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#1E293B');
            doc.text('RAPPORT D\'EXIT', 105, 42, { align: 'center' });
            
            // Ligne de séparation
            doc.setDrawColor('#E2E8F0');
            doc.setLineWidth(0.5);
            doc.line(20, 48, 190, 48);
            
            return 52;
        }

        // ============================================================
        // PAGE 1
        // ============================================================
        var yPos = addPageHeader(1, 5);
        yPos += 5;

        // === Tableau des informations personnelles ===
        // Dessiner le tableau
        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        
        // Lignes du tableau
        var tableY = yPos;
        var rowHeight = 7;
        var colWidths = [45, 50, 45, 50];
        var startX = 20;
        
        // En-têtes et valeurs
        var infoData = [
            ['Matricule :', data['Matricule'] || '', "Date d'embauche :", data["Date d'embauche"] || ''],
            ['Nom et prénom :', data['Nom et Prénoms'] || '', "Période d'essai :", data["Période d'essai"] || ''],
            ['Poste :', data['Poste'] || '', 'Contrat :', data['Contrat'] || ''],
            ['Direction :', data['Direction'] || '', 'Date du rapport :', data['Date de rapport'] || new Date().toLocaleDateString('fr-FR')]
        ];

        // Dessiner le tableau ligne par ligne
        for (var i = 0; i < infoData.length; i++) {
            var row = infoData[i];
            var yRow = tableY + (i * rowHeight);
            
            // Dessiner les bordures de la ligne
            doc.rect(startX, yRow, colWidths[0], rowHeight);
            doc.rect(startX + colWidths[0], yRow, colWidths[1], rowHeight);
            doc.rect(startX + colWidths[0] + colWidths[1], yRow, colWidths[2], rowHeight);
            doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], yRow, colWidths[3], rowHeight);
            
            // Ajouter le texte
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#1E293B');
            doc.text(row[0], startX + 2, yRow + 5);
            doc.text(row[2], startX + colWidths[0] + colWidths[1] + 2, yRow + 5);
            
            doc.setFont('helvetica', 'normal');
            doc.text(row[1], startX + colWidths[0] + 2, yRow + 5);
            doc.text(row[3], startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, yRow + 5);
        }

        yPos = tableY + (infoData.length * rowHeight) + 10;

        // ===== RAISONS DU DÉPART =====
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('RAISONS DU DÉPART', 20, yPos);
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var guideText = 'Questions guides : Quelle est votre principale raison de départ ? Qu\'est ce qui aurait pu être fait pour vous encourager à rester au sein de notre organisation / de votre poste ?';
        yPos = addWrappedText(guideText, 20, yPos, 170, 8, 4);
        yPos += 2;

        // Cadre pour la réponse
        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var responseText = data['Raison de départ'] || 'Non renseigné';
        var lines = doc.splitTextToSize(responseText, 165);
        lines.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 8;

        // ===== GRILLE DE CLASSEMENT =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('Grille de classement des appréciations', 20, yPos);
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.text('1 = N\'est pas un facteur pris en compte dans la décision de partir', 20, yPos);
        yPos += 4;
        doc.text('2 = Est un facteur mineur dans la décision de partir', 20, yPos);
        yPos += 4;
        doc.text('3 = Est un facteur majeur dans la décision de partir', 20, yPos);
        yPos += 10;

        // ===== INSATISFACTION AU POSTE =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('INSATISFACTION AU POSTE', 20, yPos);
        
        // Rating à droite
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('Rating', 170, yPos, { align: 'right' });
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var insatisfactionGuide = 'Questions guides : Quel est votre sentiment de satisfaction par rapport au poste que vous avez occupé ?';
        yPos = addWrappedText(insatisfactionGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        // Cadre pour la réponse
        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var insatisfactionText = data['INSATISFACTION AU POSTE'] || 'Non renseigné';
        var lines2 = doc.splitTextToSize(insatisfactionText, 165);
        lines2.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 5;

        // Rating value
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.setFontSize(9);
        doc.text('Rating : ' + (data['Rating_Insatisfaction'] || 'Non renseigné'), 170, yPos, { align: 'right' });
        yPos += 12;

        // ============================================================
        // PAGE 2
        // ============================================================
        doc.addPage();
        yPos = addPageHeader(2, 5);
        yPos += 5;

        // ===== CULTURE D'ENTREPRISE =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text("CULTURE D'ENTREPRISE ET ENVIRONNEMENT DE TRAVAIL", 20, yPos);
        doc.text('Rating', 170, yPos, { align: 'right' });
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var cultureGuide = "Questions guides : Quelle est votre appréciation générale de votre environnement de travail chez CONNECTEO ?";
        yPos = addWrappedText(cultureGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var cultureText = data["CULTURE D'ENTREPRISE ET ENVIRONNEMENT DE TRAVAIL"] || 'Non renseigné';
        var lines3 = doc.splitTextToSize(cultureText, 165);
        lines3.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.setFontSize(9);
        doc.text('Rating : ' + (data['Rating_Culture'] || 'Non renseigné'), 170, yPos, { align: 'right' });
        yPos += 12;

        // ===== LEADERSHIP =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('LEADERSHIP', 20, yPos);
        doc.text('Rating', 170, yPos, { align: 'right' });
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var leadershipGuide = 'Questions guides : Quel genre de relations aviez-vous avec votre hiérarchie ? Croyez-vous que vous aviez eu le soutien adéquat pour bien exécuter votre travail ?';
        yPos = addWrappedText(leadershipGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var leadershipText = data['LEADERSHIP'] || 'Non renseigné';
        var lines4 = doc.splitTextToSize(leadershipText, 165);
        lines4.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.setFontSize(9);
        doc.text('Rating : ' + (data['Rating_Leadership'] || 'Non renseigné'), 170, yPos, { align: 'right' });
        yPos += 12;

        // ===== OPPORTUNITÉS =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text("OPPORTUNITÉS D'ÉVOLUTION DE CARRIÈRE", 20, yPos);
        doc.text('Rating', 170, yPos, { align: 'right' });
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var opportunitesGuide = "Questions guides : Que pensez-vous des opportunités d'évolution de carrière auprès de CONNECTEO ? Et pour votre cas en particulier ?";
        yPos = addWrappedText(opportunitesGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var opportunitesText = data["OPPORTUNITÉS D'ÉVOLUTION DE CARRIÈRE"] || 'Non renseigné';
        var lines5 = doc.splitTextToSize(opportunitesText, 165);
        lines5.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.setFontSize(9);
        doc.text('Rating : ' + (data['Rating_Opportunites'] || 'Non renseigné'), 170, yPos, { align: 'right' });
        yPos += 12;

        // ============================================================
        // PAGE 3
        // ============================================================
        doc.addPage();
        yPos = addPageHeader(3, 5);
        yPos += 5;

        // ===== FORMATION =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('FORMATION ET DEVELOPPEMENT DES COMPETENCES', 20, yPos);
        doc.text('Rating', 170, yPos, { align: 'right' });
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var formationGuide = "Questions guides : La formation que vous avez reçue était-elle suffisante pour vous permettre d'exécuter votre travail de manière efficace et par la même occasion de développer vos compétences ?";
        yPos = addWrappedText(formationGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var formationText = data['FORMATION ET DEVELOPPEMENT DES COMPETENCES'] || 'Non renseigné';
        var lines6 = doc.splitTextToSize(formationText, 165);
        lines6.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.setFontSize(9);
        doc.text('Rating : ' + (data['Rating_Formation'] || 'Non renseigné'), 170, yPos, { align: 'right' });
        yPos += 12;

        // ===== SALAIRES =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('SALAIRES ET AVANTAGES', 20, yPos);
        doc.text('Rating', 170, yPos, { align: 'right' });
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var salairesGuide = 'Questions guides : Étiez-vous satisfait de votre salaire, des avantages sociaux et autres mesures incitatives ?';
        yPos = addWrappedText(salairesGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var salairesText = data['SALAIRES ET AVANTAGES'] || 'Non renseigné';
        var lines7 = doc.splitTextToSize(salairesText, 165);
        lines7.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.setFontSize(9);
        doc.text('Rating : ' + (data['Rating_Salaires'] || 'Non renseigné'), 170, yPos, { align: 'right' });
        yPos += 12;

        // ===== CHANGEMENT =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text("CHANGEMENT DE L'ÉVOLUTION DE CARRIERE", 20, yPos);
        doc.text('Rating', 170, yPos, { align: 'right' });
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var changementGuide = "Questions guides : Est-ce que votre décision de partir est liée à un besoin de changement significatif de votre carrière ? Si oui, dans quelle mesure ?";
        yPos = addWrappedText(changementGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var changementText = data["CHANGEMENT DE L'ÉVOLUTION DE CARRIERE"] || 'Non renseigné';
        var lines8 = doc.splitTextToSize(changementText, 165);
        lines8.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.setFontSize(9);
        doc.text('Rating : ' + (data['Rating_Changement'] || 'Non renseigné'), 170, yPos, { align: 'right' });
        yPos += 12;

        // ============================================================
        // PAGE 4
        // ============================================================
        doc.addPage();
        yPos = addPageHeader(4, 5);
        yPos += 5;

        // ===== FAMILLE =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('FAMILLE ET MODE DE VIE', 20, yPos);
        doc.text('Rating', 170, yPos, { align: 'right' });
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var familleGuide = "Questions guides : Comment évaluez-vous l'équilibre vie privée/vie professionnelle au cours de votre expérience de travail chez CONNECTEO ? (Les contraintes concernant l'éducation des enfants, les responsabilités familiales ...)";
        yPos = addWrappedText(familleGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var familleText = data['FAMILLE ET MODE DE VIE'] || 'Non renseigné';
        var lines9 = doc.splitTextToSize(familleText, 165);
        lines9.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.setFontSize(9);
        doc.text('Rating : ' + (data['Rating_Famille'] || 'Non renseigné'), 170, yPos, { align: 'right' });
        yPos += 12;

        // ===== RECOMMANDATIONS =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text("RECOMMANDATIONS À FAIRE PARTIE DE L'ORGANISATION", 20, yPos);
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var recommandationsGuide = "Questions guides : Recommanderiez-vous quelqu'un de votre famille ou proches connaissances à travailler pour notre organisation ? Pourquoi ? Pourquoi pas ?";
        yPos = addWrappedText(recommandationsGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var recommandationsText = data["RECOMMANDATIONS À FAIRE PARTIE DE L'ORGANISATION"] || 'Non renseigné';
        var lines10 = doc.splitTextToSize(recommandationsText, 165);
        lines10.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 10;

        // ============================================================
        // PAGE 5
        // ============================================================
        doc.addPage();
        yPos = addPageHeader(5, 5);
        yPos += 5;

        // ===== AUTRES =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('AUTRES', 20, yPos);
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var autresGuide = "Questions guides : Envisagez-vous de retourner un jour pour refaire partie de notre organisation ? Pourquoi ? Pourquoi pas ? Quels changements devrions-nous entamer pour vous pousser à revenir ?";
        yPos = addWrappedText(autresGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var autresText = data['AUTRES'] || 'Non renseigné';
        var lines11 = doc.splitTextToSize(autresText, 165);
        lines11.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 8;

        // ===== NOTES ET COMMENTAIRES =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('NOTES ET COMMENTAIRES', 20, yPos);
        yPos += 5;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var notesGuide = "Questions guides : Est ce qu'il y a des commentaires que vous souhaitez faire concernant notre relation de travail ?";
        yPos = addWrappedText(notesGuide, 20, yPos, 170, 8, 4);
        yPos += 2;

        doc.setDrawColor('#E2E8F0');
        doc.setLineWidth(0.3);
        doc.rect(20, yPos, 170, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        doc.setFontSize(9);
        var notesText = data['NOTES ET COMMENTAIRES'] || 'Non renseigné';
        var lines12 = doc.splitTextToSize(notesText, 165);
        lines12.forEach(function(line, index) {
            doc.text(line, 24, yPos + 5 + (index * 5));
        });
        yPos += 25 + 10;

        // ===== CADRE RH =====
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('CADRE RESERVE A LA RH', 20, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#1E293B');
        doc.text('Interviewers :', 20, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        doc.text('1- ' + (data['Interviewers 1'] || ''), 20, yPos);
        yPos += 6;
        doc.text('2- ' + (data['Interviewers 2'] || ''), 20, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#94A3B8');
        doc.text('Notes :', 20, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        yPos = addWrappedText('', 20, yPos, 170, 9, 5);
        yPos += 10;

        // ===== DATE ET SIGNATURE =====
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#1E293B');
        doc.text('Date du rapport :', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date().toLocaleDateString('fr-FR'), 70, yPos);
        yPos += 10;

        doc.text('Signature de l\'employé : _________________', 20, yPos);

        // Sauvegarder le PDF
        var fileName = 'Rapport_Exit_' + (data['Nom et Prénoms'] || 'Anonyme') + '_' + new Date().toISOString().split('T')[0] + '.pdf';
        doc.save(fileName);
    }

    // ==================== Écouteurs d'événements ====================
    searchBtn.addEventListener('click', searchByMatricule);

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchByMatricule();
        }
    });

    printPdfBtn.addEventListener('click', function() {
        if (window.currentReportData) {
            generatePDF(window.currentReportData);
            showMessage('✅ PDF généré avec succès !', 'success');
        } else {
            showMessage('❌ Aucune donnée à exporter. Veuillez d\'abord rechercher un employé.', 'error');
        }
    });

    // ==================== Message ====================
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = 'message ' + type;
        messageDiv.style.display = 'block';
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(function() {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    // ==================== Initialisation ====================
    checkConnection();
});