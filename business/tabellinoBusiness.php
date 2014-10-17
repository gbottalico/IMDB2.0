<?php require (__DIR__.'/../utils/utils.php') ?>

<?php

class TabellinoBusiness {

    /*
    *   Restituisce le formazioni/tabellino della giornata richiesta
    */        
    public function getFormazioniGiornata($partita, $giornata, $giocata) {            
        $tabellino = array();
        if ($giocata == 0) {
            $lines = file(host . js_folder . str_replace('XXX', $giornata, formazioni_file));
            foreach($lines as $line_num => $line) {
                if (strpos($line,'new Z') !== false) {                
                    $riga = explode(",", $line); 
                    if (substr($riga[0], strpos($riga[0], '(') + 1) == $partita) {
                        $nom = new RigaFormazione();
                        $nom->partita = $partita;
                        $nom->codice = $riga[3];
                        $nom->nome = ImdbUtils::getPlayerNameByCode($riga[3]);
                        $nom->squadra = $riga[1];
                        $nom->squadraDiA = ImdbUtils::getPlayerNameByCode($riga[4]);
                        $nom->ruolo = $riga[5];
                        $nom->titolare = $riga[6];
                        array_push($tabellino, $nom);                              
                    }                        
                }              
            }
        } else {
            $lines = file(host . js_folder . str_replace('XXX', $giornata, tabellini_file));
            foreach($lines as $line_num => $line) {
                if (strpos($line,'new T') !== false) {                
                    $riga = explode(",", $line); 
                    if (substr($riga[0], strpos($riga[0], '(') + 1) == $partita) {                        
                        $codiciGiocatori = explode("%", $riga[3]);
                        $squadreGiocatori = explode("%", $riga[4]);
                        $ruoliGiocatori = explode("%", $riga[5]);
                        $votiGiocatori = explode("%", $riga[6]);
                        $bonusMalusGiocatori = explode("%", $riga[7]);
                        $totGiocatori = explode("%", $riga[8]);
                        for ($i = 0; $i < 19; $i++) {
                            $nom = new RigaFormazione();
                            $nom->partita = $partita;                            
                            $nom->squadra = $riga[1];
                            $nom->codice = 'xg' . str_replace('"', '', $codiciGiocatori[$i]);
                            $nom->nome = ImdbUtils::getPlayerNameByCode($nom->codice);
                            $nom->squadraDiA = ImdbUtils::getPlayerNameByCode('xa' . str_replace('"', '', $squadreGiocatori[$i]));
                            $nom->ruolo = str_replace('"', '', $ruoliGiocatori[$i]);
                            $nom->voto = str_replace('"', '', $votiGiocatori[$i]);
                            $nom->bonusMalus = str_replace('"', '', $bonusMalusGiocatori[$i]);
                            $nom->votoTotale = str_replace('"', '', $totGiocatori[$i]);
                            $nom->titolare = $i < 11 ? "1" : "0";
                            array_push($tabellino, $nom);
                        }                            
                    }                        
                }              
            }
        }
        return json_encode($tabellino);
    }
}