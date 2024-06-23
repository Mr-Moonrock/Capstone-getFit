import React, { useState, useEffect } from 'react';
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import armsImage from './../images/armsImage.jpg';
import backImage from './../images/backImage.jpg';
import chestImage from './../images/chestImage.jpg';
import lowerLegsImage from './../images/lowerLegsImage.jpg';
import shouldersImage from './../images/shouldersImage.jpg';
import neckImage from './../images/neckImage.jpg';
import './styles/ExercisesCarousel.css';

const items = [
  { src: backImage, altText: 'Back Exercises', caption: 'Back Exercises', link: '/back' },
  { src: armsImage, altText: 'Arm Exercises', caption: 'Arm Exercises', link: '/arms' },
  { src: chestImage, altText: 'Chest Exercises', caption: 'Chest Exercises', link: '/chest' },
  { src: lowerLegsImage, altText: 'Lower Leg Exercises', caption: 'Leg Exercises', link: '/legs' },
  { src: neckImage, altText: 'Neck Exercises', caption: 'Neck Exercises', link: '/neck' },
  { src: shouldersImage, altText: 'Shoulder Exercises', caption: 'Shoulder Exercises', link: '/shoulders' },
];

function ExercisesCarousel(props) {
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
                    key= {index}
                    className='exercises-carousel-slide-item'
      >
        <div className='exercises-carousel-img-container'>
          <div className='exercises-overlay-image'> 
            <img  src={item.src} 
                  alt={item.altText} 
                  className='d-block w-100'
                  id= {`exercise-carousel-img-${index}`}
                  key= {index}
                  data-active={index === activeIndex ? 'true' : 'false'}
            />
          </div>
        </div>
        <CarouselCaption captionText={
          <Link to={item.link} className='exercises-carousel-btn'>
            Go to Exercises
          </Link>} captionHeader={item.caption} className="exercises-carousel-caption"
        />
        </CarouselItem>
    );
  });

  return (
    <div className='exercises-carousel-container'>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        {...props}
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} aria-label="exercise-Previous" />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} aria-label="exercise-Next" />
      </Carousel>
    </div>
  );
}

export default ExercisesCarousel;
