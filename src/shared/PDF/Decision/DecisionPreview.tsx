import VisibilityIcon from '@mui/icons-material/Visibility';

import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import {
  Document, Page, Font, Text, View, StyleSheet, PDFDownloadLink, PDFViewer,
} from '@react-pdf/renderer';

import React from 'react';

import font from 'fonts/Museo300-Regular.ttf';

import Footer from '../shared/containers/Footer/Footer';
import Header from '../shared/containers/Header/Header';

// Using this way because of overidding body styles
interface LetterProps {
  recipient: string;
//   author?: string;
//   area: ProposalArea;
//   kind: ProposalKind;
//   oldValues: unknown;
//   newValues: unknown;
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
  return (
    <>
      {/* <PDFViewer> */}
      {/* <Document>
          <Page size="A4" orientation="portrait" style={pageStyle.page}>
            <View>
            <Header recipient={props.recipient} />
            {<Main
                author={props.author}
                area={props.area}
                kind={props.kind}
                oldValues={props.oldValues}
                newValues={props.newValues}
              />
            <Footer />
          </Page>
        </Document> */}
      {/* {({ blob, url, loading, error }) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {loading ? <CircularProgress /> : <Tooltip placement="top" title="Pobierz pismo"><VisibilityIcon /></Tooltip>}
          </div>)} */}
      {/* </PDFViewer> */}
    </>
  );
}

export default DecisionDownload;
