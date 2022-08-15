import axios from "axios";
import { KIP17_CONTRACT, MARKET_CONTRACT } from "../constants";

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";
// 공통적으로 들어가는 URL, 파라미터 👉 변수로 지정해준다
const isMobile = window.screen.width >= 1280 ? false : true;
// 모바일 👉 1280px 이 넘어갈 경우 false 작으면 true
const getKlipAccessUrl = (method, request_key) => {
  // 모바일에서 사용하는 Klip Api (ios, android)
  if (method === "QR") {
    return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
  }
  return `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
  // 카카오톡 어플로 연결되는 Api
  // 딥링크 👉 모바일 어플의 특정 페이지에 도달 할 수 있는 링크
};

// safeTransferFrom 함수 (판매(송금)기능)
export const saleCard = async (
  // toAddress는 안필요하다 👉 무조건 마켓으로만 보내니까 !
  fromAddress,
  tokenId,
  setQrCodeValue,
  callback
) => {
  const abiJson =
    '{ "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
  // safeTransferFrom 함수가 두개 있는데 _data 인자가 있고 없고 차이이다
  // 사실 아무거나 써도 상관없다
  // 👉 _data가 없는 safeTransferFrom 함수를 사용하겠다!
  // 인자는 fromAdderss, toAddress(마켓), tokenId 👉 이렇게 3개
  executeContract(
    KIP17_CONTRACT,
    abiJson,
    "0",
    `[\"${fromAddress}\",\"${MARKET_CONTRACT}\",\"${tokenId}\"]`,
    setQrCodeValue,
    callback
  );
};

// 마켓컨트랙트에서 buyNFT 함수 (구매기능)
export const buyCard = async (
  // Address는 사실상 고정이나 마찬가지이다(그래서 주소값은 필요없음)
  tokenId,
  setQrCodeValue,
  callback
) => {
  const abiJson =
    '{ "constant": false, "inputs": [ { "name": "tokenId", "type": "uint256" }, { "name": "NFT", "type": "address" } ], "name": "buyNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }';
  executeContract(
    MARKET_CONTRACT,
    abiJson,
    "10000000000000000", // 0.01 KLAY를 주고 구입 (NFT가격)
    `[\"${tokenId}\",\"${KIP17_CONTRACT}\"]`,
    setQrCodeValue,
    callback
  );
};

export const mintCardWithURI = async (
  toAddress,
  tokenId,
  uri,
  setQrCodeValue,
  callback
) => {
  // callback 함수 👉 결과값을 가져온다음에 이러이러한 일을 했으면 그 값을 가지고 다음일을 해!
  const abiJson =
    '{"constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
  // 실행하고자 하는 ABI만 가져온다 (민트하기위한 함수만)
  // https://www.textfixer.com/tools/remove-line-breaks.php 👈 여기서
  // 한줄로 바꿔준다음 "쌍따옴표" 가 아닌 '따옴표' 를 붙여준다
  executeContract(
    KIP17_CONTRACT,
    abiJson,
    "0",
    `[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`,
    setQrCodeValue,
    callback
  );
};

export const executeContract = (
  txTo,
  abi,
  value,
  params,
  setQrCodeValue,
  callback
) => {
  axios
    .post(A2P_API_PREPARE_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "execute_contract",
      transaction: {
        to: txTo, // 파라미터값을 인자로 받는다
        abi: abi, // 파라미터값을 인자로 받는다
        value: value, // 파라미터값을 인자로 받는다
        params: params, // 어떤값으로 변경할지 (파라미터값)
      },
    })
    .then(res => {
      const requestKey = res.data.request_key;
      // API 로부터 request_key 값

      if (isMobile) {
        // 모바일에서 앱이랑 연결할 경우
        window.location.href = getKlipAccessUrl("android", requestKey);
        // 브라우저(window)에서는 👉 getKlipAccessUrl 의 파라미터값대로
      } else {
        setQrCodeValue(getKlipAccessUrl("QR", requestKey));
        // 콜백함수에 담음 (모바일이 아닐경우) 👉 QR 메소드
      }

      let timeId = setInterval(() => {
        // 주기적으로 실행한다 (1초마다)
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
          ) // result API에 request_key 값
          .then(res2 => {
            if (res2.data.result) {
              // result 값이 있다면
              clearInterval(timeId); // 주기적으로 실행하던걸 중지
              console.log(`[Result] ${JSON.stringify(res2.data.result)}`);
              // pending 상태일땐 1초마다 계속 setInterval
              callback(res2.data.result);
              setQrCodeValue("DEFAULT");
              // QR코드를 사용 후에는 초기화시켜준다
            }
          });
      }, 1000); // 1초마다
    });
};

export const getAddress = (setQrCodeValue, callback) => {
  axios
    .post(A2P_API_PREPARE_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "auth",
    })
    .then(res => {
      const requestKey = res.data.request_key;
      if (isMobile) {
        // 모바일에서 앱이랑 연결할 경우
        window.location.href = getKlipAccessUrl("android", requestKey);
        // 브라우저(window)에서는 👉 getKlipAccessUrl 의 파라미터값대로
      } else {
        setQrCodeValue(getKlipAccessUrl("QR", requestKey));
        // 콜백함수에 담음 (모바일이 아닐경우) 👉 QR 메소드
      }

      let timeId = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
          )
          .then(res2 => {
            if (res2.data.result) {
              console.log(`[Result] ${JSON.stringify(res2.data.result)}`);
              callback(res2.data.result.klaytn_address);
              clearInterval(timeId);
              setQrCodeValue("DEFAULT");
              // QR코드를 사용 후에는 초기화시켜준다
            }
          });
      }, 1000);
    });
};

// export const setCount = (count, setQrCodeValue) => {
//   // 카운터
//   axios
//     .post(A2P_API_PREPARE_URL, {
//       bapp: {
//         name: APP_NAME,
//       },
//       type: "execute_contract",
//       transaction: {
//         to: COUNT_CONTRACT,
//         abi: '{ "constant": false, "inputs": [{ "name": "_count", "type": "uint256" }], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
//         value: "0",
//         params: `[\"${count}\"]`, // count값을 뭘로 변경할건지 (파라미터값)
//       },
//     })
//     //     { // 클립 API 에 👉 execute_contract 👉 transaction 파라미터
//     //   "transaction": {
//     //     "from": "0x8756...4321", // optional
//     //     "to": "0xA987...4321", // contract address
//     //     "value": "1000000000000000000", // 단위는 peb. 1 KLAY
//     //     "abi": "...",
//     //     "params": "..."
//     //   }
//     // }
//     .then(res => {
//       const requestKey = res.data.request_key;
//       // API 로부터 request_key 값
//       const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${requestKey}`;
//       setQrCodeValue(qrcode);
//       // 콜백함수에 담음

//       let timeId = setInterval(() => {
//         // 주기적으로 실행한다 (1초마다)
//         axios
//           .get(
//             `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
//           ) // result API에 request_key 값
//           .then(res2 => {
//             if (res2.data.result) {
//               // result 값이 있다면
//               console.log(`[Result] ${JSON.stringify(res2.data.result)}`);
//               // pending 상태일땐 1초마다 계속 setInterval
//               if (res2.data.result.status === "success") {
//                 clearInterval(timeId); // 주기적으로 실행하던걸 중지
//                 // success 상태로 변하면 clearInterval 된다
//               }
//             }
//           });
//       }, 1000); // 1초마다
//     });
// };
