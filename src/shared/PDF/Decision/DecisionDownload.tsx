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

import { Decision } from 'models/decision.model';

import Footer from '../shared/containers/Footer/Footer';
import Header from '../shared/containers/Header/Header';
import MainDecision from '../shared/containers/MainDecision/MainDecision';

// Using this way because of overidding body styles
interface LetterProps {
  recipient: string;
  decision: Decision;
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

function DecisionDownload(props: LetterProps): JSX.Element {
  const [downloadEnabled, setDownloadEnabled] = React.useState(false);

  const Doc = (
    <Document>
      <Page size="A4" orientation="portrait" style={pageStyle.page}>
        {/* <View> */}
        <Header recipient={props.recipient} />
        <MainDecision
          decision={props.decision}
        />
        <Footer />
      </Page>
    </Document>
  );

  const [instance, updateInstance] = usePDF({ document: Doc })

  return (
    <>
      {downloadEnabled ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {instance.loading ? <CircularProgress /> : <Tooltip placement="top" title="Pobierz pismo"><a href={instance.url ?? ''} download="pismo.pdf"><DownloadIcon /></a></Tooltip>}
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

export default DecisionDownload;
