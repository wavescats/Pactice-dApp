import { Button, Grid, Text, Box, Flex } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import AnimalCard from "../components/AnimalCard";
import { mintAnimalTokenContract, saleAnimalTokenAddress } from "../contracts";

interface MyAnimalProps {
  account: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<string[]>();
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const getAnimalTokens = async () => {
    try {
      const balanceLength2 = await mintAnimalTokenContract.methods
        // 스마트컨트랙트 배포후에 나오는 함수
        .balanceOf(account) // NFT 가지고 있는 갯수 조회 (인자에는 주소를 넣어야한다)
        .call(); // 함수 부르기

      const tempAnimalCardArray = []; // 빈배열

      for (let i = 0; i < parseInt(balanceLength2, 10); i++) {
        // string 타입이기 때문에 parseInt로 숫자로 형변환을 해준다, 10진수
        // main.tsx에서는 최근순서대로 조회했으나 (배열의 맨 마지막 length - 1)
        // 👉 이번에는 for문으로 0번부터 순서대로 조회할것이다

        const animalTokenId2 = await mintAnimalTokenContract.methods
          // 스마트컨트랙트 배포후에 나오는 함수
          .tokenOfOwnerByIndex(account, i)
          // NFT의 Id 값을 조회 (인자는 주소와, 조회하려는 배열순번)
          // 👉 for문으로 돌려서 나온 i 값을 인자로 넣어준다
          .call(); // 함수 부르기

        const animalType2 = await mintAnimalTokenContract.methods
          // 스마트컨트랙트 배포후에 나오는 함수
          .animalTypess(animalTokenId2)
          // 어떤 NFT를 뽑았는지 조회 (인자에는 NFT id를 넣는다)
          .call(); // 함수 부르기

        tempAnimalCardArray.push(animalType2);
        // 빈배열에 for문으로 돌려서 나온 i 순서대로 animalTokenId2를 push한다
      }

      setAnimalCardArray(tempAnimalCardArray);
      // my-animal 링크로 들어가면 👉 어떤 NFT들이 뽑혔는지 NFT 이미지배열을 출력해주는 useState
    } catch (error) {
      console.error(error);
    }
  };

  const getApprovedForAllCall = async () => {
    // onwer가 특정계정에게 자신의 모든 NFT에 대한 사용을 허용했는지 여부를 확인하는 변수
    try {
      const res = await mintAnimalTokenContract.methods
        // 스마트컨트랙트 배포후에 나오는 함수
        .isApprovedForAll(account, saleAnimalTokenAddress)
        // ERC-721 내장함수 - isApprovedForAll 👉 onwer가 특정계정에게 자신의 모든 NFT에 대한 사용을 허용했는지 여부를 반환
        // 판매권한을 줬는지 확인
        .call(); // 함수 부르기

      if (res === true) {
        // res 변수가 true 일경우는
        setSaleStatus(res);
        // useState 기본값은 false 이나 res를 담아줌으로써 true로 자동 변경
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApproveToggle = async () => {
    try {
      if (!account) return; // 계정이 없는경우는 그냥 리턴

      const res = await mintAnimalTokenContract.methods
        .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
        // 인자는 판매자의 주소와, true & false 의 상태
        // !saleStatus이면 기본값이 false니까 그 반대인 true 라는 뜻이다
        // 👉 즉, 판매자에게 true (허용) 해주라는 뜻이다
        // ERC-721 내장함수 - setApprovalForAll 👉 특정계정에게 자신이 소유한 모든 NFT에 대한 사용을 허용해주는 함수
        // false를 👉 true 로 허용해준다
        .send({ from: account }); // account 으로부터 함수 보내주기

      if (res.status) {
        // res 의 상태가 true 이거나 false 이면
        setSaleStatus(!saleStatus);
        // set useState안에 useState를 넣음으로써
        // 버튼을 클릭할때마다 true <ㅡ> false 계속 변경된다
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;
    // 맨처음 useEffect가 실행되면 account는 없기때문에 에러가 뜰것이다
    // 그래서 if 문을 하나 생성해야한다
    // 👉 account가 없을경우는 그냥 리턴

    getApprovedForAllCall();
    getAnimalTokens();
  }, [account]);

  return (
    <React.Fragment>
      <Flex alignItems="center">
        <Text display="inline-block">
          Sale Status : {saleStatus ? "True" : "False"}
          {/* 3항연산자 👉 useState 값이 참이면 "True" 거짓이면 "False"를 출력*/}
        </Text>
        <Button
          size="xs"
          marginLeft="2"
          colorScheme={saleStatus ? "red" : "blue"}
          onClick={onClickApproveToggle}
        >
          {/* 센터자리에 Text와 버튼을 한줄로 만들고 버튼색상 적용 */}
          {saleStatus ? "Cancel" : "Approve"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(10, 1fr)" gap={5} marginTop={4}>
        {/* Grid(격자) 한줄에 4개씩 배열, 갭은 8로 준다 */}
        {/* ⭐ animalCardArray는 NFT가 담겨있는 배열이다 
      animalCardArray가 있다면 map을 한다 
      ⭐ map 함수는 배열 안에서 원하는 것만 빼내서 출력이 가능하다.*/}
        {animalCardArray &&
          animalCardArray.map((value, index) => {
            return <AnimalCard key={index} animalType={value} />;
            // 👉 value : 배열 내 현재 값 (string)
            // 👉 index : 배열 내 현재 값의 인덱스 (순번)
          })}
      </Grid>
    </React.Fragment>
  );
};

export default MyAnimal;
