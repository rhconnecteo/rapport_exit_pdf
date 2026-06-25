// ==================== script.js - Version avec édition RH ====================

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchMatricule');
    const resultContainer = document.getElementById('resultContainer');
    const messageDiv = document.getElementById('responseMessage');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const printPdfBtn = document.getElementById('printPdfBtn');
    const updateBtn = document.getElementById('updateBtn');
    const resetBtn = document.getElementById('resetBtn');

    // API URL - REMPLACEZ AVEC VOTRE URL
    const API_URL = 'https://script.google.com/macros/s/AKfycbwG5cX7NwhZL9KF0InSxOnqbp_jnpf3er_LNy_9n2R7Dazoa2c2j4sjbeEwCWDCHd4-/exec';

    // ==================== LOGOS (base64) pour le PDF ====================
    const AXIAN_LOGO_BASE64 = 'data:image/png;base64,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';
    const CONNECTEO_LOGO_BASE64 = 'data:image/png;base64,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';

    // ==================== FONCTION DE FORMATAGE DES DATES ====================
    function formatDate(dateValue) {
        if (!dateValue) return '';
        
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }
        
        try {
            let date;
            
            if (typeof dateValue === 'string' && dateValue.includes('T')) {
                date = new Date(dateValue);
            } 
            else if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            }
            else if (dateValue instanceof Date) {
                date = dateValue;
            }
            else if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else {
                return String(dateValue);
            }
            
            if (isNaN(date.getTime())) {
                return String(dateValue);
            }
            
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

    // ==================== Appel POST pour la mise à jour ====================
    function callPostAPI(data, callback) {
        const script = document.createElement('script');
        const callbackName = 'jsonp_callback_' + Date.now();

        // Construire l'URL avec les paramètres pour la requête POST via JSONP
        let url = API_URL + '?callback=' + encodeURIComponent(callbackName);
        
        // Ajouter tous les paramètres
        Object.keys(data).forEach(key => {
            url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        });

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
                if (response.data && response.data.row) {
                    response.data.row = formatDatesInObject(response.data.row);
                    console.log('Résultat avec dates formatées:', response.data.row);
                }
                displayResults(response.data);
                showMessage('✅ Employé trouvé ! Matricule : ' + matricule, 'success');
                resultContainer.style.display = 'block';
                // Activer les champs d'édition
                enableEditFields(true);
            } else {
                showMessage('❌ ' + response.message, 'error');
                resultContainer.style.display = 'none';
                enableEditFields(false);
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

        // === Champs d'édition - Interviewers et Notes ===
        document.getElementById('editInterviewer1').value = row['Interviewers 1'] || '';
        document.getElementById('editInterviewer2').value = row['Interviewers 2'] || '';
        document.getElementById('editNotes').value = row['Notes'] || '';

        // === Date du rapport ===
        // document.getElementById('reportDate').textContent = new Date().toLocaleDateString('fr-FR');

        // Stocker les données pour le PDF avec dates formatées
        window.currentReportData = row;
        window.currentMatricule = row['Matricule'] || '';
    }

    // ==================== Activer/Désactiver les champs d'édition ====================
    function enableEditFields(enabled) {
        const inputs = ['editInterviewer1', 'editInterviewer2', 'editNotes'];
        inputs.forEach(id => {
            document.getElementById(id).disabled = !enabled;
        });
        document.getElementById('updateBtn').disabled = !enabled;
        document.getElementById('resetBtn').disabled = !enabled;
    }

    // ==================== Mettre à jour les données ====================
    function updateInterviewersNotes() {
        const matricule = window.currentMatricule;
        if (!matricule) {
            showEditStatus('❌ Aucun employé sélectionné', 'error');
            return;
        }

        const interviewer1 = document.getElementById('editInterviewer1').value.trim();
        const interviewer2 = document.getElementById('editInterviewer2').value.trim();
        const notes = document.getElementById('editNotes').value.trim();

        showEditStatus('⏳ Mise à jour en cours...', 'info');

        const data = {
            action: 'updateInterviewers',
            matricule: matricule,
            interviewer1: interviewer1,
            interviewer2: interviewer2,
            notes: notes
        };

        callPostAPI(data, function(response) {
            console.log('Réponse mise à jour:', response);
            
            if (response.success) {
                showEditStatus('✅ ' + response.message, 'success');
                // Mettre à jour l'affichage avec les nouvelles données
                if (response.data) {
                    // Mettre à jour les données stockées
                    window.currentReportData = response.data;
                    // Mettre à jour l'affichage des champs d'édition
                    document.getElementById('editInterviewer1').value = response.data['Interviewers 1'] || '';
                    document.getElementById('editInterviewer2').value = response.data['Interviewers 2'] || '';
                    document.getElementById('editNotes').value = response.data['Notes'] || '';
                    
                    // Mettre à jour les données pour le PDF
                    window.currentReportData = response.data;
                }
                showMessage('✅ Données mises à jour avec succès !', 'success');
            } else {
                showEditStatus('❌ ' + response.message, 'error');
                showMessage('❌ ' + response.message, 'error');
            }
        });
    }

    // ==================== Réinitialiser les champs d'édition ====================
    function resetEditFields() {
        if (window.currentReportData) {
            document.getElementById('editInterviewer1').value = window.currentReportData['Interviewers 1'] || '';
            document.getElementById('editInterviewer2').value = window.currentReportData['Interviewers 2'] || '';
            document.getElementById('editNotes').value = window.currentReportData['Notes'] || '';
            showEditStatus('↺ Champs réinitialisés', 'info');
        } else {
            document.getElementById('editInterviewer1').value = '';
            document.getElementById('editInterviewer2').value = '';
            document.getElementById('editNotes').value = '';
            showEditStatus('↺ Champs vidés', 'info');
        }
    }

    // ==================== Afficher le statut d'édition ====================
    function showEditStatus(message, type) {
        const statusDiv = document.getElementById('editStatus');
        statusDiv.textContent = message;
        statusDiv.className = 'edit-status ' + type;
        statusDiv.style.display = 'block';

        if (type !== 'error' && type !== 'success') {
            setTimeout(function() {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }

    // ==================== Générer le PDF - Design amélioré ====================
    function generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

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

        // Position et largeurs des colonnes du tableau d'en-tête
        const HEADER_TABLE_TOP = 12;
        const HEADER_ROW1_HEIGHT = 18;
        const HEADER_ROW2_HEIGHT = 10;
        const HEADER_COL_WIDTHS = [55, 35, 30, 25, 25]; // Axian | Connecteo | Version | Date | Page  -> total 170
        const HEADER_VERSION_TEXT = 'VERSION 1.00';
        const HEADER_DATE_TEXT = '28/01/22';

        function addPageHeader() {
            const tableX = MARGIN;
            const tableY = HEADER_TABLE_TOP;
            const tableWidth = CONTENT_WIDTH;
            const row1Y = tableY;
            const row2Y = tableY + HEADER_ROW1_HEIGHT;
            const tableBottom = row2Y + HEADER_ROW2_HEIGHT;

            // Calcul des positions X cumulées des colonnes
            const colX = [tableX];
            HEADER_COL_WIDTHS.forEach(function(w, i) {
                colX.push(colX[i] + w);
            });

            // ---- Cadre extérieur + séparation des 2 lignes ----
            doc.setDrawColor(COLOR_DARK);
            doc.setLineWidth(0.4);
            doc.rect(tableX, tableY, tableWidth, HEADER_ROW1_HEIGHT + HEADER_ROW2_HEIGHT);
            doc.line(tableX, row2Y, tableX + tableWidth, row2Y);

            // ---- Séparateurs verticaux de la ligne 1 (entre les 5 cellules) ----
            doc.setLineWidth(0.3);
            for (let i = 1; i < HEADER_COL_WIDTHS.length; i++) {
                doc.line(colX[i], row1Y, colX[i], row2Y);
            }

            // ---- Cellule 1 : Logo AXIAN (avec la signature intégrée à l'image) ----
            const axianImgWidth = 38;
            const axianImgHeight = axianImgWidth * (160 / 415);
            const axianX = colX[0] + (HEADER_COL_WIDTHS[0] - axianImgWidth) / 2;
            const axianY = row1Y + (HEADER_ROW1_HEIGHT - axianImgHeight) / 2;
            doc.addImage(AXIAN_LOGO_BASE64, 'PNG', axianX, axianY, axianImgWidth, axianImgHeight);

            // ---- Cellule 2 : Logo CONNECTEO ----
            const connecteoImgWidth = 30;
            const connecteoImgHeight = connecteoImgWidth * (53 / 243);
            const connecteoX = colX[1] + (HEADER_COL_WIDTHS[1] - connecteoImgWidth) / 2;
            const connecteoY = row1Y + (HEADER_ROW1_HEIGHT - connecteoImgHeight) / 2;
            doc.addImage(CONNECTEO_LOGO_BASE64, 'PNG', connecteoX, connecteoY, connecteoImgWidth, connecteoImgHeight);

            // ---- Cellule 3 : VERSION ----
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(COLOR_DARK);
            doc.text(HEADER_VERSION_TEXT, colX[2] + HEADER_COL_WIDTHS[2] / 2, row1Y + HEADER_ROW1_HEIGHT / 2 + 1, { align: 'center' });

            // ---- Cellule 4 : DATE ----
            doc.text(HEADER_DATE_TEXT, colX[3] + HEADER_COL_WIDTHS[3] / 2, row1Y + HEADER_ROW1_HEIGHT / 2 + 1, { align: 'center' });

            // ---- Cellule 5 : PAGE (mis à jour après génération de toutes les pages) ----
            // Le texte définitif "Page X sur Y" est écrit dans la boucle finale après doc.save()
            // On mémorise les coordonnées pour qu'elles soient réutilisées ensuite.
            doc._headerPageCellCenterX = colX[4] + HEADER_COL_WIDTHS[4] / 2;
            doc._headerPageCellCenterY = row1Y + HEADER_ROW1_HEIGHT / 2 + 1;

            // ---- Ligne 2 : Titre "RAPPORT D'EXIT" centré ----
            doc.setFontSize(15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(COLOR_PRIMARY);
            doc.text("RAPPORT D'EXIT", tableX + tableWidth / 2, row2Y + HEADER_ROW2_HEIGHT / 2 + 2, { align: 'center' });

            return tableBottom + 7;
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

            doc.setFillColor(COLOR_PRIMARY);
            doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
            doc.setTextColor('#FFFFFF');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(title, MARGIN + 3, y + 5.5);
            y += 8;

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

            doc.setDrawColor(COLOR_BORDER);
            doc.setLineWidth(0.3);
            doc.rect(MARGIN, y, boxWidth, boxHeight);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(fontSizeContent);
            doc.setTextColor(COLOR_DARK);
            contentLines.forEach(function(line, i) {
                doc.text(line, MARGIN + 4, y + 6 + i * lineHeightContent);
            });

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
        y += 6;
        doc.setFont('helvetica', 'bold');
        doc.text('Notes :', MARGIN, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const notesLines = doc.splitTextToSize(data['Notes'] || '', CONTENT_WIDTH);
        notesLines.forEach(function(line, i) {
            doc.text(line, MARGIN, y + i * 5);
        });
        y += notesLines.length * 5 + 12;

        const totalPages = doc.internal.getNumberOfPages();
        const pageCellCenterX = HEADER_TABLE_TOP !== undefined
            ? (MARGIN + HEADER_COL_WIDTHS[0] + HEADER_COL_WIDTHS[1] + HEADER_COL_WIDTHS[2] + HEADER_COL_WIDTHS[3] + HEADER_COL_WIDTHS[4] / 2)
            : 190;
        const pageCellCenterY = HEADER_TABLE_TOP + HEADER_ROW1_HEIGHT / 2 + 1;
        for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(COLOR_DARK);
            doc.text('Page ' + p + ' sur ' + totalPages, pageCellCenterX, pageCellCenterY, { align: 'center' });
        }

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

    // Écouteurs pour l'édition
    updateBtn.addEventListener('click', updateInterviewersNotes);
    resetBtn.addEventListener('click', resetEditFields);

    // Désactiver les champs d'édition au départ
    enableEditFields(false);

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