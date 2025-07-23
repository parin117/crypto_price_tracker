import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import { CoinContext } from '../../context/CoinContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');
  const [visibleCoins, setVisibleCoins] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const inputHandler = (event) => {
    setInput(event.target.value);
    if (event.target.value === '') {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );
    setDisplayCoin(coins);
  };

  const loadMoreCoins = async () => {
    setIsLoading(true);
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setVisibleCoins(prev => prev + 20);
    setIsLoading(false);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className='home'>
      <motion.div 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h1>Your Gateway to the <br /> <span className="crypto-word">Crypto</span> Universe</h1>
        <p>Explore the most comprehensive cryptocurrency marketplace. Join us and stay ahead in the crypto world.</p>
        <form onSubmit={searchHandler}>
          <input
            onChange={inputHandler}
            value={input}
            type="text"
            placeholder='Search for cryptocurrencies...'
            required
          />
          <button type="submit">Search</button>
        </form>
      </motion.div>
      
      <motion.div 
        className="crypto-table"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
      >
        <div className="table-layout">
          <p>No</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        <AnimatePresence>
          {displayCoin.slice(0, visibleCoins).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={`/coin/${item.id}`} className="table-layout">
                <p className='noclasss'>{item.market_cap_rank}</p>
                <div>
                  <img src={item.image} alt="" />
                  <p>{item.name + " - " + item.symbol.toUpperCase()}</p>
                </div>
                <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
                <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
                  {Math.floor(item.price_change_percentage_24h * 100) / 100}%
                </p>
                <p className='market-cap'>{currency.symbol} {item.market_cap.toLocaleString()}</p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        {displayCoin.length > visibleCoins && (
          <motion.button
            className="load-more-btn"
            onClick={loadMoreCoins}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Loading...
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Show More
              </motion.span>
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
