import React from 'react';

export default React.createContext({
    token: null,
    korisnikId: null,
    korisnikIme: null,
    korisnikPrezime: null,
    korisnikUlogaId: null,
    korisnikSlika: null,
    prijavaVrijeme: null,
    login: (token, korisnikId, korisnikIme, korisnikPrezime, korisnikUlogaId, tokenExpiration) => {},
    logout: () => {}
});