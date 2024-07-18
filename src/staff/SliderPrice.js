import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import styled from 'styled-components';
import numeral from 'numeral';

const RangeSliderContainer = styled.div`
  width: 400px;
  margin: 0 auto;
`;

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 8px;
  position: relative;
`;

const StyledThumb = styled.div`
  height: 16px;
  width: 16px;
  background-color: #A2041B;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #800000;
    transform: scale(1.2) translateY(-50%);
  }
`;

const Thumb = (props, state) => <StyledThumb {...props} />;

const StyledTrack = styled.div`
  top: 50%;
  height: 8px;
  transform: translateY(-50%);
  background: ${(props) => (props.index === 2 ? '#ddd' : props.index === 1 ? '#A2041B' : '#ddd')};
  border-radius: 999px;
  position: absolute;
  transition: background-color 0.3s;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const SliderPrice = ({ onPriceChange, priceRange }) => {
  const [values, setValues] = useState(priceRange);

  useEffect(() => {
    setValues(priceRange);
  }, [priceRange]);

  const handleChange = (newValues) => {
    setValues(newValues);
    onPriceChange(newValues);
  };

  return (
    <RangeSliderContainer>
      <StyledSlider
        value={values}
        onChange={handleChange}
        renderTrack={Track}
        renderThumb={Thumb}
        min={0}
        max={300}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <span>Min: {numeral(values[0] * 1000000).format(0, 0)} VND</span>
        <span>Max: {numeral(values[1] * 1000000).format(0, 0)} VND</span>
      </div>
    </RangeSliderContainer>
  );
};

export default SliderPrice;
