import Caver from "caver-js";
import KIP17ABI from "../abi/KIP17TokenABI.json";
import {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  CHAIN_ID,
  KIP17_CONTRACT,
} from "../constants/index";
// import axios from "axios";

const option = {
  // Klaytn Node API를 사용하기 위한 코드 (Docs에 나와있음)
  headers: [
    {
      name: "Authorization",
      value:
        "Basic " +
        Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
    },
    { name: "x-chain-id", value: CHAIN_ID },
  ],
};

const caver = new Caver(
  new Caver.providers.HttpProvider(
    "https://node-api.klaytnapi.com/v1/klaytn",
    option
  )
); // Klaytn Node API를 사용하기 위한 코드 (Docs에 나와있음)

const NFTContract = new caver.contract(KIP17ABI, KIP17_CONTRACT);
// // ⭐ 개발자는 '스마트 컨트랙트 주소'와 'ABI'를 알면 'caver' 를 통해
// // ⭐ 스마트 컨트랙트를 생성하고 / 특정 함수를 실행할 수 있다
export const fetchCardsOf = async address => {
  const nftOf = await NFTContract.methods.balanceOf(address).call();
  // 스마트컨트랙트 배포후에 나오는 함수
  // 해당 주소에 몇개의 NFT를 보유중인지 개수를 표시하는 함수 balanceOf
  console.log("보유수", nftOf);

  const tokenIds = [];
  for (let i = 0; i < nftOf; i++) {
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
    // 해당주소와 배열의 몇번째인지 숫자를 입력하면 tokenId 가 나온다
    tokenIds.push(id);
    // 빈배열에 반복문을 돌려서 tokenId를 push 한다
  }

  const tokenUris = [];
  for (let i = 0; i < nftOf; i++) {
    const metadataUrl = await NFTContract.methods.tokenURI(tokenIds[i]).call();
    // 👉 메타데이터 KAS 주소
    // https://metadata-store.klaytnapi.com/e2d83fbb-c123-811c-d5f3-69132v482c51/4a85e6be-3215-93e6-d8a9-3a7d633584e7.png 👉 이런식으로 적혀있고
    let response = await fetch(metadataUrl);
    // axios 로 불러와서 변수에 담아준다
    let uriJSON = await response.data;
    // response 의 json 데이터를 변수에 담아준다
    tokenUris.push(uriJSON);
    // 빈배열에 반복문을 돌려서 uriJSON안에 이미지를 뽑아내서 push 한다
  }
  console.log("아이디", tokenIds);
  console.log("이미지", tokenUris);

  // const tokenUris = [];
  // for (let i = 0; i < nftOf; i++) {
  //   const uris = await NFTContract.methods.tokenURI(tokenIds[i]).call();
  //   // 해당 tokenId를 입력하면 tokenURI(이미지) 가 나온다
  //   tokenUris.push(uris);
  //   // 빈배열에 반복문을 돌려서 tokenURI를 push 한다
  // }
  // console.log(`${tokenIds}`);
  // console.log(tokenUris);

  const nfts = [];
  for (let i = 0; i < nftOf; i++) {
    nfts.push({ id: tokenIds[i], uri: tokenUris[i] });
    // 빈배열에 반복문을 돌려서 객체타입으로 담는다
  }
  console.log("nfts", nfts);
  return nfts;
};

// 블록체인 노드에 직접적으로 콜하기 어려워서 KAS 를 사용
// KAS 는 우리가 블록체인에 접근하는걸 도와준다
// 스마트컨트랙트에 있는 데이터를 읽고 실행하는걸 도와준다
// 이 과정에서 Caver-js 를 쓰면 인간이 사용하는 코드를
// 스마트컨트랙트 블록체인이 이해할수 있는 코드로 변형해줘서
// Klaytn 노드와 상호작용할 수 있도록 도와준다

export const getBalance = address => {
  return caver.rpc.klay.getBalance(address).then(res => {
    // 클레이 잔고를 확인 (다른코인이 있다면 klay말고 적으면 된다)
    const balance = caver.utils.convertFromPeb(
      // convertFromPeb -> 10 ** 18 로 클레이단위를 변경
      caver.utils.hexToNumberString(res)
      // 16진수문자열로 변경
    );
    console.log("잔고", balance);
    return balance;
  });
};

// export const setCountNum = async newCount => {
//   try {
//     const privateKey =
//       "0xbeff228febd4abbe6ab5d89ac3c5cfe82b1608ec525faef1c05147bdb5338925";
//     const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
//     caver.wallet.add(deployer);

//     const receipt = await CountContract.methods.setCount(newCount).send({
//       from: deployer.address,
//       gas: "0x4bfd200",
//     });
//     console.log(receipt);
//   } catch (error) {
//     console.log(error);
//   }
// };
