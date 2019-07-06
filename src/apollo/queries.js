import gql from 'graphql-tag';

export const KORISNIK_QUERY = gql`
    query KorisnikQuery($ulogaId: ID!) {
          korisnik(ulogaId: $ulogaId) {
            id
            maticniBroj
            ime
            prezime
            email
            brojTelefona
            ulogaId
            slikaUrl
            uloga {
              id
              nazivUloge
            }
        }
    }
`
;

export const ULOGA_KORISNIKA = gql`
    query UlogaQuery {
          uloga {
            id
            nazivUloge
        }
    }
`
;

export const UREDAJ_QUERY = gql`
    query UredajQuery {
        uredaj{
            id
            nazivUredaja
            cijena
            napomena
            specifikacije
            slikaUrl
            serijskiBroj
            kategorija{
                id
                nazivKategorije
            }
            stanje{
                id
                nazivStanja
            }
        }
    }
`;

export const AVAILABLE_UREDAJ_QUERY = gql`
    query UredajQuery($stanjeId: ID!) {
        uredaj(stanjeId: $stanjeId){
            id
            nazivUredaja
            cijena
            napomena
            specifikacije
            slikaUrl
            serijskiBroj
            kategorija{
                id
                nazivKategorije
            }
            stanje{
                id
                nazivStanja
            }
        }
    }
`;

export const KATEGORIJA_QUERY = gql`
    query KategorijaQuery {
        kategorija{
            id
            nazivKategorije
        }
    }
`;

export const ZAHTJEV_QUERY = gql`
    query ZahtjevQuery {
        zahtjevPosudbe{
        id
    pocetakPosudbe
    krajPosudbe
    napomenaProfesora
    razlogPosudbe
    odobritelj{
      id
      email
      ime
      prezime
      brojTelefona
    }
    korisnik{
      id
      email
      ime
      prezime
      maticniBroj
      brojTelefona
    }
    stanje{
      id
      nazivStanja
    }
    uredaj{
      id
      nazivUredaja
      serijskiBroj
      cijena
      specifikacije
      slikaUrl
      napomena
    }
    }
    }
`;

export const SPECIFIC_ZAHTJEV_QUERY = gql`
    query ZahtjevQuery($stanjeId: ID!) {
        zahtjevPosudbe(stanjeId: $stanjeId){
        id
    pocetakPosudbe
    krajPosudbe
    napomenaProfesora
    razlogPosudbe
    odobritelj{
      id
      email
      ime
      prezime
      brojTelefona
    }
    korisnik{
      id
      email
      ime
      prezime
      maticniBroj
      brojTelefona
    }
    stanje{
      id
      nazivStanja
    }
    uredaj{
      id
      nazivUredaja
      serijskiBroj
      cijena
      specifikacije
      slikaUrl
      napomena
    }
    }
    }
`;