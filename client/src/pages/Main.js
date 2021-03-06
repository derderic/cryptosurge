import React, { useEffect } from 'react';
import Coin from '../components/Coin';
import styled from '@emotion/styled';

import { cutFloatValue } from '../lib/helpers';
import LoadingCoinRender from '../components/LoadingCoinRender';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @media (max-width: 379px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default function Main() {
  const [coins, setCoins] = React.useState([]);
  const [isLoading, setLoading] = React.useState();

  const createTrendColor = (currentChange) => {
    if (currentChange.toString().charAt(0) === '-') {
      return '#FF4136';
    } else {
      return '#2ECC40';
    }
  };

  async function getData() {
    try {
      setLoading(true);
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/`);
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container>
      {isLoading ? (
        <LoadingCoinRender />
      ) : (
        coins.map((coin) => (
          <Coin
            trendColor24h={createTrendColor(
              coin.market_data.price_change_percentage_24h
            )}
            trendColor7d={createTrendColor(
              coin.market_data.price_change_percentage_7d
            )}
            trendColor30d={createTrendColor(
              coin.market_data.price_change_percentage_30d
            )}
            link={coin.id}
            key={coin.id}
            coinName={coin.id}
            coinLogo={coin.image.thumb}
            change24h={cutFloatValue(
              coin.market_data.price_change_percentage_24h
            )}
            change7d={cutFloatValue(
              coin.market_data.price_change_percentage_7d
            )}
            change30d={cutFloatValue(
              coin.market_data.price_change_percentage_30d
            )}
            currentPrice={coin.market_data.current_price.usd}
          />
        ))
      )}
    </Container>
  );
}
