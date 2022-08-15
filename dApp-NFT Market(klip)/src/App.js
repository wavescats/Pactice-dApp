import "./App.css";
import "./market.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import * as KlipAPI from "./api/UseKlip";
import { fetchCardsOf, getBalance } from "./api/UseCaver";
import { Alert, Container, Card, Nav, Form, Button } from "react-bootstrap";
import { MARKET_CONTRACT } from "./constants";

const DEFAULT_QR_CODE = "DEFAULT"; // QR코드는 기본 DEFAULT 값
const DEFAULT_ADDRESS = "0x00000000000000000"; // 주소 기본값

function App() {
  const [nfts, setNfts] = useState([]);
  // 인자로 들어가는값은 tokenId, tokenUri
  // UseCaver.js 파일에서 nfts 배열안에 👉 id와 uri
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState("MARKET"); // Footer 하단 클릭하면 바뀌는 useState
  const [mintImgUrl, setMintImgUrl] = useState("");

  const fetchMarketNFT = async () => {
    if (myAddress === DEFAULT_ADDRESS) {
      // 내 지갑 주소가 없는경우
      alert("NO ADDRESS");
      return; // ⭐ 리턴을 해줘야한다 !
    } // 지갑주소가 없으면 알림창

    const nftMarket = await fetchCardsOf(MARKET_CONTRACT);
    // 꼭 지갑주소 아니더라도 컨트랙트 주소로도 전송이 가능하다
    setNfts(nftMarket);
  };

  const fetchMyNFT = async () => {
    const nftList = await fetchCardsOf(myAddress); // 해당 주소에 있는 nft 리스트
    setNfts(nftList);
    // 빈배열에 담아준다
  };

  const onClickCard = id => {
    if (tab === "WALLET") {
      onClickMyCard(id);
    }
    if (tab === "MARKET") {
      onClickMarketCard(id);
    }
  };

  // NFT를 판매하는 함수
  const onClickMyCard = async tokenId => {
    // tokenId 의 파라미터값은 밑에서 map 으로 반환한 값이 된다
    KlipAPI.saleCard(myAddress, tokenId, setQrvalue, callback => {
      alert(JSON.stringify(callback));
    });
  };

  // 마켓에서 구매하는 함수
  const onClickMarketCard = async tokenId => {
    KlipAPI.buyCard(tokenId, setQrvalue, callback => {
      alert(JSON.stringify(callback));
    });
  };

  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async address => {
      setMyAddress(address);
      const balance = await getBalance(address);
      // UseCaver.js 에서 가져온 getBalance
      setMyBalance(balance);
    });
  };
  const onClickMint = uri => {
    // uri 의 파라미터 값은 밑에서 mintImgUrl 으로 반환한 값이 된다(useState 값)
    if (myAddress === DEFAULT_ADDRESS) {
      // 내 지갑 주소가 없는경우
      alert("NO ADDRESS");
      return; // ⭐ 리턴을 해줘야한다 !
    } // 지갑주소가 없으면 알림창

    const randomTokenId = parseInt(Math.random() * 1000000);
    // TokenId 를 수동으로 지정하지않고 1000000 안에서 랜덤한 값
    KlipAPI.mintCardWithURI(
      myAddress, // useState에 담겨있는 나의주소
      randomTokenId, // 랜덤한 TokenId
      uri, // uri 인자 (이미지 링크) 👉 target.value
      setQrvalue, // mintCardWithURI에 대한 QR코드 생성
      callback => {
        // NFT 민팅이 잘 되었는지 확인
        alert(JSON.stringify(callback));
      }
    );
  };

  useEffect(() => {
    getUserData(); // 내 지갑주소 & 잔고 확인
    fetchMarketNFT(); // 마켓에 올라가있는 NFT 확인
  }, []);

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
        {qrvalue !== "DEFAULT" ? (
          // QR코드가 기본값이 아닐경우 👉 이미지가 없을땐 QR코드가 안나온다
          <Container
            style={{
              backgroundColor: "white",
              width: 300,
              height: 300,
              padding: 20,
            }}
          >
            <QRCode value={qrvalue} size={256} style={{ margin: "auto" }} />
            <br />
            <br />
          </Container>
        ) : null}
        <br />
        {/* useState 값이 변할때 화면을 보여준다 */}
        {tab === "MARKET" || tab === "WALLET" ? (
          <div className="container" style={{ padding: 50, width: "50%" }}>
            {/* map을 이용하여 nfts 배열에서 index 순서대로 이미지 출력 */}
            {nfts.map((list, index) => (
              <Card.Img
                className="img-responsive"
                key={index}
                src={nfts[index].uri}
                onClick={() => {
                  onClickCard(list.id);
                }}
                // UseCaver.js 파일에서 nfts 배열안에 👉 id와 uri
              />
            ))}
          </div>
        ) : null}

        {tab === "MINT" ? (
          <div className="container" style={{ padding: 0, width: "100%" }}>
            <Card
              className="text-center"
              style={{ color: "black", height: "50%", borderColor: "#C5B358" }}
            >
              <Card.Body style={{ opacity: 0.9, backgroundColor: "black" }}>
                {mintImgUrl !== "" ? (
                  <Card.Img src={mintImgUrl} height={"50%"} />
                ) : null}
                <Form>
                  <Form.Group>
                    <Form.Control // text input 창
                      value={mintImgUrl}
                      // 이미지를 띄워주는
                      onChange={e => {
                        console.log(e.target.value);
                        setMintImgUrl(e.target.value);
                      }} // input 창에 이미지주소를 입력하면 그대로 useState에 담긴다
                      type="text"
                      placeholder="이미지 주소를 입력하세요"
                    />
                  </Form.Group>
                  <br />
                  <Button
                    onClick={() => {
                      onClickMint(mintImgUrl);
                    }}
                    variant="primary"
                    style={{
                      backgroundColor: "#810034",
                      borderColor: "#810034",
                    }}
                  >
                    발행하기
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        ) : null}
      </div>

      <nav
        style={{ backgroundColor: "#1b1717", height: 45 }}
        className="navbar fixed-bottom navbar-light"
        role="navigation"
      >
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            <div
              onClick={() => {
                setTab("MARKET");
                fetchMarketNFT();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div style={{ color: "white" }}>MARKET</div>
            </div>
            <div
              onClick={() => {
                setTab("MINT");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div style={{ color: "white" }}>MINT</div>
            </div>
            <div
              onClick={() => {
                setTab("WALLET");
                fetchMyNFT();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div style={{ color: "white" }}>WALLET</div>
            </div>
          </div>
        </Nav>
      </nav>
    </div>
  );
}

export default App;
