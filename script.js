// ==================== script2.js - Version avec formatage des dates corrigé ====================

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchMatricule');
    const resultContainer = document.getElementById('resultContainer');
    const messageDiv = document.getElementById('responseMessage');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const printPdfBtn = document.getElementById('printPdfBtn');

    // API URL - REMPLACEZ AVEC VOTRE URL
    const API_URL = 'https://script.google.com/macros/s/AKfycbx5eCZGF0KbEHhC2tuEDoHqY6GzKasIkGC2prhic5kyaR4EcZrG5RXPv5z8wtXeo_1k/exec';

    // ==================== FONCTION DE FORMATAGE DES DATES ====================
    function formatDate(dateValue) {
        if (!dateValue) return '';
        
        // Si c'est déjà une chaîne au format YYYY-MM-DD
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }
        
        try {
            let date;
            
            // Si c'est une chaîne ISO (2026-06-22T21:00:00.000Z)
            if (typeof dateValue === 'string' && dateValue.includes('T')) {
                date = new Date(dateValue);
            } 
            // Si c'est un nombre (timestamp)
            else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            }
            // Si c'est un objet Date
            else if (dateValue instanceof Date) {
                date = dateValue;
            }
            // Si c'est une autre chaîne
            else if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else {
                return String(dateValue);
            }
            
            // Vérifier si la date est valide
            if (isNaN(date.getTime())) {
                return String(dateValue);
            }
            
            // Format YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return year + '-' + month + '-' + day;
            
        } catch (error) {
            console.warn('Erreur de formatage de date:', error);
            return String(dateValue);
        }
    }

    // ==================== FONCTION POUR FORMATER LES DATES DANS UN OBJET ====================
    function formatDatesInObject(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        
        // Liste des champs qui contiennent des dates
        const dateFields = [
            "Date d'embauche",
            'Date de rapport',
            'Date de soumission',
            'dateEmbauche',
            'dateRapport',
            'dateSoumission'
        ];
        
        const formattedObj = { ...obj };
        
        dateFields.forEach(field => {
            if (formattedObj[field] !== undefined && formattedObj[field] !== null && formattedObj[field] !== '') {
                formattedObj[field] = formatDate(formattedObj[field]);
            }
        });
        
        return formattedObj;
    }

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
            console.log('Résultat de recherche (brut):', response);

            if (response.success) {
                // === FORMATER LES DATES DANS LE RÉSULTAT ===
                if (response.data && response.data.row) {
                    response.data.row = formatDatesInObject(response.data.row);
                    console.log('Résultat avec dates formatées:', response.data.row);
                }
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
            { label: "Date d'embauche", value: formatDate(row["Date d'embauche"]) || '' },
            { label: "Période d'essai", value: row["Période d'essai"] || '' },
            { label: 'Contrat', value: row['Contrat'] || '' },
            { label: 'Date du rapport', value: formatDate(row['Date de rapport']) || new Date().toLocaleDateString('fr-FR') }
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

        // Stocker les données pour le PDF avec dates formatées
        window.currentReportData = row;
    }

    // ==================== Générer le PDF - Design amélioré ====================
    function generatePDF(data) {
        // Les dates sont déjà formatées dans data
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // ---------- Palette de couleurs ----------
        const COLOR_PRIMARY        = '#0D9488';
        const COLOR_PRIMARY_LIGHT  = '#CCFBF1';
        const COLOR_DARK           = '#1E293B';
        const COLOR_GRAY           = '#64748B';
        const COLOR_GRAY_LIGHT     = '#94A3B8';
        const COLOR_BORDER         = '#CBD5E1';
        const COLOR_GUIDE_BG       = '#F1F5F9';
        const COLOR_ROW_ALT        = '#F8FAFC';

        const MARGIN = 20;
        const CONTENT_WIDTH = 170;
        const PAGE_BOTTOM_LIMIT = 278;

        // ---------- En-tête de page ----------
        function addPageHeader() {
            doc.setFillColor(COLOR_PRIMARY);
            doc.roundedRect(MARGIN, 14, 8, 8, 1, 1, 'F');
            doc.setTextColor('#FFFFFF');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text('A', MARGIN + 4, 19.3, { align: 'center' });

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLOR_DARK);
            doc.text('AXIAN', MARGIN + 11, 19);

            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLOR_GRAY);
            doc.text("LET'S GROW TOGETHER", MARGIN + 11, 23.3);

            doc.setFontSize(8);
            doc.setTextColor(COLOR_GRAY_LIGHT);
            doc.text('VERSION 1.00', 190, 16, { align: 'right' });
            doc.text('28/01/22', 190, 20.5, { align: 'right' });

            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLOR_PRIMARY);
            doc.text("RAPPORT D'EXIT", 105, 36, { align: 'center' });

            doc.setDrawColor(COLOR_PRIMARY);
            doc.setLineWidth(0.6);
            doc.line(MARGIN, 41, 190, 41);

            return 47;
        }

        function newPage() {
            doc.addPage();
            return addPageHeader();
        }

        function checkPageBreak(y, neededHeight) {
            if (y + neededHeight > PAGE_BOTTOM_LIMIT) {
                return newPage();
            }
            return y;
        }

        // ---------- Rendu générique d'une section ----------
        function renderSection(title, guideText, content, rating, y) {
            const fontSizeContent = 9;
            const lineHeightContent = 5;
            const hasRating = rating !== null && rating !== undefined && rating !== '';
            const boxWidth = hasRating ? 140 : CONTENT_WIDTH;

            const contentLines = doc.splitTextToSize(String(content || 'Non renseigné'), boxWidth - 8);
            const boxHeight = Math.max(18, contentLines.length * lineHeightContent + 8);

            const guideLines = guideText ? doc.splitTextToSize(guideText, CONTENT_WIDTH - 6) : [];
            const guideHeight = guideText ? (guideLines.length * 3.6 + 4) : 0;

            const totalNeeded = 8 + guideHeight + 3 + boxHeight + 9;
            y = checkPageBreak(y, totalNeeded);

            // Bandeau de titre
            doc.setFillColor(COLOR_PRIMARY);
            doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
            doc.setTextColor('#FFFFFF');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(title, MARGIN + 3, y + 5.5);
            y += 8;

            // Question guide
            if (guideText) {
                doc.setFillColor(COLOR_GUIDE_BG);
                doc.rect(MARGIN, y, CONTENT_WIDTH, guideHeight, 'F');
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(7.5);
                doc.setTextColor(COLOR_GRAY);
                guideLines.forEach(function(line, i) {
                    doc.text(line, MARGIN + 3, y + 4 + i * 3.6);
                });
                y += guideHeight + 3;
            }

            // Cadre de réponse
            doc.setDrawColor(COLOR_BORDER);
            doc.setLineWidth(0.3);
            doc.rect(MARGIN, y, boxWidth, boxHeight);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(fontSizeContent);
            doc.setTextColor(COLOR_DARK);
            contentLines.forEach(function(line, i) {
                doc.text(line, MARGIN + 4, y + 6 + i * lineHeightContent);
            });

            // Cadre de la note
            if (hasRating) {
                const ratingX = MARGIN + boxWidth + 4;
                const ratingWidth = CONTENT_WIDTH - boxWidth - 4;

                doc.setFillColor(COLOR_PRIMARY_LIGHT);
                doc.setDrawColor(COLOR_PRIMARY);
                doc.setLineWidth(0.4);
                doc.rect(ratingX, y, ratingWidth, boxHeight, 'FD');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(6.5);
                doc.setTextColor(COLOR_PRIMARY);
                doc.text('NOTE', ratingX + ratingWidth / 2, y + 7, { align: 'center' });

                doc.setFontSize(18);
                doc.text(String(rating), ratingX + ratingWidth / 2, y + boxHeight / 2 + 5, { align: 'center' });

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(6.5);
                doc.setTextColor(COLOR_GRAY);
                doc.text('/ 3', ratingX + ratingWidth / 2, y + boxHeight - 4, { align: 'center' });
            }

            return y + boxHeight + 9;
        }

        // ============================================================
        // PAGE 1 - Informations générales
        // ============================================================
        let y = addPageHeader();

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(COLOR_PRIMARY);
        doc.text('INFORMATIONS GÉNÉRALES', MARGIN, y);
        y += 4;

        // Utiliser formatDate pour afficher les dates dans le PDF
        const infoData = [
            ['Matricule', data['Matricule'] || '', "Date d'embauche", formatDate(data["Date d'embauche"]) || ''],
            ['Nom et prénom', data['Nom et Prénoms'] || '', "Période d'essai", data["Période d'essai"] || ''],
            ['Poste', data['Poste'] || '', 'Contrat', data['Contrat'] || ''],
            ['Direction', data['Direction'] || '', 'Date du rapport', formatDate(data['Date de rapport']) || new Date().toLocaleDateString('fr-FR')]
        ];

        const rowHeight = 7;
        const colWidths = [33, 52, 38, 47];
        doc.setDrawColor(COLOR_BORDER);
        doc.setLineWidth(0.3);

        infoData.forEach(function(row, i) {
            const rowY = y + i * rowHeight;
            if (i % 2 === 0) {
                doc.setFillColor(COLOR_ROW_ALT);
                doc.rect(MARGIN, rowY, CONTENT_WIDTH, rowHeight, 'F');
            }
            let cx = MARGIN;
            colWidths.forEach(function(w) {
                doc.rect(cx, rowY, w, rowHeight);
                cx += w;
            });

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(COLOR_GRAY);
            doc.text(row[0] + ' :', MARGIN + 2, rowY + 4.7);
            doc.text(row[2] + ' :', MARGIN + colWidths[0] + colWidths[1] + 2, rowY + 4.7);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLOR_DARK);
            doc.text(String(row[1]), MARGIN + colWidths[0] + 2, rowY + 4.7);
            doc.text(String(row[3]), MARGIN + colWidths[0] + colWidths[1] + colWidths[2] + 2, rowY + 4.7);
        });

        y += infoData.length * rowHeight + 10;

        // RAISONS DU DÉPART
        y = renderSection(
            'RAISONS DU DÉPART',
            "Quelle est votre principale raison de départ ? Qu'est-ce qui aurait pu être fait pour vous encourager à rester au sein de notre organisation / de votre poste ?",
            data['Raison de départ'],
            null,
            y
        );

        // Légende de la grille de notation
        y = checkPageBreak(y, 28);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(COLOR_PRIMARY);
        doc.text('GRILLE DE CLASSEMENT DES APPRÉCIATIONS', MARGIN, y);
        y += 5;

        const legend = [
            ['1', "N'est pas un facteur pris en compte dans la décision de partir"],
            ['2', 'Est un facteur mineur dans la décision de partir'],
            ['3', 'Est un facteur majeur dans la décision de partir']
        ];
        legend.forEach(function(item) {
            doc.setFillColor(COLOR_PRIMARY);
            doc.circle(MARGIN + 2.5, y, 2.5, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor('#FFFFFF');
            doc.text(item[0], MARGIN + 2.5, y + 1, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(COLOR_DARK);
            doc.text(item[1], MARGIN + 7, y + 1);
            y += 6;
        });
        y += 6;

        // Sections notées
        EVALUATIONS_MAP.forEach(function(evalItem) {
            y = renderSection(
                evalItem.title,
                evalItem.guide,
                data[evalItem.contentKey],
                data[evalItem.ratingKey],
                y
            );
        });

        // Sections sans note
        y = renderSection(
            "RECOMMANDATIONS À FAIRE PARTIE DE L'ORGANISATION",
            "Recommanderiez-vous quelqu'un de votre famille ou proches connaissances à travailler pour notre organisation ? Pourquoi ? Pourquoi pas ?",
            data["RECOMMANDATIONS À FAIRE PARTIE DE L'ORGANISATION"],
            null,
            y
        );

        y = renderSection(
            'AUTRES',
            "Envisagez-vous de retourner un jour pour refaire partie de notre organisation ? Pourquoi ? Pourquoi pas ? Quels changements devrions-nous entamer pour vous pousser à revenir ?",
            data['AUTRES'],
            null,
            y
        );

        y = renderSection(
            'NOTES ET COMMENTAIRES',
            "Est-ce qu'il y a des commentaires que vous souhaitez faire concernant notre relation de travail ?",
            data['NOTES ET COMMENTAIRES'],
            null,
            y
        );

        // Cadre réservé à la RH
        y = checkPageBreak(y, 45);
        doc.setFillColor(COLOR_PRIMARY);
        doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
        doc.setTextColor('#FFFFFF');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('CADRE RÉSERVÉ À LA RH', MARGIN + 3, y + 5.5);
        y += 13;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(COLOR_DARK);
        doc.text('Interviewers :', MARGIN, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('1- ' + (data['Interviewers 1'] || ''), MARGIN, y);
        y += 6;
        doc.text('2- ' + (data['Interviewers 2'] || ''), MARGIN, y);
        y += 12;

        doc.setDrawColor(COLOR_BORDER);
        doc.line(MARGIN, y, MARGIN + 80, y);
        doc.line(MARGIN + 90, y, MARGIN + 170, y);

        doc.setFontSize(8);
        doc.setTextColor(COLOR_GRAY);
        doc.text('Date du rapport : ' + (formatDate(data['Date de rapport']) || new Date().toLocaleDateString('fr-FR')), MARGIN, y + 5);
        doc.text("Signature de l'employé", MARGIN + 90, y + 5);

        // Numérotation finale des pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(COLOR_GRAY_LIGHT);
            doc.text('Page ' + p + ' sur ' + totalPages, 190, 25, { align: 'right' });
        }

        // Sauvegarder le PDF
        const fileName = 'Rapport_Exit_' + (data['Nom et Prénoms'] || 'Anonyme') + '_' + new Date().toISOString().split('T')[0] + '.pdf';
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