import React from 'react';
import './styles/LifestyleChanges.css';
import lifestyleDietImage from '../images/lifestyleDietImage.jpg';
import lifestyleActiveImage from '../images/lifestyleActiveImage.jpg';
import lifestyleSleepImage from '../images/lifestyleSleepImage.jpg';


function LifestyleChanges () {
  return (
    <div>
      <h1 class='text-center' id='lifestyle-title'> Lifestyle Changes That Can Help Add Years to Your Life </h1>
      <div class='container'>
        <p> 
          Everyone wants to live a long and healthy life. Fortunately, research shows you may be able to achieve this by making some simple lifestyle changes.
        </p>
        <p>
          In a study published in the journal Circulation, Harvard researchers analyzed data from two major ongoing cohort studies that collect diet, lifestyle, and medical information on more than 100,000 adults. They aimed to investigate how a combination of healthy lifestyle choices—never smoking, a healthy weight, regular physical activity, a healthy diet, and moderate alcohol consumption—relate to a long life free of disease (also known as healthspan). The findings were powerful—those who followed all healthy habits added more than a decade to their lives compared to those who did not follow those behaviors.
        </p> 
        <p>
          But this was not the first study to link lifestyle choices with mortality. Current research suggests that there are more lifestyle changes in addition to those included in the Circulation study that impacts mortality. 
        </p>
      </div>

      <div class='container'>
        <h4 class='text-center' id='lifestyle-diet'>Eat a healthy diet </h4>
        <p>
          It likely comes as no surprise that eating healthy, nutritious foods is linked to a longer life. Research shows that diets rich in nutrient-dense plant foods may lower disease risk and promote longevity.
        </p>
        <p>
          For example, one large study of over 135,000 individuals found that a higher intake of fruits, vegetables, and legumes during meals was associated with a lower risk of cardiovascular disease and death related to cardiovascular and noncardiovascular causes. Just three to four daily servings of these foods reduced the risk of premature death by 22%. 
        </p>
        <p>
          However, consuming red and processed meats may shorten your lifespan. A meta-analysis of cohort studies revealed that individuals with the highest intake of processed and red meats had a 22% and 16% higher risk of mortality from any cause, respectively.
        </p>
        <img src={lifestyleDietImage} alt='lifestyleDietImage' className='food-image'/>
      </div>

      <div class='container'>
        <h4 class='text-center' id='lifestyle-cigarettes'> Don't Smoke Cigarettes </h4>
        <p>
          Never smoking cigarettes or quitting smoking, is a significant habit that can significantly benefit your health. Smoking is strongly linked to chronic disease and early death. The 2018 study published in Circulation found that men who smoked heavily—defined as 15 or more cigarettes per day—had the lowest chance of disease-free life expectancy at age 50, and their risk of premature death increased more than two-fold. It is not only heavy smokers that live shorter lives. Additional research shows that any amount of cigarette smoking increases mortality risk, with the risk increasing as the frequency of smoking increases. 
        </p>
        <p>
          But stopping smoking—even after years or decades—can improve chances of living longer. One study found that smokers who quit at age 35 increased their life expectancy by approximately six to nine years compared to those that continued to smoke. Even those who quit at age 65 gained could expect to live one to four years longer than their smoking peers.
        </p>
      </div>

      <div class='container'>
        <h4 class='text-center' id='lifestyle-physically-active'> Be physically active </h4>
        <img src={lifestyleActiveImage} alt='lifestyleActiveImage' className='active-image'/>
        <p> 
          Staying physically active is vital for a long and healthy life. The Physical Activity Guidelines for Americans recommends adults get at least 150 minutes of moderate-intensity aerobic physical activity each week, and current research suggests this habit might add more years of quality time to your life. 
        </p>
        <p>
          Researchers analyzed the physical activity level of two large cohorts and found that those meeting the guidelines of 150-299 minutes a week of moderate physical activity had a 19% to 25% lower risk of all-cause, cardiovascular disease, and non-cardiovascular disease mortality. The risk of premature death decreased even further for those who exercised above this level.
        </p>
        <p>
          However, the health benefits of physical activity are not exclusive to aerobic exercise. In a large meta-analysis, researchers looked at the impact of total steps on mortality. The findings revealed that those with the highest step count had a 62% lower risk of all-cause death compared to those with the lowest step count. Another meta-analysis on the impact of resistance exercise on mortality found that resistance training reduced the risk of premature death by 21%. That number was even higher at forty percent when resistance training was combined with aerobic exercise. 
        </p>       
      </div>

      <div class='container'>
        <h4 class='text-center' id='lifestyle-healthy-weight'> Maintain a healthy weight and body fat percentage </h4>
        <p> 
          Excess weight is linked to poorer health and an increased risk of metabolic disease (like type 2 diabetes). In the previously mentioned Circulation study, adults with obesity had the lowest chance of disease-free life expectancy at age fifty compared to those with a healthy weight. Obesity is typically classified in research studies using body mass index (BMI), although it is an imperfect metric at the individual level.
        </p>
        <p>
        Research also shows that body fat percentage and distribution are strong predictors of mortality, independent of BMI. In one cohort study, the largest waist circumferences, a measure of abdominal adiposity, were associated with an approximately two-fold higher mortality risk in men and women. Waist circumference was positively associated with mortality within all categories of BMI. Other studies have noted a similar correlation between body fat and an increased risk of premature death. 
        </p>
      </div>

      <div class='container'>
        <h4 class='text-center' id='lifestyle-alcohol'> Drink alcohol in moderation </h4>
        <p> 
            According to findings from the study published in Circulation, 30 grams or more of alcohol (about two or more drinks) daily increased the risk of premature death by 25 percent when compared to moderate alcohol consumption. Another prospective cohort study of over 80,000 adults found that light alcohol consumption at about 25 grams (about two drinks) a week led to the greatest reduction in heart disease, cancer, and mortality risk when compared to none or higher alcohol intake. 
        </p>
        <p> 
          Drinking moderately, according to the Dietary Guidelines for Americans, is two drinks or less in a day for men and one drink or less in a day for women. That being said, some research indicates that any alcohol consumption increases cancer risk, so it is not recommended that those who do not already drink start drinking. 
        </p>
      </div>

      <div class='container'>
        <h4 class='text-center' id='lifestyle-sleep'> Get adequate sleep </h4>
        <p>
          Sleep is an essential function that gives the body and brain time to restore and repair. Research suggests that both too little and too much sleep can hurt your health. When compared with seven hours per day of sleep, both sleeping six hours or less and greater than nine hours have been associated with an increased risk of cardiovascular disease-specific, cancer-specific, and all-cause mortality. 
        </p>
        <img src={lifestyleSleepImage} alt='lifestyleSleepImage' className='sleep-image'/>
        <p>
          Too little sleep may lead to negative health outcomes and a shorter lifespan by increasing inflammation and unfavorably altering hormone levels. The mechanism linking excessive sleep and increased risk of premature death is less clear, but researchers suspect too much sleep could be linked to risk factors for mortality such as undiagnosed chronic illnesses, depression, and low socioeconomic status.
        </p>
        
      </div>

      <div class='container'>
        <h4 class='text-center' id='lifestyle-stress'> Reduce stress and anxiety </h4>
        <p>
          Mental health may be just as important as physical health when it comes to living a long and healthy life. Studies have linked chronic stress to several negative health outcomes like elevated glucose levels, high blood pressure, and a weakened immune system, which can contribute toward disease development and ultimately mortality risk. For example, one cohort study reported a 32% increased risk of premature death in men with high stress versus low stress.
        </p>
        <p>
          ortunately, strategies to manage and reduce stress may give you years back. In a study analyzing the effects of the interaction between positive mood and perceived stress, the researchers reported a positive mood was associated with a sixteen percent reduction in mortality risk. This positive outlook successfully mitigated the negative effects of stress among high-stressed participants.
        </p>
        <p>
          Meditation and mindfulness are also beneficial for stress reduction. A meta-analysis of over 2,600 participants found that practicing mindfulness based stress reduction (MBSR) for about two and a half hours a week for eight weeks was associated with improvements in perceived stress levels.
        </p>
      </div>
    </div>
  )
}

export default LifestyleChanges;