import "./App.css";
import "./market.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import * as KlipAPI from "./api/UseKlip";
import * as KASAPI from "./api/UseKAS";
import { fetchCardsOf, getBalance } from "./api/UseCaver";
import {
  Alert,
  Container,
  Card,
  Nav,
  Form,
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { MARKET_CONTRACT } from "./constants";

const DEFAULT_QR_CODE = "DEFAULT"; // QR코드는 기본 DEFAULT 값
const DEFAULT_ADDRESS = "0x00000000000000000"; // 주소 기본값

function App() {
  const [nfts, setNfts] = useState([]);
  // 인자로 들어가는값은 tokenId, tokenUri
  // UseCaver.js 파일에서 nfts 배열안에 👉 id와 uri
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(
    "0x319229707F620F673a1261DCcCe4E239A71f3Bc0"
  );
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState("MARKET"); // Footer 하단 클릭하면 바뀌는 useState
  const [mintImgUrl, setMintImgUrl] = useState("");
  const [mintTokenId, setMintTokenId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "MODAL",
    onConfirm: () => {},
  });

  const rows = nfts.slice(nfts.length / 2);
  // nfts에 있는 nft 배열을 몇개 보여줄건지
  const fetchMarketNFT = async () => {
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
      // ModalProps 의 값을 설정
      setModalProps({
        title: "NFT를 마켓에 판매 하시겠습니까?",
        onConfirm: () => {
          onClickMyCard(id);
        },
      });
      setShowModal(true);
      // 모달창 띄우기 (true)
    }
    if (tab === "MARKET") {
      // ModalProps 의 값을 설정
      setModalProps({
        title: "NFT를 구매 하시겠습니까?",
        onConfirm: () => {
          onClickMarketCard(id);
        },
      });
      setShowModal(true);
      // 모달창 띄우기 (true)
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
    // ModalProps 의 값을 설정
    setModalProps({
      title: "Klip 지갑을 연결하시겠습니까?",
      onConfirm: () => {
        KlipAPI.getAddress(setQrvalue, async address => {
          setMyAddress(address);
          const balance = await getBalance(address);
          // UseCaver.js 에서 가져온 getBalance
          setMyBalance(balance);
        });
      },
    });
    setShowModal(true);
    // 모달창 띄우기 (true)
  };

  const onClickMint = (uri, tokenId) => {
    // const randomTokenId = parseInt(Math.random() * 1000000);
    // TokenId 를 수동으로 지정하지않고 1000000 안에서 랜덤한 값
    // 👆👆 랜덤은 지정은 이제 안씀

    const metadataURL = KASAPI.uploadMetaDate(uri);
    if (!metadataURL) {
      alert("메타데이터 업로드에 실패하였습니다");
      return;
    }

    KlipAPI.mintCardWithURI(
      myAddress, // useState에 담겨있는 나의주소
      tokenId, // 밑에서 input으로 지정된 TokenId 👉 target.value
      metadataURL, // KASAPI -에서 가져오는 메타데이터
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
          {myAddress !== DEFAULT_ADDRESS ? `${myBalance} KLAY` : "지갑연동하기"}
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
          <div className="container" style={{ padding: 0, width: "100%" }}>
            {rows.map((list, index) => (
              // 한줄에 이미지를 두개씩 출력하도록
              <Row key={`row_${index}`}>
                {/* Row 세로줄 */}
                <Col style={{ marginRight: 0, paddingRight: 0 }}>
                  {/* Column 가로줄 */}
                  <Card
                    onClick={() => {
                      onClickCard(nfts[index * 2].id);
                    }}
                  >
                    <Card.Img src={nfts[index * 2].uri} />
                  </Card>
                  [{nfts[index * 2].id}]NFT
                </Col>
                <Col>
                  {nfts.length > index * 2 + 1 ? (
                    // nfts 배열길이가 index 보다 크면 실행
                    <Card
                      onClick={() => {
                        onClickCard(nfts[index * 2 + 1].id);
                      }}
                    >
                      <Card.Img src={nfts[index * 2 + 1].uri} />
                      {/* nfts 배열안에 id와 uri 를 짝지어서 출력 */}
                    </Card>
                  ) : null}
                  {nfts.length > index * 2 + 1 ? (
                    // nfts 배열길이가 index 보다 크면 실행
                    <>[{nfts[index * 2 + 1].id}]NFT</>
                  ) : null}
                </Col>
              </Row>
            ))}
            {/* map을 이용하여 nfts 배열에서 index 순서대로 이미지 출력 */}
            {/* {nfts.map((list, index) => (
              <Card.Img
                className="img-responsive"
                key={index}
                src={nfts[index].uri}
                onClick={() => {
                  onClickCard(list.id);
                }}
                // UseCaver.js 파일에서 nfts 배열안에 👉 id와 uri
              />
            ))} */}
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
                    <br />
                    <Form.Control // text input 창
                      value={mintTokenId}
                      // 토큰ID
                      onChange={e => {
                        console.log(e.target.value);
                        setMintTokenId(e.target.value);
                      }} // input 창에 토큰ID를 입력하면 그대로 useState에 담긴다
                      type="text"
                      placeholder="Token ID를 입력하세요"
                    />
                  </Form.Group>
                  <br />
                  <Button
                    onClick={() => {
                      onClickMint(mintImgUrl, mintTokenId);
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
      <Modal
        centered
        size="md"
        show={showModal}
        // useState 상태값 true 혹은 false 👉 false이면 모달창 안나타탐
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header
          style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
        >
          <Modal.Title>{modalProps.title}</Modal.Title>
        </Modal.Header>
        <Modal.Footer
          style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
        >
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              modalProps.onConfirm();
              setShowModal(false);
            }}
            style={{ backgroundColor: "#810034", borderColor: "#810034" }}
          >
            진행
          </Button>
        </Modal.Footer>
      </Modal>
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
              <div className="footer-hover">MARKET</div>
            </div>
            <div
              onClick={() => {
                setTab("MINT");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div className="footer-hover">MINT</div>
            </div>
            <div
              onClick={() => {
                setTab("WALLET");
                fetchMyNFT();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div className="footer-hover">WALLET</div>
            </div>
          </div>
        </Nav>
      </nav>
    </div>
  );
}

export default App;
