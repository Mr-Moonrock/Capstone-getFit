import React from 'react';
import './styles/CardioInfo.css';
import CardioInfoImage from '../../images/CardioInfoImage.jpg';
import CardioInfoImage2 from '../../images/CardioInfoImage2.jpg';
import hittVsliss from '../../images/hittVsliss.jpg';
import heartRateChart from '../../images/heartRateChart.jpg';


function CardioInfo () {

  return (
    <div className='container'> 

      
      <div className='row'> 
        <div className='col'> 
          <h1 class='display-1' className="text-center"> Cardio Information </h1>
          <div className='container py-3 opacity-bkgrd' >
            <p> 
            When most people think of cardio, they often assume that it involves running. However, there are plenty of cardiovascular exercises that don’t require running. Cardio workouts can be anything that increases your heart rate. That can be biking, jump rope, swimming, climbing stairs, hiking and even dancing. To start, it’s important to know what exactly cardio is, why it’s important for your health and what type of cardio can meet your exercise needs. 
            </p>
          </div>
        </div>
      </div>

      <div className='row'>
        <div classname='col'>
          <div className='container py-3 opacity-bkgrd'>
            <h3 className="text-center"> What is Cardio? </h3>
            <p> 
            Cardiovascular exercises, also known as aerobic exercises, are workouts that get your heart rate up. It’s most used for weight loss or fat reduction, but cardio can do more than just help you lose weight (which we will discuss) and really make a difference on your overall health.

            Any quick movements or actions that boost your heart rate to a projected target heart rate zone are referred to as aerobic exercises. These types of workouts rely on the body's ability to use oxygen during the workout, which varies depending on the individual. According to research published by the American Heart Association, genetics have a 20 percent to 40 percent influence on your cardio performance. Furthermore, women have a 25 percent lower cardiovascular capacity than males, and this ability declines with aging for both sexes.
            </p>
          </div>
        </div>
      </div>
      <img src={CardioInfoImage} className='cardioImg'/>
      <div className='row'>
        <div classname='col'>
          <div className='container py-3 opacity-bkgrd'> 
            <h3 className="text-center"> The Benefits of Cardio </h3> 
            <p> 
            There are few activities that provide all of the physical and       mental health benefits that cardiovascular exercise does in a short amount of time. Cardio has a number of well-known advantages, including:
            <ul>
              <li> Strengthening your heart </li>
              <li> Burning fat and calories, which may help lose weight </li>
              <li> Boosting moods, relieving anxiety and stress </li>
              <li> Expanding lung capabilities and amount of air your lungs can hold </li>
              <li> Increasing bone density with weight-bearing workouts like hiking and climbing </li>
              <li> Reducing risk of heart attack, high cholesterol, high blood pressure, diabetes and some forms of cancer </li>
            </ul>  
            All of these benefits are great reasons to try to incorporate cardio activity into your daily routine. Even if it’s just for a few times a week, it can have a lasting positive impact on your health and wellness. Studies show that 150 minutes of exercise a week can increase life expectancy by about seven years over those who don’t
            </p>  
          </div>
        </div>
      </div>

      <div className='row'>
        <div classname='col'>
          <div className='container py-3 opacity-bkgrd'> 
            <h3 className="text-center"> Weight Loss vs. Fat Loss </h3>
            <p>
            It’s true that not all cardio is created equal, and some types may work better than others for each individual. In fact, did you know that there are actually three types of cardio? There are three types of training styles: high-intensity interval training (HIIT), moderate-intensity steady state (MISS) and low-intensity steady state (LISS). These three categories of cardio can all lead to a similar result of getting fit and burning calories.
            </p>
          </div>
          
          <div className='container py-3 opacity-bkgrd'>
            <h4 className="text-center"> High-Intensity Interval Training (HIIT) Cardio </h4>
            <p>
            HIIT workouts consist of short bursts of strong or explosive anaerobic exercise followed by a brief rest period until fatigue. Anaerobic workouts are the only type of high-intensity cardiovascular exercise that results in lactic acid accumulation, which causes muscular soreness. Interval training is basically putting brief, intense and explosive bursts of energy into a workout for 5 to 30 seconds at a time in order to raise your heart rate by 90 percent. It's then followed by a period of rest until your heart rate recovers.
            </p>
            <p>
            Increased metabolism (rate that calories are burned), lasting 24 to 48 hours, as well as an increase in muscle size, strength and power are all possible benefits of HIIT. Gaining a high metabolism can help your body burn more calories inside and outside of the gym as well as improve your body mass index (BMI). Your BMI is a calculation of your body mass and height to determine if your weight is healthy. Sprinting, spinning, burpees and planks (oh my!) are great ways to incorporate high-intensity intervals into your workout. Intervals of 20 seconds of high-intensity, high-resistance cycling followed by 40 seconds of low-intensity, low-resistance cycling is a good exercise to try out on a bike. It might even be as simple as a 20-second sprint followed by a 40-second break before repeating the process. Athletes, individuals interested in weight loss and those looking to train at a higher level of intensity can all benefit from HIIT cardio.
            </p>
            <img src={CardioInfoImage2} className='cardioImg-2'/>
            <p>
            <b> <i> Is fast-paced and high-intensity cardio right for you? </i> </b> High-intensive workouts burn a ton of calories in a small amount of time. If you like short workouts, the gym session will be the shortest of the three types of cardio which makes it the most time efficient for a person with a busy schedule. It can also be a great way to gain and retain muscles while preserving and increasing your metabolism. Although, HIIT exercises tend to have a larger recovery period. With its difficult routines it’s commonly affiliated with muscle soreness post-workout. It can also elevate your cortisol levels, which is known as the stress hormone.
            </p>
          </div>
          
          <div className='container py-3 opacity-bkgrd'>
            <h4 className="text-center"> Moderate-Intensity Steady State (MISS) Cardio </h4>
            <p>
            MISS cardio is one of the most prevalent forms of exercise. What types of physical activity count as a MISS workout? Well, it is technically anything that causes a heart rate of 140 to 160 beats per minute, such as jogging, elliptical or stair master.
            </p>
            <img src={hittVsliss} className='hittVsliss'/>
            <p>
            The type of cardio burns much more calories than HIIT. MISS cardio can help individuals who wish to build their endurance and endorphins, as well as competitive or endurance athletes and people who want to relieve stress. These activities, like HIIT, require a higher amount of oxygen and are classified as aerobic. This raises your heart rate and makes your lungs work harder, which helps you burn calories. The elliptical, spin bike, stair master, jogging, rowing, treadmill and other cardio machines are great ways to incorporate this into your workout. This type of training can help you burn the most calories if your objective is to lose weight.
            </p>
            
            <p>
            <b><i>Is MISS cardio right for you?</i></b> If you enjoy an array of different workout routines, moderate-intensity exercises tend to have a wide variety of things to do even without a lot of experience and skill. MISS workouts also can help you to burn a large number of calories and help elevate your metabolism. However, moderate-intensity workouts can risk burning proteins that can be used as fuel. Weight-bearing activities like hiking can also increase the chance of joint injuries.
            </p>
          </div>

          
            
            <img src={heartRateChart} className='heartRateChart'/>
          

          <div className='container py-3 opacity-bkgrd'>
            <h4 className="text-center"> Low-Intensity Steady State (LISS) Cardio </h4>
            <p>
            LISS is a type of cardio that keeps your heart rate between 100 and 130 beats per minute. It's a steady pace between 50 and 70 percent of your maximum heart rate. This style workout has far more fat-burning potential than HIIT or MISS. LISS is a fat-burning aerobic activity that does not have the metabolic after burn effect, which is also known as excess post-exercise oxygen consumption (EPOC). EPOC refers to the increase in your metabolism’s rate at which it burns calories after a workout session.
            </p>
            <p>
            Walking or riding your bike for 30 minutes are easy ways to get your low-intensity steady state cardio in. Strength or powerlifting athletes, those who need to produce a caloric deficit, persons who work sedentary (sitting) occupations, the elderly, people interested in weight loss and those looking to just relieve some stress are who would benefit the most from LISS.
            </p>
            <p>
            <b><i> Would you rather take your time and take it slow with LISS cardio? </i></b> Low-intensity exercises can burn a high percent of body fat and has a low recovery period. LISS can also help calm your nervous system and allow you to relax. If you are a beginner this can be a great type of cardio to start out with considering it’s simple routines, although it may be time consuming.
            </p>
            <p> 
            Whether it’s HIIT, MISS or LISS, cardiovascular exercises are important to burn calories, elevate metabolism, and improve or maintain your overall health and wellness. So, if you are looking to build those muscles and lose some body fat, cardio is a great way to do just that! Of course, we always advise that if you’re considering incorporating one of these activities into your daily routine to first check in with your provider to discuss which one might best fit your needs
            </p>
          </div>
        </div>
      </div>
    </div>
    
    
  )
}

export default CardioInfo;