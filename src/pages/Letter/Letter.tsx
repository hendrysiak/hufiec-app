import { Document, Page, Font, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

import React from 'react';

import font from 'fonts/Museo300-Regular.ttf';

import Footer from './containers/Footer/Footer';

import Header from './containers/Header/Header';
import Main from './containers/Main/Main';


// Using this way because of overidding body styles
interface LetterProps {
  recipient: string;
  author?: string;
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
    fontSize: '12px'
  }
});

const Letter = (props: LetterProps): JSX.Element => {


  return (
    <>
      <PDFDownloadLink
        document={
          <Document>
            <Page size="A4" orientation="portrait" style={pageStyle.page}>
              {/* <View> */}
              <Header recipient={props.recipient} />
              <Main author={props.author} />
              <Footer />
            </Page>
          </Document>
        }
        fileName="pismo.pdf"
      
      >
        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
      </PDFDownloadLink>
    </>
  );
};

export default Letter;
