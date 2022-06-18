# 미니프로젝트 #1

## Dapp (NFT 생성, NFT 구매 & 판매)

### 프로젝트 소개

**ERC-721 기반으로한 NFT를 생성하고 직접 판매 및 구매를 
간단하게 해볼 수 있는 Dapp 입니다**<br>
폴리곤 **'Mumbai 테스트넷'** 을 이용하여 작업했습니다<br><br>
https://github.com/wavescats/mini-project/pulls?q=is%3Apr+is%3Aclosed
<br>(👆 단계별 코드 링크)

✅ web3 기능적인 부분에 집중하느라 CSS 요소를 많이 반영하지 못했습니다
(추후에 CSS 보완예정)

![image](https://user-images.githubusercontent.com/97342533/174450118-c7eec064-e6f2-4a4f-aff2-4d0d3c97ead7.png)
<br/>

***

### 사용된 스택

- React (리액트)
- Typescript (타입스크립트)
- chakra-ui (리액트 ui 라이브러리)
- Solidity (솔리디티)
- Remix IDE

***

### 기능 소개

1. 폴리곤 Mumbai 테스트넷 으로 메타마스크를 연결합니다<br><br>
![image](https://user-images.githubusercontent.com/97342533/174450690-1829c3fe-2ed1-48de-bc53-8a25680b5325.png)

2. 5개의 이미지 중 한개를 랜덤하게 NFT로 생성(mint) 하여 지갑에 소유하게 됩니다<br><br>
![](https://velog.velcdn.com/images/-__-/post/75bb1ebf-8b9f-4938-9d04-8c9428061f0e/image.gif)

3. 지갑에 소유한 NFT를 판매할 수 있는 권한을 얻습니다<br><br>
![ezgif com-gif-maker](https://user-images.githubusercontent.com/97342533/173223755-df81d544-56a2-47d5-803a-a93ce6bb2f54.gif)

4. 권한을 얻었으면 원하는 가격에 판매(Sell) 할 수 있습니다<br>
❗ 본인이 판매 등록한 NFT는 구매 하지 못하게 버튼이 비활성화 됩니다<br><br>
![ezgif com-gif-maker (1)](https://user-images.githubusercontent.com/97342533/173223903-e97f3c14-6fd2-434e-84c1-b9bc1b9ab42b.gif)
5. 계정을 변경하여 판매중인 NFT를 구매(Buy) 하면<br><br>
6. 금액만큼 Matic 이 감소하고 상대방 계정으로 Matic이 들어갑니다
![ezgif com-gif-maker (5)](https://user-images.githubusercontent.com/97342533/174449819-54f6db8a-cfa4-478d-b394-a3d5ec8f21ff.gif)


***

