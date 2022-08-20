import axios from "axios";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, CHAIN_ID } from "../constants/index";

export const uploadMetaDate = async imageUrl => {
  const option = {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
      "x-chain-id": CHAIN_ID,
      "content-type": "application/json",
    },
  };

  // 👆👆👆 대괄호를 풀어서 작성한 option 👆👆👆
  // const option = {
  //   // Klaytn Node API를 사용하기 위한 코드 (Docs에 나와있음)
  //   headers: [
  //     {
  //       name: "Authorization",
  //       value:
  //         "Basic " +
  //         Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
  //     },
  //     { name: "x-chain-id", value: CHAIN_ID },
  //   ],
  // };

  // const _name = "wavescats";
  // const _description = "THISISWAVES🌊";

  const metadata = {
    metadata: {
      name: "wavescats",
      description: "THISISWAVES🌊",
      image: imageUrl,
    },
    // https://refs.klaytnapi.com/ko/metadata/latest#operation/uploadMetadata
    // 여기서 API 에 필요한 데이터를 적는다
    // imageUrl 은 파라미터로 가져옴
  };

  try {
    const res = await axios.post(
      "https://metadata-api.klaytnapi.com/v1/metadata",
      metadata,
      option
    ); // 위에서 설정한 metadata와 option 값
    console.log(res);

    return res.data.uri;
  } catch (e) {
    console.log(e);
    return false;
  }
};
