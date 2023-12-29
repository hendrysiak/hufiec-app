import { Box } from "@mui/material";

const Step1 = () => {
    return (<Box textAlign="center">
        <h2>Generowanie plików XML</h2>
        <p>Import z banku odbywa się za pomocą pliku w typie <b>XML</b></p>
        <p>Większość banków (przy kontach biznesowych zwłaszcza) pozwala na wygenerowanie wyciągów w formacie XML</p>
        <p>Poniżej krótka ściągawka, jak tego dokonać</p>
        <ul>
            <ol>Wyszukaj w swoim banku opcji "Historia operacji (XML)" - najczęściej znajdziesz ją w zakładce <b>IMPORT</b></ol>
            <ol>Sprawdź w aplikacji na liście przelewów datę ostatniego importu (posortuj malejąco według tej kolumny)</ol>
            <ol>Wprowadź w banku odpowiednie daty dla interesującego Cię okresu</ol>
            <ol>Wygeneruj plik XML i zapisz go na dysku</ol>
        </ul>
        <p>Zapisany plik wgrasz w kolejnym kroku</p>
        <p>Aplikacja na ten moment obsługuje tylko konto w banku <b>ING</b></p>
    </Box>)
};

export default Step1;