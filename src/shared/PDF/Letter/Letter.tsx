import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { GridActionsCellItem } from '@mui/x-data-grid';
import {
  Document, Page, Font, StyleSheet, PDFDownloadLink, usePDF,
} from '@react-pdf/renderer';

import React from 'react';

import font from 'fonts/Museo300-Regular.ttf';

import { ProposalArea, ProposalKind } from 'models/global.enum';

import Footer from '../shared/containers/Footer/Footer';
import Header from '../shared/containers/Header/Header';
import Main from '../shared/containers/MainLetter/MainLetter';

// Using this way because of overidding body styles
interface LetterProps {
  recipient: string;
  author?: string;
  area: ProposalArea;
  kind: ProposalKind;
  oldValues: unknown;
  newValues: unknown;
  letterDate: Date | string | undefined;
}

Font.register({ family: 'Museo300', src: font });

const pageStyle = StyleSheet.create({
  page: {
    height: '1446px',
    width: '1022px',
    padding: '77px 54px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    overflow: 'hidden',
    fontFamily: 'Museo300',
    pageBreakAfter: 'always' as const,
    fontSize: '12px',
  },
});

const PDFIntance = (props: LetterProps) => {
  const Doc = (
    <Document>
      <Page size="A4" orientation="portrait" style={pageStyle.page}>
        {/* <View> */}
        <Header recipient={props.recipient} />
        <Main
          author={props.author}
          area={props.area}
          kind={props.kind}
          oldValues={props.oldValues}
          newValues={props.newValues}
          letterDate={props.letterDate}
        />
        <Footer />
      </Page>
    </Document>
)

  const [instance, updateInstance] = usePDF({ document: Doc })

  return <>{instance.loading ? <CircularProgress /> : <Tooltip placement="top" title="Pobierz pismo"><a href={instance.url ?? ''} download="pismo.pdf"><DownloadIcon /></a></Tooltip>}</>;
}

function Letter(props: LetterProps): JSX.Element {
  const [downloadEnabled, setDownloadEnabled] = React.useState(false);

  return (
    <>
      {downloadEnabled ? 
            (<div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {<PDFIntance {...props} />}
            </div>
      )
        : (
          <GridActionsCellItem
            icon={<PlayArrowIcon />}
            label="Check"
            onClick={() => setDownloadEnabled(true)}
            color="inherit"
          />
        )}
    </>
  );
}

export default Letter;
