// ==================== script2.js - Version corrigée ====================

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

    // Mapping des évaluations pour l'affichage avec les clés correctes
    const EVALUATIONS_MAP = [
        { 
            title: 'Insatisfaction au poste',
            contentKey: 'INSATISFACTION AU POSTE',
            ratingKey: 'Rating_Insatisfaction',
            icon: '📌'
        },
        { 
            title: "Culture d'entreprise & Environnement",
            contentKey: "CULTURE D'ENTREPRISE ET ENVIRONNEMENT DE TRAVAIL",
            ratingKey: 'Rating_Culture',
            icon: '🏢'
        },
        { 
            title: 'Leadership',
            contentKey: 'LEADERSHIP',
            ratingKey: 'Rating_Leadership',
            icon: '👔'
        },
        { 
            title: "Opportunités d'évolution",
            contentKey: "OPPORTUNITÉS D'ÉVOLUTION DE CARRIÈRE",
            ratingKey: 'Rating_Opportunites',
            icon: '🚀'
        },
        { 
            title: 'Formation & Développement',
            contentKey: 'FORMATION ET DEVELOPPEMENT DES COMPETENCES',
            ratingKey: 'Rating_Formation',
            icon: '📚'
        },
        { 
            title: 'Salaires & Avantages',
            contentKey: 'SALAIRES ET AVANTAGES',
            ratingKey: 'Rating_Salaires',
            icon: '💰'
        },
        { 
            title: 'Changement de carrière',
            contentKey: "CHANGEMENT DE L'ÉVOLUTION DE CARRIERE",
            ratingKey: 'Rating_Changement',
            icon: '🔄'
        },
        { 
            title: 'Famille & Mode de vie',
            contentKey: 'FAMILLE ET MODE DE VIE',
            ratingKey: 'Rating_Famille',
            icon: '👨‍👩‍👦'
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

        // Debug: Afficher toutes les données reçues
        console.log('Données reçues:', row);

        // Générer l'ID du rapport
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

        // === Évaluations avec ratings ===
        const evalGrid = document.getElementById('evalGrid');
        evalGrid.innerHTML = EVALUATIONS_MAP.map(function(evalItem) {
            const content = row[evalItem.contentKey] || '';
            const rating = row[evalItem.ratingKey] || '';
            
            // Afficher le rating avec une étoile
            let ratingDisplay = '';
            if (rating) {
                const stars = '⭐'.repeat(Math.min(parseInt(rating) || 0, 3));
                ratingDisplay = '<span class="eval-rating">' + stars + ' Rating : ' + rating + '/3</span>';
            } else {
                ratingDisplay = '<span class="eval-rating no-rating">Rating : Non renseigné</span>';
            }
            
            return '<div class="eval-card">' +
                '<div class="eval-header">' +
                '<span class="eval-icon">' + evalItem.icon + '</span>' +
                '<span class="eval-title">' + evalItem.title + '</span>' +
                ratingDisplay +
                '</div>' +
                '<div class="eval-content">' + (content || 'Non renseigné') + '</div>' +
                '</div>';
        }).join('');

        // === Recommandations et commentaires ===
        document.getElementById('recommandationsContent').textContent = row["RECOMMANDATIONS À FAIRE PARTIE DE L'ORGANISATION"] || 'Non renseigné';
        document.getElementById('autresContent').textContent = row['AUTRES'] || 'Non renseigné';
        document.getElementById('notesContent').textContent = row['NOTES ET COMMENTAIRES'] || 'Non renseigné';

        // === Date du rapport ===
        document.getElementById('reportDate').textContent = new Date().toLocaleDateString('fr-FR');

        // Stocker les données pour le PDF
        window.currentReportData = row;
    }

    // ==================== Générer le PDF ====================
    function generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        let y = 20;

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

        function addPageHeader(pageNum, totalPages) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#1E293B');
            doc.text('AXIAN', 20, 20);

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor('#64748B');
            doc.text('LET\'S GROW TOGETHER', 20, 26);
            doc.text('connectee', 20, 32);
            doc.text('CHAQUE EXPÉRIENCE EST UNIQUE', 20, 38);

            doc.setFontSize(8);
            doc.setTextColor('#94A3B8');
            doc.text('VERSION 1.00', 20, 44);
            doc.text('28/01/22', 20, 49);

            doc.text('Page ' + pageNum + ' sur ' + totalPages, 190, 49, { align: 'right' });

            doc.setDrawColor('#E2E8F0');
            doc.setLineWidth(0.5);
            doc.line(20, 54, 190, 54);

            return 58;
        }

        // ===== PAGE 1 =====
        var yPos = addPageHeader(1, 5);
        yPos += 10;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#1E293B');
        doc.text('RAPPORT D\'EXIT', 105, yPos, { align: 'center' });
        yPos += 15;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');

        var infoFields = [
            { label: 'Matricule :', value: data['Matricule'] || '' },
            { label: 'Nom et prénom :', value: data['Nom et Prénoms'] || '' },
            { label: 'Poste :', value: data['Poste'] || '' },
            { label: 'Direction :', value: data['Direction'] || '' },
            { label: "Date d'embauche :", value: data["Date d'embauche"] || '' },
            { label: "Période d'essai :", value: data["Période d'essai"] || '' },
            { label: 'Contrat :', value: data['Contrat'] || '' },
            { label: 'Date du rapport :', value: data['Date de rapport'] || new Date().toLocaleDateString('fr-FR') }
        ];

        var xPos = 20;
        var yInfo = yPos;
        infoFields.slice(0, 4).forEach(function(field, index) {
            doc.setFont('helvetica', 'bold');
            doc.text(field.label, xPos, yInfo + (index * 7));
            doc.setFont('helvetica', 'normal');
            doc.text(field.value, xPos + 45, yInfo + (index * 7));
        });

        xPos = 110;
        infoFields.slice(4).forEach(function(field, index) {
            doc.setFont('helvetica', 'bold');
            doc.text(field.label, xPos, yInfo + (index * 7));
            doc.setFont('helvetica', 'normal');
            doc.text(field.value, xPos + 45, yInfo + (index * 7));
        });

        yPos += 35;

        // RAISONS DU DÉPART
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('RAISONS DU DÉPART', 20, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#64748B');
        var guideText = 'Questions guides : Quelle est votre principale raison de départ ? Qu\'est ce qui aurait pu être fait pour vous encourager à rester ?';
        yPos = addWrappedText(guideText, 20, yPos, 170, 9, 5);
        yPos += 3;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        yPos = addWrappedText(data['Raison de départ'] || 'Non renseigné', 20, yPos, 170, 9, 5);
        yPos += 10;

        // GRILLE DE CLASSEMENT
        doc.setFontSize(11);
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
        yPos += 12;

        // ===== ÉVALUATIONS AVEC RATINGS =====
        const evaluations = [
            { title: 'INSATISFACTION AU POSTE', content: data['INSATISFACTION AU POSTE'] || 'Non renseigné', rating: data['Rating_Insatisfaction'] || 'Non renseigné' },
            { title: "CULTURE D'ENTREPRISE ET ENVIRONNEMENT DE TRAVAIL", content: data["CULTURE D'ENTREPRISE ET ENVIRONNEMENT DE TRAVAIL"] || 'Non renseigné', rating: data['Rating_Culture'] || 'Non renseigné' },
            { title: 'LEADERSHIP', content: data['LEADERSHIP'] || 'Non renseigné', rating: data['Rating_Leadership'] || 'Non renseigné' },
            { title: "OPPORTUNITÉS D'ÉVOLUTION DE CARRIÈRE", content: data["OPPORTUNITÉS D'ÉVOLUTION DE CARRIÈRE"] || 'Non renseigné', rating: data['Rating_Opportunites'] || 'Non renseigné' },
            { title: 'FORMATION ET DEVELOPPEMENT DES COMPETENCES', content: data['FORMATION ET DEVELOPPEMENT DES COMPETENCES'] || 'Non renseigné', rating: data['Rating_Formation'] || 'Non renseigné' },
            { title: 'SALAIRES ET AVANTAGES', content: data['SALAIRES ET AVANTAGES'] || 'Non renseigné', rating: data['Rating_Salaires'] || 'Non renseigné' },
            { title: "CHANGEMENT DE L'ÉVOLUTION DE CARRIERE", content: data["CHANGEMENT DE L'ÉVOLUTION DE CARRIERE"] || 'Non renseigné', rating: data['Rating_Changement'] || 'Non renseigné' },
            { title: 'FAMILLE ET MODE DE VIE', content: data['FAMILLE ET MODE DE VIE'] || 'Non renseigné', rating: data['Rating_Famille'] || 'Non renseigné' }
        ];

        evaluations.forEach(function(evalItem, index) {
            if (index > 0 && index % 2 === 0) {
                doc.addPage();
                yPos = addPageHeader(Math.floor(index/2) + 2, 5);
                yPos += 10;
            }

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#4F46E5');
            doc.text(evalItem.title, 20, yPos);
            yPos += 5;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor('#1E293B');
            
            var lines = doc.splitTextToSize(evalItem.content, 170);
            lines.forEach(function(line, idx) {
                doc.text(line, 20, yPos + (idx * 5));
            });
            yPos += (lines.length * 5) + 4;

            doc.setFont('helvetica', 'bold');
            doc.setTextColor('#4F46E5');
            doc.text('Rating : ' + evalItem.rating, 20, yPos);
            yPos += 12;

            if (index < evaluations.length - 1) {
                doc.setDrawColor('#E2E8F0');
                doc.setLineWidth(0.3);
                doc.line(20, yPos, 190, yPos);
                yPos += 4;
            }
        });

        // ===== DERNIERE PAGE =====
        doc.addPage();
        yPos = addPageHeader(5, 5);
        yPos += 10;

        // RECOMMANDATIONS
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('RECOMMANDATIONS À FAIRE PARTIE DE L\'ORGANISATION', 20, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        yPos = addWrappedText(data["RECOMMANDATIONS À FAIRE PARTIE DE L'ORGANISATION"] || 'Non renseigné', 20, yPos, 170, 9, 5);
        yPos += 8;

        // AUTRES
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('AUTRES', 20, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        yPos = addWrappedText(data['AUTRES'] || 'Non renseigné', 20, yPos, 170, 9, 5);
        yPos += 8;

        // NOTES ET COMMENTAIRES
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('NOTES ET COMMENTAIRES', 20, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1E293B');
        yPos = addWrappedText(data['NOTES ET COMMENTAIRES'] || 'Non renseigné', 20, yPos, 170, 9, 5);
        yPos += 10;

        // CADRE RH
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#4F46E5');
        doc.text('CADRE RESERVE A LA RH', 20, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#1E293B');
        doc.text('Date du rapport :', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date().toLocaleDateString('fr-FR'), 70, yPos);
        yPos += 10;

        doc.text('Signature de l\'employé : _________________', 20, yPos);

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