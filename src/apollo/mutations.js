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