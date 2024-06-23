import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import hitt from '../images/hitt.jpg';
import liss from '../images/liss.jpg';
import miss from '../images/miss.jpg';
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption, Button } from 'reactstrap';
import './styles/CardioCarousel.css';

  const items = [
    { src: hitt, altText: 'HITT Cardio', caption: 'HITT Cardio', link: '/cardioInfo', },
    { src: miss, altText: 'MISS Cardio', caption: 'MISS Cardio', link: '/cardioInfo', },
    { src: liss, altText: 'LISS Cardio', caption: 'LISS Cardio', link: '/cardioInfo', },
  ];
  
  function CardioCarousel(props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
  
    const next = () => {
      if (animating) return;
      const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
    };
  
    const previous = () => {
      if (animating) return;
      const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
      setActiveIndex(nextIndex);
    };
  
    const goToIndex = (newIndex) => {
      if (animating) return;
      setActiveIndex(newIndex);
    };

    const onExiting = () => {
      setAnimating(true);
    };
  
    const onExited = () => {
      setAnimating(false);
    };
  
    const slides = items.map((item, index) => {
      return (
        <CarouselItem onExiting= {onExiting}
                      onExited= {onExited}
                      key={index}
                      className='cardio-carousel-slide-item'
        >
          <div className='cardio-carousel-img-container'>
            <div className='cardio-overlay-image'> 
            <img  src={item.src} 
                  alt={item.altText} 
                  className="d-block w-100" 
                  id= {`cardio-carousel-img-${index}`} 
                  data-active={index === activeIndex ? 'true' : 'false'}
            />
            </div>
          </div>
          <CarouselCaption captionText={
          <Link to={item.link} className='cardio-carousel-btn'>
            Learn More
          </Link>} captionHeader={item.caption} className="cardio-carousel-caption"
        />
        </CarouselItem>
      );
    });
  
    return (
      <div className='cardio-carousel-container'>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        {...props}
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} aria-label="cardio-Previous" />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} aria-label="cardio-Next"/>
      </Carousel>
      </div>
    );
}

export default CardioCarousel;