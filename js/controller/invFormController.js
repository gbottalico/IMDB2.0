imdbFanta.controller('invFormCtrl', function($scope, $http, $timeout, $filter, $sce) {

    var pwdTest = 'testinvio';
    $scope.invioFake = false;
    $scope.difesa = true;
    $scope.loading = true;
    $scope.loadingForm = false;
    $scope.showSquadra = false;
    $scope.inviabile = true;
    $scope.needSchedina = true;
    $scope.ruolo = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
    $scope.moduloInserito = new Array(0, 0, 0, 0);
    $scope.moduliAmmessi = [new Array(1, 3, 4, 3), new Array(1, 3, 5, 2), new Array(1, 3, 6, 1), new Array(1, 4, 3, 3), new Array(1, 4, 4, 2),
        new Array(1, 4, 5, 1), new Array(1, 5, 2, 3), new Array(1, 5, 3, 2), new Array(1, 5, 4, 1), new Array(1, 6, 3, 1)
    ];
    $scope.disegnoCampo = [{
        ruolo: 1,
        num: 1,
        ids: '1'
    }, {
        ruolo: 2,
        num: 1,
        ids: '1'
    }, {
        ruolo: 2,
        num: 2,
        ids: '1,2'
    }, {
        ruolo: 2,
        num: 3,
        ids: '1,2,3'
    }, {
        ruolo: 2,
        num: 4,
        ids: '1,2,4,5'
    }, {
        ruolo: 2,
        num: 5,
        ids: '1,2,3,4,5'
    }, {
        ruolo: 2,
        num: 6,
        ids: '1,2,3,4,5,6'
    }, {
        ruolo: 3,
        num: 1,
        ids: '2'
    }, {
        ruolo: 3,
        num: 2,
        ids: '2,3'
    }, {
        ruolo: 3,
        num: 3,
        ids: '1,2,3'
    }, {
        ruolo: 3,
        num: 4,
        ids: '2,3,5,6'
    }, {
        ruolo: 3,
        num: 5,
        ids: '1,2,3,5,6'
    }, {
        ruolo: 3,
        num: 6,
        ids: '1,2,3,4,5,6'
    }, {
        ruolo: 4,
        num: 1,
        ids: '1'
    }, {
        ruolo: 4,
        num: 2,
        ids: '2,3'
    }, {
        ruolo: 4,
        num: 3,
        ids: '1,2,3'
    }];
    $scope.moduloOk = false;

    $scope.titolari = [];
    $scope.riserve = [];
    $scope.listaGiocatoriTitolarita = [];

    /*$.ajax({
        url: 'http://www.fantaformazione.com/fantacalcio.calendari/probabili/Home.htm',
        type: 'GET',
        success: function(res) {            
            */$http.get('service/squadreService.php').success(function(data) {                
                $scope.squadre = data;
                $scope.loading = false;
            });     
            /*$scope.listaPartite = res.responseText.split('src="imgs/').join('src="http://www.fantaformazione.com/imgs/').split('src="modules/').join('src="http://www.fantaformazione.com/modules/').split('src="templates/').join('src="http://www.fantaformazione.com/templates/');
            $scope.caricaListaGiocatoriTitolarita();       
        }
    });*/

    $http.get('service/termineService.php').success(function(data) {
        // TODO decommentare quando il sito torna attivo
        //$scope.termine = data.trim();
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate = $.datepicker.formatDate('dd/mm/yy', currentDate);
        $scope.termine = currentDate;
    });

    $http.get('service/prossimaService.php').success(function(data) {
        $scope.listaIncontri = data.filter(function(row) {
            if (row.competizione == 'Campionato') {
                return true;
            } else {
                return false;
            }
        });
    });

    /*
     *	Apre il pannellino per l'inserimento della password della squadra selezionata. Se il termine di invio è scaduto, mostra un messaggio di errore
     */
    $scope.inserisciPassword = function(squadraSelected) {
        var termineInvio = $scope.termine.substring(6, 10) + $scope.termine.substring(3, 5) +
            $scope.termine.substring(0, 2) + $scope.termine.substring(11, 13) + $scope.termine.substring(14, 16);
        var data = new Date();
        var ora = "" + data.getFullYear() + formatNumber(data.getMonth() + 1) + formatNumber(data.getDate()) +
            formatNumber(data.getHours()) + formatNumber(data.getMinutes());
        if (ora < termineInvio) {
            $('#divPassword').addClass('imdb-visible');
            $scope.inviabile = true;
            $('input[name=password]').val('');
            $scope.squadraSelected = squadraSelected;
        } else {
            $('#divConferma').addClass('imdb-visible');
            $('#confermaTitle').text('Termine invio scaduto');
            $('#confermaText').text('Il termine per inviare la formazione è scaduto!');
        }
        $('.imdb-overlay').show();
    }

    $scope.closePasswordDiv = function() {
        $('.imdb-overlay').hide();
        $('#divPassword').removeClass('imdb-visible');
    }

    $scope.closeSchedinaDiv = function() {
        $('.imdb-overlay').hide();
        $('#divSchedina').removeClass('imdb-visible');
    }

    $scope.closeConfermaDiv = function() {
        $('.imdb-overlay').hide();
        $('#divConferma').removeClass('imdb-visible');
    }

    $scope.visualizzaSquadra = function(squadraSelected) {
        $('.menuItemInv').removeClass('selected');
        var infoSquadra = $scope.squadre.filter(function(row) {
            if (row.idSquadra == squadraSelected) {
                return true;
            } else {
                return false;
            }
        });

        if (infoSquadra.length != 0) {
            $scope.rosa = infoSquadra[0];
            angular.forEach($scope.rosa.rosa, function(cal) {
                cal.pos = -1;
            });
        }
        $('#squadra-' + squadraSelected).addClass('selected');
        $scope.caricaTitolarita($scope.rosa.rosa);
    }

    $scope.getDescrizioneRuolo = function(idRuolo) {
        return $scope.ruolo[idRuolo - 1];
    }

    $scope.getAbbreviazioneRuolo = function(idRuolo) {
        return $scope.ruolo[idRuolo - 1].substring(0, 1);
    }

    $scope.clickGiocatore = function(calciatore) {
        calciatore.disabled = !calciatore.disabled;
        calciatore.selected = !calciatore.selected;
        if (calciatore.selected) {
            // Verifico il modulo
            if ($scope.titolari.length < 11) {
                $scope.inserisciTitolare(calciatore);
            } else if ($scope.riserve.length < 7) {
                $scope.inserisciRiserva(calciatore);
            } else {
                calciatore.disabled = !calciatore.disabled;
                calciatore.selected = !calciatore.selected;
                $('.imdb-overlay').show();
                $('#divConferma').addClass('imdb-visible');
                $('#confermaTitle').text('Errore Formazione');
                $('#confermaText').text('Formazione completata! Per cambiare qualche giocatore, deseleziona prima il giocatore da sostituire');
            }
        } else {
            $scope.rimuoviGiocatore(calciatore);
        }
    }

    /*
     *	Aggiunge un giocatore alla formazione titolare inserita se il modulo e' ok
     */
    $scope.inserisciTitolare = function(calciatore) {
        $scope.moduloInserito[calciatore.ruolo - 1]++;
        $scope.checkModulo(calciatore.ruolo - 1);
        if ($scope.moduloOk) {
            $scope.titolari.push(calciatore);
            calciatore.pos = 0;
            $scope.ridisegnaModulo(calciatore);
        } else {
            calciatore.pos = -1;
            calciatore.disabled = !calciatore.disabled;
            calciatore.selected = !calciatore.selected;
        }
    }

    /*
     *	Inserisce una riserva
     */
    $scope.inserisciRiserva = function(calciatore) {
        $scope.riserve.push(calciatore);
        calciatore.pos = $scope.riserve.length + 11;
        $scope.ridisegnaPanchina(calciatore);
    }

    /*
     *	Gestisce l'eliminazione di un giocatore dalla formazione
     */
    $scope.rimuoviGiocatore = function(calciatore) {
        for (var i = $scope.titolari.length - 1; i >= 0; i--) {
            if ($scope.titolari[i].idFcm == calciatore.idFcm) {
                $scope.titolari.splice(i, 1);
                calciatore.pos = -1;
                $scope.moduloInserito[calciatore.ruolo - 1]--;
                $scope.ridisegnaModulo(calciatore);
                break;
            }
        }
        for (var i = $scope.riserve.length - 1; i >= 0; i--) {
            if ($scope.riserve[i].idFcm == calciatore.idFcm) {
                $scope.riserve.splice(i, 1);
                calciatore.pos = -1;
                $scope.ridisegnaPanchina(calciatore);
                break;
            }
        }
    }

    /*
     *	Verifica che il modulo inserito sia ammesso
     */
    $scope.checkModulo = function(idruolo) {
        var compatibile = false;
        angular.forEach($scope.moduliAmmessi, function(mod) {
            if ($scope.moduloInserito[0] <= mod[0] &&
                $scope.moduloInserito[1] <= mod[1] &&
                $scope.moduloInserito[2] <= mod[2] &&
                $scope.moduloInserito[3] <= mod[3]) {
                compatibile = true;
            }
        });
        $scope.moduloOk = compatibile;
        if (!compatibile) {
            $scope.moduloInserito[idruolo]--;
            $('.imdb-overlay').show();
            $('#divConferma').addClass('imdb-visible');
            $('#confermaTitle').text('Errore Formazione');
            $('#confermaText').text('Impossibile inserire il giocatore in formazione: il modulo che ne deriverebbe non è ammesso nella competizione');
        }
    }

    /*
     *	Ridisegna i giocatori in campo a seconda del nuovo modulo selezionato
     */
    $scope.ridisegnaModulo = function(calciatore) {
        var cognome = calciatore.nome.split(" ")[0];
        var num = $scope.moduloInserito[calciatore.ruolo - 1];
        var nomi = [];
        var foto = [];
        $('div[class*=campo-' + $scope.getDescrizioneRuolo(calciatore.ruolo).toLowerCase() + ']').hide();
        $scope.titolari = $filter('orderBy')($scope.titolari, 'ruolo');
        $scope.titolari.filter(function(tit) {
            if (tit.ruolo == calciatore.ruolo) {
                nomi.push(tit.nome.split(" ")[0]);
                foto.push(tit.foto);
            }
        });
        $scope.disegnoCampo.filter(function(row) {
            if (row.ruolo == calciatore.ruolo && row.num == num) {
                var ids = row.ids.split(',');
                for (var i = 0; i < ids.length; i++) {
                    //$('.campo-' + $scope.getDescrizioneRuolo(calciatore.ruolo).toLowerCase() + '-' + ids[i] + ' > p').text(nomi[i]).css('margin-left', (nomi[i].length > 5 ? 3 - nomi[i].length : nomi[i].length));
                    $('.campo-' + $scope.getDescrizioneRuolo(calciatore.ruolo).toLowerCase() + '-' + ids[i]).css("background-image", "url(" + foto[i] + "), url('images/misterx.gif')");
                    $('.campo-' + $scope.getDescrizioneRuolo(calciatore.ruolo).toLowerCase() + '-' + ids[i]).show();
                }
            }
        });
    }

    /*
     *	Ridisegna i giocatori in panchina a seconda del giocatore selezionato
     */
    $scope.ridisegnaPanchina = function(calciatore) {
        var cognome = calciatore.nome.split(" ")[0];
        var num = $scope.riserve.length;
        var nomi = [];
        $('div[class*=campo-riserva]').hide();
        $scope.riserve = $filter('orderBy')($scope.riserve, 'ruolo');
        $scope.riserve.filter(function(ris) {
            var cognome = ris.nome.split(" ")[0];
            if (cognome == 'DE' || cognome == 'DI' || cognome == 'EL' || cognome == 'JUAN' || cognome == 'FLORO' || cognome == 'IAGO' || cognome == 'LUIZ' || cognome == 'ALEX' || cognome == 'MILINKOVIC') {
                cognome += " " + ris.nome.split(" ")[1];
            }
            nomi.push(cognome);
        });
        for (var i = 0; i < $scope.riserve.length; i++) {
            if ($('.maglia-panchina').width() == 20) { // Caso mobile
                $('.campo-riserva-' + (i + 1) + ' > p').text(nomi[i]).css('margin-top', (nomi[i].length > 6 ? 29 + nomi[i].length : 28 - nomi[i].length));
            } else { // Caso desktop
                $('.campo-riserva-' + (i + 1) + ' > p').text(nomi[i]).css('margin-left', (nomi[i].length > 6 ? -4 - nomi[i].length : -nomi[i].length));
            }
            $('.campo-riserva-' + (i + 1)).show();
        }
    }

    /*
     *	Verifica la correttezza della password
     */
    $scope.verificaPassword = function(originale) {
        var pwdInserita = $('input[name=password]').val();
        var crypted = Javacrypt.crypt("jd", pwdInserita);
        if (pwdInserita == pwdTest) {
            $scope.invioFake = true;
        }
        if (!$scope.invioFake && crypted[0] != originale) {
            $scope.inviabile = false;
        } else {
            $scope.inviabile = true;
            $scope.visualizzaSquadra($scope.squadraSelected.idSquadra);
            $scope.closePasswordDiv();
        }
    }

    /*
     *	Verifica che sia stata inserita la formazione correttamente e mostra il div per l'inserimento della schedina e invio della formazione
     */
    $scope.inserisciSchedina = function() {
        if ($scope.titolari.length == 11 && $scope.riserve.length == 7) {
            if ($scope.needSchedina) {
                $('.imdb-overlay').show();
                $('#divSchedina').addClass('imdb-visible');
            } else {
                $scope.inviaFormazione();
            }

        } else {
            $('.imdb-overlay').show();
            $('#divConferma').addClass('imdb-visible');
            $('#confermaTitle').text('Errore Formazione');
            $('#confermaText').text('Attenzione! Formazione incompleta');
        }
    }

    /*
     *	Invia la formazione
     */
    $scope.inviaFormazione = function() {
        $scope.loadingForm = true;
        var schedinaOk = true;
        $scope.inviabile = true;
        var idIncontro = 0;
        var sqCasa;
        var sqFuori;
        var schedinaMail = "";
        if ($scope.needSchedina) {
            angular.forEach($scope.listaIncontri, function(inc) {
                var idSch = $('.schedina-pron.' + inc.idPartita + '.selected').attr('id');
                if (idSch == undefined) {
                    schedinaOk = false;
                } else {
                    inc.pronostico = idSch.replace(inc.idPartita + '-', '');
                    schedinaMail += inc.squadraCasa + " - " + inc.squadraFuori + "   " + inc.pronostico + "\n";
                    if (inc.idSquadraCasa == $scope.squadraSelected.idSquadra || inc.idSquadraFuori == $scope.squadraSelected.idSquadra) {
                        idIncontro = inc.idPartita;
                        sqCasa = inc.squadraCasa;
                        sqFuori = inc.squadraFuori;
                    }
                }
            });
        } else {
            schedinaOk = true;
            $('#confermaTitle').text('Invio Formazione');
            $('#confermaText').text('');
            $('.imdb-overlay').show();
            $('#divConferma').addClass('imdb-visible');
            angular.forEach($scope.listaIncontri, function(inc) {
                if (inc.idSquadraCasa == $scope.squadraSelected.idSquadra || inc.idSquadraFuori == $scope.squadraSelected.idSquadra) {
                    idIncontro = inc.idPartita;
                    sqCasa = inc.squadraCasa;
                    sqFuori = inc.squadraFuori;
                }
            });
        }

        if ($scope.invioFake) {
            $scope.inviabile = false;
            $('#confermaTitle').text('Invio formazione TEST');
            $('#confermaText').text('Se tutto fosse completo verrebbe inviata la formazione');
            $scope.loadingForm = false;
            $scope.closeSchedinaDiv();
            $('.imdb-overlay').show();
            $('#divConferma').addClass('imdb-visible');
            //Schedina non piu richiesta
            schedinaOk = true;
        } else if (schedinaOk) {
            var destinatari = "";
            angular.forEach($scope.squadre, function(sq) {
                destinatari += sq.mail + "; ";
            });
            var mailBody = "Squadra: " + $scope.squadraSelected.nome + "\n";
            mailBody += "Data e ora: " + DataOraCorrente() + "\n";
            mailBody += "Lega: I Malati Del Bari \n";
            mailBody += "Giornata: " + $scope.listaIncontri[0].giornata + "a\n";
            mailBody += "Match: " + sqCasa + " - " + sqFuori + "\n\n";
            // Costruisce la parte del messaggio contenente la formazione
            mailBody += "--- Titolari ---\n";
            for (i = 0; i < 11; i++) {
                mailBody += $scope.getAbbreviazioneRuolo($scope.titolari[i].ruolo) + " " + $scope.titolari[i].nome + " (" + $scope.titolari[i].squadraDiA + ") \n";
            }
            mailBody += "--- Riserve ---\n";
            for (i = 0; i < 7; i++) {
                mailBody += $scope.getAbbreviazioneRuolo($scope.riserve[i].ruolo) + " " + $scope.riserve[i].nome + " (" + $scope.riserve[i].squadraDiA + ") \n";
            }
            mailBody += "\nSchedina: \n" + schedinaMail;
            // Costruisce la formazione da salvare sul sito			
            var formazioneSalvata = new Array();
            for (i = 0; i < $scope.rosa.rosa.length; i++) {
                formazioneSalvata.push(idIncontro + "," + $scope.squadraSelected.idSquadra + ",0," + $scope.rosa.rosa[i].codice + "," +
                    $scope.rosa.rosa[i].squadraDiACod + "," + $scope.rosa.rosa[i].ruolo + "," + $scope.rosa.rosa[i].pos + ",0");
            }

            if (!$scope.invioFake) {
                $.post('invform/sendmail.php', {
                        recipient: destinatari,
                        subject: 'Formazioni ' + $scope.listaIncontri[0].giornata + 'a Giornata',
                        giornataDiA: $scope.listaIncontri[0].giornata,
                        idSquadra: $scope.squadraSelected.idSquadra,
                        idIncontro: idIncontro,
                        body: mailBody,
                        sender: 'formazioni-fantacalcio@imdb.it',
                        saveData: formazioneSalvata.join("|")
                    })
                    .success(function(data) {
                        if (data != '') {
                            $('#confermaTitle').text('Errore Invio Formazione');
                            $('#confermaText').text(data);
                        } else {
                            $('#confermaTitle').text('Invio Formazione');
                            $('#confermaText').addClass('success');
                            $('#confermaText').text('Formazione inviata con successo!');
                        }
                        $timeout(function() {
                            $scope.loadingForm = false;
                        });
                        if ($scope.needSchedina) {
                            $scope.closeSchedinaDiv();
                            $('.imdb-overlay').show();
                            $('#divConferma').addClass('imdb-visible');
                        }
                    })
                    .error(function(data) {
                        console.error('FUCK!');
                    });
            }
        } else {
            $scope.loadingForm = false;
            $scope.inviabile = false;
        }
    }

    /*
     *	Seleziona il pronostico per la partita 
     */
    $scope.pronostico = function(idPartita, pronostico) {
        $('.' + idPartita).removeClass('selected');
        $('#' + idPartita + '-' + pronostico).addClass('selected');
    }

    $scope.probabili = function(squadra, giornale, nomeGiocatore) {
        var $dialog = $('<div id="dialogProbabile" style="overflow: hidden"></div>');
        if (giornale == 'gazzetta') {
            $dialog.html('<object data="http://www.gazzetta.it/ssi/swf/campetto_oriz.swf" type="application/x-shockwave-flash" class="probabiliGazzetta"><param name="quality" value="high"/><param name="wmode" value="transparent"/><param name="allowScriptAccess" value="always"/><param name="flashvars" value="xmlPath=http://www.gazzetta.it/ssi/2011/boxes/calcio/squadre/' + squadra.toLowerCase() + '/formazione/formazione.xml"/><param name="movie" value="http://www.gazzetta.it/ssi/swf/campetto_oriz.swf"/></object>')
                .dialog({
                    autoOpen: false,
                    modal: true,
                    width: 580,
                    height: 280,
                    scroll: false,
                    draggable: true,
                    resizable: false,
                    title: "Probabile Formazione " + squadra.toUpperCase()
                });
            $dialog.dialog('open');
        } else if (giornale == 'fantagazzetta') {
            var page = "";
            if (giornale == 'fantagazzetta') {
                page = 'http://www.fantagazzetta.com/probabili-formazioni-serie-A#' + squadra.toUpperCase();
            }
            $dialog.html('<iframe id="fgazzetta" style="border: 0px; " src="' + page + '" class="probabiliFanta" scrolling="auto"></iframe>')
                .dialog({
                    autoOpen: false,
                    modal: true,
                    width: 500,
                    height: 600,
                    scroll: true,
                    draggable: true,
                    resizable: false,
                    title: "Probabile Formazione " + squadra.toUpperCase()
                });
            $dialog.dialog('open');
        } else {
            var contenuto = "",
                nomeGiocatoreDaCercare = "";
            var htmlStart = '<html><head><link href="http://www.fantaformazione.com/modules/app/fantacalcio/views/fantacalcio.css?1076689080" rel="stylesheet" type="text/css">' +
                '<link rel="stylesheet" href="http://www.fantaformazione.com/js/libs/inuit.css" type="text/css" media="screen"> ' +
                '<link href="http://www.fantaformazione.com/js/libs/bootstrap/css/bootstrap.min.css" media="screen" rel="stylesheet">' +
                '<link rel="stylesheet" href="style/custom.css">' + '</head>';
            angular.forEach(nomeGiocatore.split(' '), function(s) {
                if (s.length > 1) {
                    nomeGiocatoreDaCercare += s.toLowerCase() + " ";
                }
            });
            angular.forEach($scope.listaGiocatoriTitolarita, function(g) {
                if ($(g).find('.nome').text().trim().toLowerCase().indexOf(nomeGiocatoreDaCercare.trim()) > -1) {
                    contenuto = g;
                }
            });
            if (contenuto == "") {
                console.log(nomeGiocatoreDaCercare + " non trovato, verificare i dati");
            } else {
                var content = contenuto.innerHTML.replace("background-image:url('files", "background-image:url('http://www.fantaformazione.com/files");
                $(contenuto).find('.dettaglio').remove();
                $dialog.html(htmlStart + content + '</html>').dialog({
                    autoOpen: false,
                    modal: true,
                    dialogClass: "dialogTitolarita",
                    scroll: true,
                    draggable: true,
                    resizable: false,
                    title: "Titolarità " + nomeGiocatore.toUpperCase() + " (" + squadra.toUpperCase() + ")",
                    close: function(event, ui) {
                        $(this).dialog('destroy').remove()
                    }
                });
                $dialog.dialog('open');
            }
        }
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    /*
     *   Carica la lista di giocatori da FantaFormazione e li inserisce in un array
     */
    $scope.caricaListaGiocatoriTitolarita = function() {

        var incontriCaricati = [];
        var listaSquadre = $($scope.listaPartite).find('span.probabili-team');
        var incontro;
        for (var i = 0; i < listaSquadre.length; i++) {
            var s = listaSquadre[i];
            var toggleA = $(s.parentElement).attr('onclick');
            var incontroId = toggleA.replace("return toggleProbabili('", '').replace("')", '');
            if (incontriCaricati.indexOf(incontroId) == -1) {
                incontriCaricati.push(incontroId);
                $.ajax({
                    url: 'http://www.fantaformazione.com/ajax.php?&id=Home&action[fantacalcio.calciatori]=probabiliJSON&mod_fantacalcio[id]=1&id_calendario=' + incontroId,                                       
                    type: 'GET',
                    success: function(res) {
                        var allGiocatori = $(res.responseText).find('.gc.calciatore');
                        angular.forEach(allGiocatori, function(g) {
                            $scope.listaGiocatoriTitolarita.push(g);
                        });
                    }
                });
            }
        }
        $scope.loading = false;
    }

    /*
     *   Cicla sulla rosa selezionata e aggiunge il dettaglio della titolarità sul json del calciatore
     */
    $scope.caricaTitolarita = function(rosa) {
        for (var i = 0; i < rosa.length; i++) {
            var nomeGiocatore = rosa[i].nomeAbbr;
            var nomeGiocatoreDaCercare = "";
            angular.forEach(nomeGiocatore.split(' '), function(s) {
                if (s.length > 1) {
                    nomeGiocatoreDaCercare += s.toLowerCase() + " ";
                }
            });
            for (var lt = 0; lt < $scope.listaGiocatoriTitolarita.length; lt++) {
                var divFantagazzetta = $($scope.listaGiocatoriTitolarita[lt]).find('.stato-cell')[0];
                var squadraFg = $(divFantagazzetta).find('a').attr('href').substring($(divFantagazzetta).find('a').attr('href').indexOf('#') + 1).toLowerCase();
                // Trovo il giocatore se: il nome da cercare è contenuto nel testo del <div class="nome"> e se la squadra è uguale a quella relativa al giocatore
                if ($($scope.listaGiocatoriTitolarita[lt]).find('.nome').text().trim().toLowerCase().indexOf(nomeGiocatoreDaCercare.trim()) > -1 && rosa[i].squadraDiA.toLowerCase() == squadraFg) {
                    rosa[i].statoTitolarita = $sce.trustAsHtml($($scope.listaGiocatoriTitolarita[lt]).find('.stato')[0].outerHTML);
                    break;
                }
            }
        }
    }
});