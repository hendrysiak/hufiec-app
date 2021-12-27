import React from 'react';

interface DisclaimerProps {
  recipient: string;
}

const Disclaimer = (props: DisclaimerProps): JSX.Element => {
  return (
    <div className="disclaimer">
      <div className="disclaimer__recipient">{props.recipient}</div>
      <p>Chorągiew Śląska ZHP</p>
      <p>Komenda Hufca Ruda Śląska</p>
      <p>im. hm. Łucji Zawada</p>
      <p>41-700 Ruda Śląska, ul. Szczęść Boże 4</p>
      <p>hufiec@rudaslaska.zhp.pl, rudaslaska.zhp.pl </p>
      <p>Bank Śląski 27 1050 1331 1000 0010 0109 0859</p>
    </div>
  );
};

export default Disclaimer;
