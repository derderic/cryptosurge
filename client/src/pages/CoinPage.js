import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { RadialChart, RadarChart, CircularGridLines } from 'react-vis';
import TradingViewWidget from 'react-tradingview-widget';
import CoinDetailsRefs from '../components/CoinDetailsRefs';
import CoinInformationTable from '../components/CoinDetails/CoinInformationTable';
import { AdBanner } from '../components/CoinDetails/CoinDetailsGlobalComponents';
import { Ticker } from '../components/CoinDetails/Ticker';

import { cutFloatValue } from '../lib/helpers';
import { TickerTableElement } from '../components/CoinDetails/TickerComponents';
import { CoinDetailsTableRow } from '../components/CoinDetails/CoinInformationTableComponents';
import Skeleton from 'react-loading-skeleton';

const InformationBar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 30px;
  height: auto;
  flex-wrap: wrap;
  box-shadow: 0px 9px 15px -5px rgba(0, 0, 0, 0.75);
`;

const ResponsiveWrapper = styled.div`
  width: 100%;
  height: auto;
  flex-wrap: wrap;
`;

const PieChartHeading = styled.h2`
  color: ${(props) => props.theme.text};
  text-align: center;
  font-weight: 200;
`;
const PieChartCointainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LiveChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  width: 100%;
  margin-top: 30px;
  height: 500px;
  box-shadow: 0px 9px 15px -5px rgba(0, 0, 0, 0.75);
`;
const MiddleContainer = styled.div`
  background-color: ${(props) => props.theme.background};
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`;

const MiddleContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
`;

export default function CoinPage({ match }) {
  const [windowSize] = React.useState(useWindowSize().width);
  const [isLoading, setLoading] = React.useState(true);
  const [coin, setCoin] = React.useState({
    image: {},
    market_cap_rank: 0,
    block_time_in_minutes: 0,
    coingecko_score: 10,
    developer_score: 10,
    community_score: 10,
    liquidity_score: 10,
    public_interest_score: 10,
    market_data: { ath: 0, atl: 0, current_price: {}, price_change_24h: {} },
    categories: {},
    tickers: [],
    links: {
      homepage: [],
      blockchain_site: [],
      repos_url: {
        github: [],
      },
      official_forum_url: [],
    },
    last: {},
  });
  const [marketData, setMarketData] = React.useState({
    data: [],
  });

  const checkLink = (target) => {
    if (target === 'binance-coin') {
      return 'binancecoin';
    } else {
      return target;
    }
  };

  function useWindowSize() {
    const isClient = typeof window === 'object';

    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined,
      };
    }

    const [windowSize, setWindowSize] = React.useState(getSize);

    useEffect(() => {
      if (!isClient) {
        return false;
      }

      function handleResize() {
        setWindowSize(getSize());
      }
      console.log(windowSize);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
  }

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${checkLink(match.params.id)}`
        );
        const data = await response.json();
        setCoin(data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    getData();
    getHistoryData();
  }, []);

  async function getHistoryData() {
    try {
      const response = await fetch(
        `https://api.coincap.io/v2/assets/${match.params.id}/markets`
      );
      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const checkAvailable = (target) => {
    const data = target;
    if (data === '' || data === null) {
      return 'none';
    } else {
      return 'flex';
    }
  };

  const checkGitHub = (target) => {
    if (!target.length) {
      return 'none';
    } else {
      return 'flex';
    }
  };

  const checkIfNull = (target) => {
    if (target === null) {
      return '-';
    } else {
      return target;
    }
  };

  const createTrendColor = (currentChange) => {
    if (currentChange.toString().charAt(0) === '-') {
      return '#FF4136';
    } else {
      return '#2ECC40';
    }
  };

  function checkAvailability(arr, val) {
    return arr.some(function (arrVal) {
      return val === arrVal;
    });
  }

  const unavailableSitesArray = [
    'bitcoin-cash-sv',
    'leo-token',
    'ftx-token',
    'paxos-standard',
    'true-usd',
    'husd',
    'enjincoin',
  ];

  const animationData = {
    damping: 8,
    stiffness: 14,
  };

  const DOMAIN = [
    { name: 'CoingeckoScore', domain: [0, 100] },
    { name: 'DeveloperScore', domain: [0, 100] },
    { name: 'CommunityScore', domain: [0, 100] },
    { name: 'LiquidityScore', domain: [0, 100] },
    { name: 'PublicInterestScore', domain: [0, 100] },
  ];

  const data = [
    {
      DeveloperScore: coin.developer_score,
      CommunityScore: coin.community_score,
      CoingeckoScore: coin.coingecko_score,
      LiquidityScore: coin.liquidity_score,
      PublicInterestScore: coin.public_interest_score,
    },
  ];

  console.log(windowSize);

  return (
    <ResponsiveWrapper>
      <InformationBar>
        <CoinDetailsRefs
          currentChange={createTrendColor(coin.market_data.price_change_24h)}
          currentPrice={coin.market_data.current_price.usd}
          coinName={coin.name}
          coinImage={coin.image.small}
          coinNameID={coin.symbol}
          coinSite={coin.links.homepage[0]}
          coinForumSite={coin.links.official_forum_url[0]}
          coinBlockChainSite={coin.links.blockchain_site[0]}
          coinRedditSite={coin.links.subreddit_url}
          coinGithubSite={coin.links.repos_url.github[0]}
          displayAvailableWebsite={checkAvailable(coin.links.homepage[0])}
          displayAvailableForum={checkAvailable(
            coin.links.official_forum_url[0]
          )}
          displayAvailableBlockchain={checkAvailable(
            coin.links.blockchain_site[0]
          )}
          displayAvailableGithub={checkGitHub(coin.links.repos_url.github)}
          displayAvailableReddit={checkAvailable(coin.links.subreddit_url)}
        ></CoinDetailsRefs>
        <CoinInformationTable
          tableHeading={'Base Information'}
          rowName1={'CoinGecko Rank'}
          rowEntry1={isLoading ? <Skeleton width={50} /> : coin.coingecko_rank}
          rowName2={'CoinMarket Rank'}
          rowEntry2={isLoading ? <Skeleton width={50} /> : coin.market_cap_rank}
          rowName3={'Type'}
          rowEntry3={
            isLoading ? (
              <Skeleton width={50} />
            ) : (
              checkIfNull(coin.categories[0])
            )
          }
          rowName4={'All Time High'}
          rowEntry4={
            isLoading ? (
              <Skeleton width={50} />
            ) : (
              checkIfNull('$' + coin.market_data.ath.usd)
            )
          }
          rowName5={'All Time Low'}
          rowEntry5={
            isLoading ? <Skeleton width={50} /> : '$' + coin.market_data.atl.usd
          }
          rowName6={'Circulating Supply'}
          rowEntry6={
            isLoading ? (
              <Skeleton width={50} />
            ) : (
              coin.market_data.circulating_supply
            )
          }
          rowName7={'Total Supply'}
          rowEntry7={
            isLoading ? <Skeleton width={50} /> : coin.market_data.total_supply
          }
        />
        <PieChartCointainer>
          {isLoading ? (
            <Skeleton width={270} height={270} circle={true} />
          ) : (
            <div>
              <PieChartHeading>Radial View</PieChartHeading>
              <RadarChart
                data={data}
                domains={DOMAIN}
                style={{
                  polygons: {
                    fillOpacity: 0.4,
                    strokeWidth: 2,
                    strokeOpacity: 1,
                  },
                  axes: {
                    text: { opacity: 0.0 },
                  },
                  labels: {
                    textAnchor: 'middle',
                    fontSize: 11,
                    fontWeight: 400,
                  },
                }}
                margin={{
                  left: 55,
                  top: 50,
                  bottom: 20,
                  right: 65,
                }}
                width={windowSize < 700 ? 250 : 350}
                height={windowSize < 700 ? 200 : 300}
                animation={true}
              >
                <CircularGridLines
                  tickValues={[...new Array(10)].map((v, i) => i / 9 - 1)}
                  style={{ fill: 'none', stroke: 'black', opacity: 0.1 }}
                />
              </RadarChart>
            </div>
          )}
        </PieChartCointainer>
        <PieChartCointainer>
          {isLoading ? (
            <Skeleton width={270} height={270} circle={true} />
          ) : (
            <div>
              {' '}
              <PieChartHeading>Community Prediction</PieChartHeading>
              <RadialChart
                data={[
                  {
                    angle: coin.sentiment_votes_up_percentage,
                    label: 'Buy',
                  },
                  {
                    angle: coin.sentiment_votes_down_percentage,
                    label: 'Sell',
                  },
                ]}
                width={windowSize < 700 ? 250 : 300}
                height={windowSize < 700 ? 200 : 300}
                animation={animationData}
                labelsRadiusMultiplier={0.6}
                labelsStyle={{
                  fontSize: 14,
                }}
                showLabels
              />
            </div>
          )}
        </PieChartCointainer>
      </InformationBar>
      <AdBanner />
      <MiddleContainer>
        <MiddleContainerWrapper>
          {windowSize < 700 ? (
            ''
          ) : (
            <LiveChartContainer>
              <PieChartHeading>Live Data</PieChartHeading>
              <TradingViewWidget
                symbol={coin.symbol + 'USD'}
                locale='en'
                autosize
              />
            </LiveChartContainer>
          )}
        </MiddleContainerWrapper>
        <Ticker
          heading={'Market Watch'}
          display={
            checkAvailability(unavailableSitesArray, match.params.id)
              ? 'none'
              : 'flex'
          }
          width={windowSize < 700 ? '100%' : '30%'}
          currentCoin={match.params.id}
          tickerTableContent={
            checkAvailability(unavailableSitesArray, match.params.id)
              ? ''
              : marketData.data.map((ticker) => {
                  if (
                    ticker.quoteSymbol === 'USD' ||
                    ticker.quoteSymbol === 'USDT'
                  ) {
                    return (
                      <CoinDetailsTableRow key={ticker.volumeUsd24Hr}>
                        <TickerTableElement>
                          {ticker.exchangeId} ({ticker.quoteSymbol})
                        </TickerTableElement>
                        <TickerTableElement>
                          {'$' + cutFloatValue(ticker.priceUsd)}
                        </TickerTableElement>
                        <TickerTableElement>
                          {cutFloatValue(ticker.volumeUsd24Hr)} (24H)
                        </TickerTableElement>
                      </CoinDetailsTableRow>
                    );
                  } else {
                    return '';
                  }
                })
          }
        />
      </MiddleContainer>
    </ResponsiveWrapper>
  );
}
