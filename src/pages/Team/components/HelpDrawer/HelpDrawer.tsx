import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Box, Divider, ListSubheader, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';

// if (error === ErrorType.EventError) errorIcon = <ExploreOffIcon />;
// if (error === ErrorType.NameError) errorIcon = <PersonOffIcon />;
// if (error === ErrorType.YearError) errorIcon = <HourglassDisabledIcon />;
// if (error === ErrorType.TeamError) errorIcon = <GroupRemoveIcon />;

export const HelpDrawer = ({ 
  isOpen,
  setDrawerClose
}: { isOpen: boolean, setDrawerClose: (stateOfDrawer: boolean) => void }): JSX.Element => {
  return <Drawer anchor="right" open={isOpen} onClose={() => setDrawerClose(false)}>
    <Box
      sx={{ width:  600 }}
      role="presentation"
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Błąd kodu</Typography>
          <Box style={{ marginRight: '16px' }}>
            <ExploreOffIcon />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Błąd kodu występuje w conajmniej kilku przypadkach 
            - warto dokładnie zwrócić uwagę na tytuł przelewu, by ustalić z jakim mamy do czynienia.
          </Typography>
          <Typography>
            {'W karcie "Jak zbudowany jest tytuł przelewu?" znaleźć można dokładne wskazówki, jak tytuł powinien wyglądać.'}
          </Typography>
          <List>
            <ListSubheader component="div">I tak błąd przelewu może się pojawić w kilku przypadkach:</ListSubheader>
            <ListItem>1. Kiedy podano kod imprezy z jakimkolwiek błędem (np. BK09, BK 09, BK*09, BK_09, BK - 09, zamiast BK-09).</ListItem>
            <ListItem>2. Kiedy podano kod imprezy, której nie ma.</ListItem>
            <ListItem>3. Kiedy dokonano przelewu przed zatwierdzeniem i ustaleniem kodu.</ListItem>


            <ListSubheader component="div">Jakie są konieczne działania?</ListSubheader>
            <ListItem>1. Jeśli jest to pierwszy przypadek dla danego dziecka i/lub sporadyczna sprawa (raz na pół roku) - można zgłosić poprawkę za pomocą opcji Edytuj i NIE wysyłać pisma.</ListItem>
            <ListItem>2. Jeśli błędów jest więcej dla danego kodu - wymagane jest pismo dla każdego błędu.</ListItem>
            <ListItem>3. Jeśli problem dla danego dziecka się powtarza - każdorazowo należy dokonać przeksięgowania pismem.</ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Błąd roku</Typography>
          <Box style={{ marginRight: '16px' }}>
            <HourglassDisabledIcon />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <List>
              <ListSubheader component="div">
            Błąd roku występuje w dwóch przypadkach:
              </ListSubheader>

              <ListItem>1. Podano nieprawidłowy rok.</ListItem>
              <ListItem>2. Wykonano przelew bez roku.</ListItem>
              <ListSubheader component="div">
              Uwagi
              </ListSubheader>

              <ListItem>1. Jeśli przelew dotyczy składek - upewnij się, że stan składek się zgadza. Zły rok może zaksięgować składki nie tam, gdzie powinno.</ListItem>
              <ListItem>2. Jeśli przelew dotyczy imprezy - może się okazać, że zostanie zaksięgowany do nieprawidłowego roku.</ListItem>
            </List>
          Jakie są konieczne działania?

          Patrz działania dla błędu kodu.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Błąd imienia/nazwislka</Typography>
          <Box style={{ marginRight: '16px' }}>
            <PersonOffIcon />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <List>
              <ListSubheader component="div">Błąd imienia/nazwiska występuje w kilku przypadkach:</ListSubheader>
              <ListItem>1. Rodzic wykonał przelew z błędem w imieniu lub nazwisku - zwykła literówka, imię zdrobniale, brak polskich znaków.</ListItem>
              <ListItem>2. W momencie wykonywania przelewu, dziecka nie było w aplikacji.</ListItem>
              <ListItem>3. Osoby cywilne (na specjalnych warunkach i po uzgodnieniu).</ListItem>

              <ListSubheader component="div">Uwagi</ListSubheader>

              <ListItem>1. Zawsze po dodaniu dziecka do drużyny w ewidencji lub po przyjęciu dziecka do drużyny - upewnij się, że jest ono również w aplikacji.</ListItem>
              <ListItem>2. Upewnij się, że na daną imprezę zabierasz tylko dzieci, które znajdują się w ewidencji.</ListItem>
              <ListItem>3. Jeśli organizujesz imprezę dla rodziców - niech opłacą wymaganą kwotę z kodem przypisanym do dziecka (zsumuj kwotę dla całej rodziny).</ListItem>

            </List>
          Jakie są konieczne działania?

          Patrz działania dla błędu kodu.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Jak zbudowany jest tytuł przelewu?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListSubheader component="div"> W jaki sposób tworzony jest kod przelewu?</ListSubheader>
            
            <ListItem>[obecny rok]-[imię i nazwisko, którego dotyczy przelew]-[identyfikator jednostki]-[kod przelewu]</ListItem>
            <ListItem>Przykład:
              2021-Jan Kowalski-1111-SC
              2021-Jan Kowalski-12427-BK-01.
            </ListItem>
            
            <Divider/>
            <ListSubheader component="div">Jaki mam kod jednostki?</ListSubheader>
            <ListItem>Jeśli wejdziesz do Tipi i odwiedzisz swoją drużynę, to w adresie w przeglądarce zobaczysz kod jednostki:</ListItem>
            <Divider/>
            <ListSubheader component="div">Jaki rok podajemy przy przelewie?</ListSubheader>
            <ListItem>Dokładny rok, którego dotyczy przelew. I tak zaległości za rok poprzedni wysyłamy z kodem roku poprzedniego, a za rok bieżący – z kodem roku bieżącego.</ListItem>
            <Divider/>
            <ListSubheader component="div">Czyje imię i nazwisko powinno pojawić sie w tytule?</ListSubheader>
            <ListItem>Bezwzględnie osoby z Tipi. Samo imię powinno być zgodne z ewidencją (Marysia to nie Maria, Tymek to nie Tymoteusz – chyba, że Tymek jest imieniem właściwym). Imienia i nazwiska nie dzielimy niczym, poza pustym znakiem – spacją.</ListItem>
            <Divider/>
            <ListSubheader component="div">Jak zbudowany jest kod imprezy?</ListSubheader>
            <ListItem>- z prefixu</ListItem>
            <ListItem>- prefixu oznaczającego rodzaj imprezy i sufixu, bedącego liczbą porządkową.</ListItem>
            <ListSubheader component="div">Przykłady</ListSubheader>
            <ListItem>- Dla składek członkowskich, które mają jednolity kod dla wszystkich, przez cały rok, stosuje się tylko prefix: SC.</ListItem>
            <ListItem>- Dla imprez jednorazowych w danym roku, stosuje się zazwyczaj również sam prefix: OSW, JSW, OPAL.</ListItem>
            <ListItem>- Dla imprez, które mogą się odbywać wielokrotnie w ciągu roku w skali hufca, stosuje się kod w konstrukcji:
                [prefix]-[sufix]
                Przy czym oba człony zawsze oddzielone są samym myślnikiem „-”.
                Przykład: kolejny biwak to BK-01, BK-02, BK-03.
            </ListItem>
          </List>
            
        </AccordionDetails>
      </Accordion>
    </Box>
  </Drawer>;
};