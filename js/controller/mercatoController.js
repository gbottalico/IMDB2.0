imdbFanta.controller('mercatoCtrl', function($scope, $http, $timeout, $filter) {

    $scope.loading = true;
    $scope.loadingForm = false;
    $scope.showSquadra = false;
    $scope.squadraDstSelected = false;
    $scope.viewProposte = false;
    $scope.ruolo = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
    $scope.proposte = [];
    $scope.disabilitaScambio = false;
    $scope.creditiReali = 0;

    $scope.checkMoney = function() {
        if (document.querySelectorAll('.money:invalid').length > 0) {
            $scope.disabilitaScambio = true;
        } else {
            $scope.disabilitaScambio = false;
        }
    }

    $http.get('service/squadreService.php').success(function(data) {
        $scope.loading = false;
        $scope.squadre = data;
    });

    /*
     *	Apre il pannellino per l'inserimento della password della squadra selezionata.
     */
    $scope.inserisciPassword = function(squadraSelected) {


        $('#divPassword').addClass('imdb-visible');
        $scope.inviabile = true;
        $('input[name=password]').val('');
        $scope.squadraSelected = squadraSelected;
        $scope.rosa = null;
        $scope.rosaDst = null;
        $scope.squadraDst = null;
        $scope.resetPage();
        $('.imdb-overlay').show();
    }

    $scope.closePasswordDiv = function() {
        $('.imdb-overlay').hide();
        $('#divPassword').removeClass('imdb-visible');
    }

    $scope.closePropostaDiv = function() {
        $('.imdb-overlay').hide();
        $scope.viewProposte = !$scope.viewProposte;
        $('.divProposte').slick('unslick');
    }

    $scope.resetPage = function() {
        $scope.srcMoney = null;
        $scope.dstMoney = null;
        $('input[name=srcSelected]').attr('checked', false);
        $('input[name=dstSelected]').attr('checked', false);
        $('input[name=srcSelected]').parent().parent().removeClass('playerSelected');
        $('input[name=dstSelected]').parent().parent().removeClass('playerSelected');
        $('.sqSrc').removeClass('selected');
        $('.sqDst').removeClass('selected');
        $scope.disabilitaScambio = false;
    }

    $scope.verificaProposte = function() {
        $scope.proposte = [];

        // Proposte ricevute
        $http.get('service/mercatoService.php?azione=getProposteRicevute&squadra=' + $scope.squadraSelected.idSquadra).success(function(data) {
            console.log('Proposte Ricevute = ' + JSON.stringify(data));
            $scope.retProposte = data;
            angular.forEach($scope.retProposte, function(prop) {
                var proposta = {};
                var giocatoriAvere = [];
                var giocatoriDare = [];

                var infoSquadra = $scope.squadre.filter(function(row) {
                    if (row.idSquadra == prop.squadraSrc) {
                        return true;
                    } else {
                        return false;
                    }
                });

                var giocatoriSrc = prop.giocatoriA.split(",");
                angular.forEach(giocatoriSrc, function(gioc) {
                    var infoGioc = infoSquadra[0].rosa.filter(function(row) {
                        if (row.idFcm == gioc) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (infoGioc.length) {
                        giocatoriAvere.push(infoGioc[0]);
                    }
                });

                var giocatoriDst = prop.giocatoriB.split(",");
                angular.forEach(giocatoriDst, function(gioc) {
                    var infoGioc = $scope.squadraSelected.rosa.filter(function(row) {
                        if (row.idFcm == gioc) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (infoGioc.length) {
                        giocatoriDare.push(infoGioc[0]);
                    }
                });
                proposta = {
                    idProposta: prop.idProposta,
                    squadraSrc: infoSquadra[0],
                    squadraDst: $scope.squadraSelected,
                    creditiSrc: prop.creditiA,
                    creditiDst: prop.creditiB,
                    giocatoriSrc: giocatoriAvere,
                    giocatoriDst: giocatoriDare,
                    ricevuta: true
                };
                $scope.proposte.push(proposta);
            });
        });

        // Proposte inviate
        $http.get('service/mercatoService.php?azione=getProposteFatte&squadra=' + $scope.squadraSelected.idSquadra).success(function(data) {
            console.log('Proposte Fatte = ' + JSON.stringify(data));
            $scope.retProposte = data;
            angular.forEach($scope.retProposte, function(prop) {
                var proposta = {};
                var giocatoriAvere = [];
                var giocatoriDare = [];

                var infoSquadra = $scope.squadre.filter(function(row) {
                    if (row.idSquadra == prop.squadraDst) {
                        return true;
                    } else {
                        return false;
                    }
                });

                var giocatoriSrc = prop.giocatoriA.split(",");
                angular.forEach(giocatoriSrc, function(gioc) {
                    var infoGioc = $scope.squadraSelected.rosa.filter(function(row) {
                        if (row.idFcm == gioc) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (infoGioc.length) {
                        giocatoriDare.push(infoGioc[0]);
                    }
                });

                var giocatoriDst = prop.giocatoriB.split(",");
                angular.forEach(giocatoriDst, function(gioc) {
                    var infoGioc = infoSquadra[0].rosa.filter(function(row) {
                        if (row.idFcm == gioc) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (infoGioc.length) {
                        giocatoriAvere.push(infoGioc[0]);
                    }
                });
                proposta = {
                    idProposta: prop.idProposta,
                    squadraSrc: $scope.squadraSelected,
                    squadraDst: infoSquadra[0],
                    creditiSrc: prop.creditiA,
                    creditiDst: prop.creditiB,
                    giocatoriSrc: giocatoriDare,
                    giocatoriDst: giocatoriAvere,
                    ricevuta: false
                };
                $scope.proposte.push(proposta);
            });
        });
    }

    $scope.toggleViewProposte = function() {
        $scope.viewProposte = !$scope.viewProposte;
        $scope.trasformaProposte();
    }

    $scope.trasformaProposte = function() {
        $timeout(function() {
            $('.divProposte').slick({
                dots: true,
                infinite: false
            });
            $('.imdb-overlay').toggle();
        });
    }

    $scope.visualizzaSquadra = function(squadraSelected) {
        $('.sqSrc').removeClass('selected');
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
        $('#squadraSrc-' + squadraSelected).addClass('selected');
        $scope.verificaProposte();
    }

    $scope.getDescrizioneRuolo = function(idRuolo) {
        return $scope.ruolo[idRuolo - 1];
    }

    $scope.getAbbreviazioneRuolo = function(idRuolo) {
        return $scope.ruolo[idRuolo - 1].substring(0, 1);
    }

    /*
     *	Verifica la correttezza della password
     */
    $scope.verificaPassword = function(originale) {
        var pwdInserita = $('input[name=password]').val();
        var crypted = Javacrypt.crypt("jd", pwdInserita);
        if (crypted[0] != originale) {
            $scope.inviabile = false;
        } else {
            $scope.inviabile = true;
            $scope.visualizzaSquadra($scope.squadraSelected.idSquadra);
            $scope.closePasswordDiv();
        }
    }

    /*
     *	Mostra la rosa della squadra clickata
     */
    $scope.mostraRosa = function(squadraSelected) {
        $('.sqDst').removeClass('selected');
        $scope.squadraDstSelected = true;
        $scope.squadraDst = squadraSelected;
        var infoSquadra = $scope.squadre.filter(function(row) {
            if (row.idSquadra == squadraSelected) {
                return true;
            } else {
                return false;
            }
        });

        if (infoSquadra.length != 0) {
            $scope.rosaDst = infoSquadra[0];
            angular.forEach($scope.rosaDst.rosa, function(cal) {
                cal.pos = -1;
            });
        }
        $('#squadraDst-' + squadraSelected).addClass('selected');
    }

    /*
     *	Richiede lo scambio
     */
    $scope.richiediScambio = function() {
        //effettuo controlli ruolo
        if ($('input[name=srcSelected]:checked').length == 0 || ($('input[name=srcSelected][ruolo=1]:checked').length != $('input[name=dstSelected][ruolo=1]:checked').length ||
                $('input[name=srcSelected][ruolo=2]:checked').length != $('input[name=dstSelected][ruolo=2]:checked').length ||
                $('input[name=srcSelected][ruolo=3]:checked').length != $('input[name=dstSelected][ruolo=3]:checked').length ||
                $('input[name=srcSelected][ruolo=4]:checked').length != $('input[name=dstSelected][ruolo=4]:checked').length)) {
            $('#confermaTitle').text('Attenzione');
            $('#confermaText').html("Impossibile completare la richiesta. I ruoli selezionati non coincidono");
            $('.imdb-overlay').show();
            $('#divConferma').addClass('imdb-visible');
        } else {
            $scope.disabilitaScambio = true;
            $scope.scambio = {
                'squadraSrc': $scope.squadraSelected.idSquadra,
                'squadraDst': $scope.squadraDst,
                'soldiDare': $scope.srcMoney ? $scope.srcMoney : 0,
                'soldiAvere': $scope.dstMoney ? $scope.dstMoney : 0,
                'playerDare': [],
                'playerAvere': [],
                'azione': 'richiediScambio'
            }
            var mailBody = "Il club " + $scope.squadraSelected.nome + " ti ha inviato la seguente proposta:\n";
            $('input[name=srcSelected]:checked').each(function() {
                if ($scope.scambio.playerDare.indexOf($(this).val()) == -1) {
                    $scope.scambio.playerDare.push($(this).val());
                    mailBody += $(this).attr('nome') + ", ";
                }
            });
            if ($scope.srcMoney && $scope.srcMoney > 0) {
                mailBody = mailBody.substring(0, mailBody.length - 2) + " più " + $scope.srcMoney + " crediti per ";
            } else {
                mailBody = mailBody.substring(0, mailBody.length - 2) + " per ";
            }
            $('input[name=dstSelected]:checked').each(function() {
                if ($scope.scambio.playerAvere.indexOf($(this).val()) == -1) {
                    $scope.scambio.playerAvere.push($(this).val());
                    mailBody += $(this).attr('nome') + ", ";
                }
            });
            if ($scope.dstMoney && $scope.dstMoney > 0) {
                mailBody = mailBody.substring(0, mailBody.length - 2) + " più " + $scope.dstMoney + " crediti.\n";
            } else {
                mailBody = mailBody.substring(0, mailBody.length - 2) + ".\n";
            }
            console.log($scope.scambio);
            var destinatari = $scope.rosaDst.mail + "; " + $scope.squadraSelected.mail;
            $http({
                method: 'POST',
                url: 'service/mercatoService.php',
                data: $scope.scambio
            }).then(function(data) {
                console.log('OK' + data.data);
                $.post('invform/sendmail.php', {
                        recipient: destinatari,
                        subject: 'Proposta di scambio da ' + $scope.squadraSelected.nome,
                        body: mailBody,
                        sender: 'mercato-fantacalcio@imdb.it'
                    })
                    .success(function(data) {
                        if (data != '') {
                            $('#confermaTitle').text('Errore Invio proposta');
                            $('#confermaText').html(data);
                        } else {
                            $('#confermaTitle').text('Proposta Inviata');
                            $('#confermaText').addClass('success');
                            $('#confermaText').text('Proposta inviata con successo!');
                            $scope.resetPage();
                            $scope.verificaProposte();
                        }
                        $('.imdb-overlay').show();
                        $('#divConferma').addClass('imdb-visible');
                    })
                    .error(function(data) {
                        console.error('FUCK!');
                    });
            }, function(data) {
                console.log('KO' + data.data);
            });
        }
    }

    /*
     *	Accetta la proposta selezionata
     */
    $scope.accettaProposta = function(proposta) {
        $scope.closePropostaDiv();

        var destinatari = "";
        angular.forEach($scope.squadre, function(sq) {
            destinatari += sq.mail + "; ";
        });

        var mailBody = "I club ufficializzano il seguente scambio:\n";
        mailBody += proposta.squadraSrc.nome + " cede alla squadra " + proposta.squadraDst.nome + " i giocatori ";
        angular.forEach(proposta.giocatoriSrc, function(gioc) {
            mailBody += gioc.nomeAbbr + ', ';
        });
        mailBody = mailBody.substring(0, mailBody.length - 2) + "\n";
        mailBody += proposta.squadraDst.nome + " cede alla squadra " + proposta.squadraSrc.nome + " i giocatori ";
        angular.forEach(proposta.giocatoriDst, function(gioc) {
            mailBody += gioc.nomeAbbr + ', ';
        });
        mailBody = mailBody.substring(0, mailBody.length - 2) + "\n";
        if (proposta.creditiSrc > 0 || proposta.creditiDst > 0) {
            if (proposta.creditiSrc > 0) {
                mailBody += "Inoltre " + proposta.squadraSrc.nome + " paga alla squadra " + proposta.squadraDst.nome + " un totale di " + proposta.creditiSrc + " crediti come conguaglio\n";
            } else {
                mailBody += "Inoltre " + proposta.squadraDst.nome + " paga alla squadra " + proposta.squadraSrc.nome + " un totale di " + proposta.creditiDst + " crediti come conguaglio\n";
            }
        }

        $http.get('service/mercatoService.php?azione=accettaProposta&proposta=' + proposta.idProposta)
            .success(function(data) {
                if (data.trim() != '') {
                    $('#confermaTitle').text('Errore scambio');
                    $('#confermaText').html(data);
                    $('.imdb-overlay').show();
                    $('#divConferma').addClass('imdb-visible');
                } else {
                    $.post('invform/sendmail.php', {
                            recipient: destinatari,
                            subject: 'Scambio avvenuto tra ' + proposta.squadraSrc.nome + ' e ' + proposta.squadraDst.nome,
                            body: mailBody,
                            sender: 'mercato-fantacalcio@imdb.it'
                        })
                        .success(function(data) {
                            if (data.trim() != '') {
                                $('#confermaTitle').text('Errore Conferma scambio');
                                $('#confermaText').html(data);
                            } else {
                                $('#confermaTitle').text('Scambio Confermato');
                                $('#confermaText').addClass('success');
                                $('#confermaText').text('Scambio avvenuto con successo!');
                                $scope.verificaProposte();
                            }
                            $('.imdb-overlay').show();
                            $('#divConferma').addClass('imdb-visible');
                        })
                        .error(function(data) {
                            console.error('FUCK!');
                        });
                }
            })
            .error(function(data) {
                console.error('FUCK!');
            });
    }

    /*
     *	Gestisce il rifiuto di una proposta
     */
    $scope.rifiutaProposta = function(proposta) {

        $scope.closePropostaDiv();
        var mailBody = "Il club " + proposta.squadraDst.nome + " ha rifiutato la tua proposta:\n";
        angular.forEach(proposta.giocatoriDst, function(gioc) {
            mailBody += gioc.nomeAbbr + ', ';
        });
        if (proposta.creditiDst > 0) {
            mailBody = mailBody.substring(0, mailBody.length - 2) + " più " + proposta.creditiDst + " crediti per ";
        } else {
            mailBody = mailBody.substring(0, mailBody.length - 2) + " per ";
        }
        angular.forEach(proposta.giocatoriSrc, function(gioc) {
            mailBody += gioc.nomeAbbr + ', ';
        });
        if (proposta.creditiSrc > 0) {
            mailBody = mailBody.substring(0, mailBody.length - 2) + " più " + proposta.creditiSrc + " crediti.\n";
        } else {
            mailBody = mailBody.substring(0, mailBody.length - 2) + ".\n";
        }
        var destinatari = proposta.squadraDst.mail + "; " + proposta.squadraSrc.mail;
        $http.get('service/mercatoService.php?azione=rifiutaProposta&proposta=' + proposta.idProposta)
            .success(function(data) {
                if (data.trim() != '') {
                    $('#confermaTitle').text('Errore Conferma scambio');
                    $('#confermaText').html(data);
                    $('.imdb-overlay').show();
                    $('#divConferma').addClass('imdb-visible');
                } else {
                    $.post('invform/sendmail.php', {
                            recipient: destinatari,
                            subject: 'Scambio rifiutato da ' + proposta.squadraDst.nome,
                            body: mailBody,
                            sender: 'mercato-fantacalcio@imdb.it'
                        })
                        .success(function(data) {
                            if (data.trim() != '') {
                                $('#confermaTitle').text('Errore Rifiuto scambio');
                                $('#confermaText').html(data);
                            } else {
                                $('#confermaTitle').text('Scambio Rifiutato');
                                $('#confermaText').addClass('success');
                                $('#confermaText').text('Scambio Rifiutato con successo!');
                                $scope.verificaProposte();
                            }
                            $('.imdb-overlay').show();
                            $('#divConferma').addClass('imdb-visible');
                        })
                        .error(function(data) {
                            console.error('FUCK!');
                        });
                }
            })
            .error(function(data) {
                console.error('FUCK!');
            });
    }

    /*
     *	Gestisce l'annullamento di una proposta
     */
    $scope.annullaProposta = function(proposta) {

        $scope.closePropostaDiv();
        var mailBody = "Il club " + proposta.squadraSrc.nome + " ha annullato la sua proposta:\n";
        angular.forEach(proposta.giocatoriDst, function(gioc) {
            mailBody += gioc.nomeAbbr + ', ';
        });
        if (proposta.creditiDst > 0) {
            mailBody = mailBody.substring(0, mailBody.length - 2) + " più " + proposta.creditiDst + " crediti per ";
        } else {
            mailBody = mailBody.substring(0, mailBody.length - 2) + " per ";
        }
        angular.forEach(proposta.giocatoriSrc, function(gioc) {
            mailBody += gioc.nomeAbbr + ', ';
        });
        if (proposta.creditiSrc > 0) {
            mailBody = mailBody.substring(0, mailBody.length - 2) + " più " + proposta.creditiSrc + " crediti.\n";
        } else {
            mailBody = mailBody.substring(0, mailBody.length - 2) + ".\n";
        }
        var destinatari = proposta.squadraDst.mail + "; " + proposta.squadraSrc.mail;

        $http.get('service/mercatoService.php?azione=rifiutaProposta&proposta=' + proposta.idProposta)
            .success(function(data) {
                if (data.trim() != '') {
                    $('#confermaTitle').text('Errore Annullamento scambio');
                    $('#confermaText').html(data);
                    $('.imdb-overlay').show();
                    $('#divConferma').addClass('imdb-visible');
                } else {
                    $.post('invform/sendmail.php', {
                            recipient: destinatari,
                            subject: 'Scambio annullato da ' + proposta.squadraSrc.nome,
                            body: mailBody,
                            sender: 'mercato-fantacalcio@imdb.it'
                        })
                        .success(function(data) {
                            if (data != '') {
                                $('#confermaTitle').text('Errore Annullamento scambio');
                                $('#confermaText').html(data);
                            } else {
                                $('#confermaTitle').text('Scambio annullato');
                                $('#confermaText').addClass('success');
                                $('#confermaText').text('Scambio Annullato con successo!');
                                $scope.verificaProposte();
                            }
                            $('.imdb-overlay').show();
                            $('#divConferma').addClass('imdb-visible');
                        })
                        .error(function(data) {
                            console.error('FUCK!');
                        });
                }
            })
            .error(function(data) {
                console.error('FUCK!');
            });
    }

    $scope.closeConfermaDiv = function() {
        $('.imdb-overlay').hide();
        $('#divConferma').removeClass('imdb-visible');
    }

    $scope.selezionaCalciatore = function(idPlayer) {
        $('input[value=' + idPlayer + ']').prop('checked', !$('input[value=' + idPlayer + ']').is(':checked'));
        if ($('input[value=' + idPlayer + ']').is(':checked')) {
            $('input[value=' + idPlayer + ']').parent().parent().addClass('playerSelected');
        } else {
            $('input[value=' + idPlayer + ']').parent().parent().removeClass('playerSelected');
        }
    }

});