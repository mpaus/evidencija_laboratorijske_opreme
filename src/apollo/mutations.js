import gql from 'graphql-tag';

export const CREATE_USER = gql`
    mutation CreateUser($input: KorisnikInput!, $file: Upload){
        CreateUser(input: $input, file: $file){
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