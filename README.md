# Introduction
Our platform is built on the belief that achieving fitness goals should be accessible and straightforward. GetFit provides a comprehensive suite of tools and resources tailored to meet your individual fitness needs. From calculating essential metrics like Basal Metabolic Rate (BMR) and Target Heart Rate (THR), to planning and scheduling personalized workout routines, GetFit equips you with everything you need to optimize your fitness journey.

Explore a wide range of exercises through our intuitive Exercise Pages, complete with instructional gifs and detailed written guides. Plan your workouts in advance using our interactive Calendar feature, which forecasts your weekly exercise regimen and seamlessly integrates with your personalized dashboard.

GetFit isn't just about numbers—it's about empowering you to make informed decisions about your health. Whether you're looking to shed pounds, build muscle, or simply maintain a healthy lifestyle, GetFit provides the tools and knowledge to help you achieve your goals.


## Features
### - Exercise Pages 
- Users can easily find workouts they are interested in, accompanied by instructional gifs and written instructions for clarity.


### - Target Heart Rate Form
- Helps users determine their Target Heart Rate and displays it on their dashboard. 

### - Basal Metabolic Rate Form
- Calculates the user's Basal Metabolic Rate to estimate daily calorie expenditure.

### - Adjustable Body Weight Form
- Enables users to calculate their Ideal Body Weight and Adjustable Body Weight. 

### - Body Fat Form
- Allows users to estimate their body fat percentage.

### Fat-Free Mass Index
- Calculates the user's muscle-to-fat ratio.

### Dashboard Features
Extracts user data for Target Heart Rate (THR), Basal Metabolic Rate (BMR), and Body Fat, displaying them on the user's dashboard.

### Calendar 
- Users can plan exercise routines based on specific body parts, create workout schedules for days or weeks in advance, and view a 7-day exercise forecast on their dashboard. 

## Getting Started

### - Installation
- To install dependencies, run: 'npm install'

### - Starting the application

- Start frontend with: 'npm run client'
- Start backend with: 'nodemon server.js'


### - Testing the application
Frontend tests are located in the 'client/components/__tests__' folder.
- To run all frontend tests with Jest: 'jest'
- To test a single file: 'jest fileName.test.js'

Backend test are located in the 'server/routes/__tests__' folder.
- To run all backend tests: 'npm test'
- To test a single file: 'npm test fileName.test.js'
  
### - User Flow 

#### -Homepage 
The first page users encounter provides non-members with information on simple lifestyle improvements and the importance of BMI.

#### -Login/Register: 
Users can register to become members and access additional features.

#### -Dashboard: 
Members can view all calculations and results on their dashboard, including a 7-day workout forecast. Future updates will include upcoming classes.

### Additional Options from Dashboard

#### BMI route- 
Allows users to fill out multiple forms for initial setup or to update their weight and dimensions.

#### Exercise pages- 
Discover new workouts.

#### Life Changes/Cardio Info Pages: 
Learn about different types of cardio and their benefits, as well as lifestyle improvements.

#### Calendar page: 
Customize workouts and plan weekly/monthly schedules.

### API Documentation
#### - Health Calculator API
All calculations on the website are performed using the Health Calculator API, which offers various options for fitness tracking applications. (https://health-calculator-api.p.rapidapi.com) 

#### -  ExerciseDB API
Exercise information, including gifs, is sourced from the ExerciseDB API, providing developers with easy integration for fitness and exercise applications. (https://exercisedb.p.rapidapi.com). 


## Future of the application

### Upcoming features:
#### Equipment Page:
A page where users can purchase top-brand workout equipment and supplements at competitive prices. 

#### Online Classes: 
Integration with the calendar to schedule online classes such as yoga, bodyweight exercises, and calisthenics. 

#### Buttons to simplify features/navigation:
Addition of save buttons on exercise cards to allow users to save exercises directly to their calendar.

## Concerns and Issues
Encountered issues include the dropping of exercises on the calendar requiring multiple attempts to register, and challenges with testing Exercise/Cardio Carousels. Unfortunately, the FullCalendar docs doesn't do a great job explaining this particular scenario, nor is there much information on YouTube or online. 
## 
Other issues I had was with testing the Exercise/Cardio Carousels. I was having trouble detecting when the certain imgs were 'active' was 'true or false'. I tried mocking timers, and using fireEvents on the buttons, but neither approach was working properly.

For the backend testing, I ran into problems with registering a 404 error with the missing userId, and also ensuring that the 2nd pool.query for the 'INSERT' was being called on the forms. The test would come back as a (200), however the format of the INSERT query continually failed the test. 

