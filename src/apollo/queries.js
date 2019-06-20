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