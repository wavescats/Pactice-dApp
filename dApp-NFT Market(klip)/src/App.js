App.js;

import "./App.css";
import "./market.css";
import { useState } from "react";
import QRCode from "qrcode.react";
import * as KlipAPI from "./api/UseKlip";
import { fetchCardsOf, getBalance } from "./api/UseCaver";
import { Alert, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const DEFAULT_QR_CODE = "DEFAULT"; // QR코드는 기본 DEFAULT 값
const DEFAULT_ADDRESS = "0x00000000000000000"; // 주소 기본값

function App() {
  const [nfts, setNfts] = useState([]);
  // 인자로 들어가는값은 tokenId, tokenUri
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

  const fetchMyNFT = async () => {
    const nftList = await fetchCardsOf(
      "0x319229707F620F673a1261DCcCe4E239A71f3Bc0"
    ); // 해당 주소에 있는 nft 리스트
    setNfts(nftList);
    // 빈배열에 담아준다
  };
  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async address => {
      setMyAddress(address);
      const balance = await getBalance(address);
      // UseCaver.js 에서 가져온 getBalance
      setMyBalance(balance);
    });
  };

  return (
    <div className="App">
      <div style={{ color: "white", padding: 10 }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: "bold",
            paddingLeft: 5,
            marginTop: 10,
          }}
        >
          내 지갑
        </div>
        {myAddress}
        <br />
        <Alert
          onClick={getUserData}
          variant={"balance"}
          style={{ backgroundColor: "pink", fontSize: 25, color: "black" }}
        >
          {myBalance}
        </Alert>
        <div className="container" style={{ padding: 50, width: "50%" }}>
          {/* map을 이용하여 nfts 배열에서 index 순서대로 이미지 출력 */}
          {nfts.map((list, index) => (
            <Card.Img className="img-responsive" src={nfts[index].uri} />
          ))}
        </div>
      </div>
      <Container
        style={{
          backgroundColor: "white",
          width: 300,
          height: 300,
          padding: 20,
        }}
      >
        <QRCode value={qrvalue} size={256} style={{ margin: "auto" }} />
      </Container>
      <button onClick={fetchMyNFT}>NFT 가져오기</button>
    </div>
  );
}

export default App;
