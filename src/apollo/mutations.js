import gql from 'graphql-tag';

export const CREATE_KORISNIK = gql`
    mutation CreateKorisnik($input: KorisnikInput!, $file: Upload){
        CreateKorisnik(input: $input, file: $file){
            email
            lozinka
            maticniBroj
            ime
            prezime
            brojTelefona
            ulogaId
          }
    }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($input: ID!) {
    DeleteUser(input: $input) {
      id
    }
  }
`;

export const DELETE_UREDAJ = gql`
  mutation DeleteUredaj($input: ID!) {
    DeleteUredaj(input: $input) {
      id
    }
  }
`;

export const CREATE_KATEGORIJA = gql`
  mutation CreateKategorija($input: String!) {
    CreateKategorija(input: $input) {
      id
      nazivKategorije
    }
  }
`;

export const CREATE_UREDAJ = gql`
  mutation CreateUredaj($input: UredajInput!, $file: Upload) {
    CreateUredaj(input: $input, file: $file) {
      id
      nazivUredaja
      serijskiBroj
      cijena
      napomena
      specifikacije
      slikaUrl
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

export const CREATE_ZAHTJEV = gql`
  mutation CreateZahtjev($input: ZahtjevInput!) {
    CreateZahtjev(input: $input) {
    id
    pocetakPosudbe
    krajPosudbe
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
      brojTelefona
    }
    stanje{
      id
      nazivStanja
    }
    }
  }
`;

export const UPDATE_UREDAJ = gql`
  mutation UpdateUredaj($input: UpdateUredajInput!, $file: Upload) {
    UpdateUredaj(input: $input, file: $file) {
      id
      nazivUredaja
      serijskiBroj
      cijena
      napomena
      specifikacije
      slikaUrl
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

export const APROOVE_ZAHTJEV = gql`
  mutation AprooveZahtjev($input: AprooveZahtjevInput!) {
    AprooveZahtjev(input: $input) {
    id
    napomenaProfesora
    odobritelj{
      id
      email
      ime
      prezime
      brojTelefona
    }
    stanje{
      id
      nazivStanja
    }
    }
  }
`;

export const DECLINE_ZAHTJEV = gql`
  mutation DeclineZahtjev($input: DeclineZahtjevInput!) {
    DeclineZahtjev(input: $input) {
    id
    napomenaProfesora
    odobritelj{
      id
      email
      ime
      prezime
      brojTelefona
    }
    stanje{
      id
      nazivStanja
    }
    }
  }
`;

export const RETURN_UREDAJ_ZAHTJEV = gql`
  mutation ReturnUredajZahtjev($input: ReturnUredajZahtjevInput!) {
    ReturnUredajZahtjev(input: $input) {
    id
    stanje{
      id
      nazivStanja
    }
    }
  }
`;