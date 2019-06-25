import gql from 'graphql-tag';

export const KORISNIK_QUERY = gql`
    query KorisnikQuery {
          korisnik {
            id
            maticniBroj
            ime
            prezime
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

export const KATEGORIJA_QUERY = gql`
    query KategorijaQuery {
        kategorija{
            id
            nazivKategorije
        }
    }
`;