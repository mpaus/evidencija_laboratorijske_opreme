import React from 'react';

export default React.createContext({
    token: localStorage.getItem('token') || null,
    korisnikId: localStorage.getItem('korisnikId') || null,
    korisnikIme: localStorage.getItem('korisnikIme') || null,
    korisnikPrezime: localStorage.getItem('korisnikPrezime') || null,
    korisnikUlogaId: localStorage.getItem('korisnikUlogaId') || null,
    korisnikSlika: localStorage.getItem('slikaUrl') || null,
    prijavaVrijeme: null,
    login: (token, korisnikId, korisnikIme, korisnikPrezime, korisnikUlogaId, tokenExpiration) => {},
    logout: () => {}
});