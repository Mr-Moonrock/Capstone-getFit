require('dotenv').config();
const router = require('express').Router();
const pool = require('../db');

//--------------- BMR ROUTES --------------------------------

router.post('/bmr/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { bmrData } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const existingBmr = await pool.query(
      `SELECT * FROM bmr WHERE user_id = $1`, 
      [userId]
    );

    if (existingBmr.rows.length > 0) {
      const updatedBmr = await pool.query(`
        UPDATE bmr
        SET bmr = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
        RETURNING *`, [userId, bmrData]);

      return res.status(200).json(updatedBmr.rows[0]);
    } else {
        const newBmr = await pool.query(`
        INSERT INTO bmr (user_id, bmr, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, 
        [userId, bmrData]);
        
      return res.status(200).json(newBmr.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/bmr/:userId', async (req, res) => {
  try{
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    };
    
    const bmrData = await pool.query(`
      SELECT bmr 
      FROM BMR WHERE user_id = $1
      ORDER BY updated_at DESC 
      LIMIT 1`, [userId])
      
    if (bmrData.rows.length === 0) {
      return res.status(400).json({ message: 'BMR data not found' });
    };
    
    res.status(200).json({ userBmrData: bmrData.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
});

//--------------- THR ROUTES --------------------------------

router.post('/thr/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { thrMax, thrMin } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    if (thrMax === undefined || thrMin === undefined) {
      return res.status(400).json({ message: 'THR data is missing' });
    }

    const existingThr = await pool.query(`
    SELECT * FROM thr WHERE user_id = $1`, [userId]
    );

    if (existingThr.rows.length > 0) {
      
      const updatedThr = await pool.query(
        `UPDATE thr 
         SET thr_max = $2, thr_min = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $1 
         RETURNING *`,
        [userId, thrMax, thrMin]
      );

      res.status(200).json({ userThrData: updatedThr.rows[0] });
    } else {
      
      const newThr = await pool.query(
        `INSERT INTO thr (user_id, thr_max, thr_min, created_at, updated_at) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, [userId, thrMax, thrMin]
      );

      res.status(200).json({ userThrData: newThr.rows[0] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/thr/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    }

    const thrData = await pool.query(
      `SELECT thr_max, thr_min 
       FROM thr 
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 1`,
      [userId]
    );

    if (thrData.rows.length === 0) {
      console.warn(`THR data not found for user ID: ${userId}`);
      return res.status(400).json({ message: 'THR data not found' });
    }

    res.status(200).json({ userThrData: thrData.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//------------- FFMI ROUTES --------------------------------

router.post('/ffmi/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { ffmi, fatFreeMass, totalBodyFat } = req.body;
    
    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    }

    if (ffmi === undefined || fatFreeMass === undefined || totalBodyFat === undefined) {
      return res.status(400).json({ message: 'FFMI data is missing' });
    }

    const existingFfmi = await pool.query(
      `SELECT * FROM ffmi WHERE user_id = $1`,
      [userId]
    );

    if (existingFfmi.rows.length > 0) {
      const updatedFfmi = await pool.query(
        `UPDATE ffmi 
         SET ffmi = $2, fat_free_mass = $3, total_body_fat = $4, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $1 
         RETURNING *`,
        [userId, ffmi, fatFreeMass, totalBodyFat]
      );

      res.status(200).json({ userFfmiData: updatedFfmi.rows[0] });
    } else {
      
      const newFfmi = await pool.query(
         `INSERT INTO ffmi (user_id, ffmi, fat_free_mass, total_body_fat, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, 
        [userId, ffmi, fatFreeMass, totalBodyFat]
      );

      res.status(200).json({ userFfmiData: newFfmi.rows[0] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/ffmi/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    }

    const ffmiData = await pool.query(`
      SELECT FFMI, fat_free_mass, total_body_fat FROM ffmi WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`, [userId]
    );

    if (ffmiData.rows.length === 0) {
      console.warn(`FFMI data not found for user ID: ${userId}`);
      return res.status(400).json({ message: 'FFMI data not found' });
    }

    res.status(200).json({ userFfmiData: ffmiData.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


//---------- AJBW ROUTES ---------------------------------

router.post('/ajbw/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { ajbw, ibwRobinson } = req.body;
    
   
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    if (ajbw === undefined || ibwRobinson === undefined) {
      return res.status(400).json({ message: 'AjBW data is missing' });
    }

    const existingAjbw = await pool.query(
      `SELECT * FROM ajbw WHERE user_id = $1`,
      [userId]
    );

    if (existingAjbw.rows.length > 0) {
    
      const updatedAjbw = await pool.query(
        `UPDATE ajbw 
         SET ajbw = $2, ibw_robinson = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $1 
         RETURNING *`,
        [userId, ajbw, ibwRobinson]
      );

      res.status(200).json({ userAjbwData: updatedAjbw.rows[0] });
    } else {
      
      const newAjbw = await pool.query(
        `INSERT INTO ajbw (user_id, ajbw, ibw_robinson, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`, [userId, ajbw, ibwRobinson]
      );

      res.status(200).json({ userAjbwData: newAjbw.rows[0] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/ajbw/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    }

    const ajbwData = await pool.query(
      `SELECT AjBW, IBW_Robinson 
       FROM ajbw 
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 1`,
      [userId]
    );

    if (ajbwData.rows.length === 0) {
      console.warn(`AjBW data not found for user ID: ${userId}`);
      return res.status(400).json({ message: 'AjBW data not found' });
    }

    res.status(200).json({ userAjbwData: ajbwData.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ------------ BODYFAT ROUTES -------------------------------

router.post('/bodyfat/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { navyBFP } = req.body;

    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    }

    if (navyBFP === undefined) {
      return res.status(400).json({ message: 'Navy BFP data is missing' });
    }

    const existingBodyFat = await pool.query(
      `SELECT * FROM bodyfat WHERE user_id = $1`,
      [userId]
    );

    if (existingBodyFat.rows.length > 0) {
      const updatedBodyFat = await pool.query(
        `UPDATE bodyfat SET navy_bfp = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *`,
        [userId, navyBFP]
      );

      res.status(200).json({ userBodyfatData: updatedBodyFat.rows[0] });
    } else {
      const newBodyFat = await pool.query(
        `INSERT INTO bodyfat (user_id, navy_bfp, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
        [userId, navyBFP]
      );

      res.status(200).json({ userBodyfatData: newBodyFat.rows[0] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/bodyfat/:userId', async (req, res) => {
  try{
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    };
    
    const bodyfatData = await pool.query(`
    SELECT navy_BFP FROM bodyfat WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`, [userId]
    );
    
    if (bodyfatData.rows.length === 0) {
        return res.status(400).json({ message: 'Bodyfat data not found' });
    };
    
    res.status(200).json({ userBodyfatData: bodyfatData.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
});

//----------BODYINFO ROUTES--------------------------------

router.post('/bodyInfo/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { formName, ...bodyInfoData } = req.body;
    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    };

    const existingUserInfo = await pool.query(
      `SELECT * FROM user_body_info WHERE user_id = $1`, 
      [userId]);

    if (existingUserInfo.rows.length > 0) {
      let updateFields = [];
      let updateValues = [userId];

      switch (formName) {
        case 'bmr':
          if (bodyInfoData.weight !== undefined) {
            updateFields.push('user_weight = $' + (updateValues.length + 1));
            updateValues.push(bodyInfoData.weight);
          }
          break;
        case 'thr':
          if (bodyInfoData.fitnessLevel !== undefined) {
            updateFields.push('user_fitness_level = $' + (updateValues.length + 1));
            updateValues.push(bodyInfoData.fitnessLevel);
          }
          break;
        case 'bodyfat':
          if (bodyInfoData.age !== undefined) {
            updateFields.push('user_age = $' + (updateValues.length + 1));
            updateValues.push(bodyInfoData.age);
          }
          if (bodyInfoData.height !== undefined) {
            updateFields.push('user_height = $' + (updateValues.length + 1));
            updateValues.push(bodyInfoData.height);
          }
          if (bodyInfoData.gender !== undefined) {
            updateFields.push('user_gender = $' + (updateValues.length + 1));
            updateValues.push(bodyInfoData.gender);
          }
          if (bodyInfoData.waist !== undefined) {
            updateFields.push('user_waist = $' + (updateValues.length + 1));
            updateValues.push(bodyInfoData.waist);
          }
          if (bodyInfoData.neck !== undefined) {
            updateFields.push('user_neck = $' + (updateValues.length + 1));
            updateValues.push(bodyInfoData.neck);
          }
          if (bodyInfoData.hip !== undefined) {
            updateFields.push('user_hip = $' + (updateValues.length + 1));
            updateValues.push(bodyInfoData.hip);
          }
          break;
        default:
          return res.status(400).json({ message: 'Invalid form name' });
      };

      if (updateFields.length > 0) {
        const updateQuery = `
          UPDATE user_body_info 
          SET ${updateFields.join(', ')} 
          WHERE user_id = $1 
          RETURNING *`;

        const updatedUserInfo = await pool.query(updateQuery, updateValues);

        return res.json(updatedUserInfo.rows[0]);
      } else {
        return res.status(400).json({ message: 'No valid fields to update' });
      }
    } else {

      const insertValues = [
        userId,
        bodyInfoData.fitnessLevel || 0,
        bodyInfoData.age || 0,
        bodyInfoData.weight || 0,
        bodyInfoData.height || 0,
        bodyInfoData.gender || 0,
        bodyInfoData.waist || 0,
        bodyInfoData.neck || 0,
        bodyInfoData.hip || 0,
        bodyInfoData.bodyFat || 0
      ];

      const bodyInfoThrValues = await pool.query(`
        INSERT INTO user_body_info (user_id, user_fitness_level, user_age, user_weight, user_height, 
                                    user_gender, user_waist, user_neck, user_hip, user_bodyfat, 
                                    created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *`, insertValues);

      return res.json(bodyInfoThrValues.rows[0]);
    };
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  };
});

router.get('/bodyInfo/:userId', async (req, res) => {
  try{
    const {userId} = req.params;

    if (!userId) {
      return res.status(404).json({ message: 'User ID is missing' });
    };
    
    const bodyInfoData = await pool.query(
      `SELECT user_age, user_weight, user_height, user_gender, user_waist, user_neck, user_hip, user_fitness_level, user_bodyfat 
      FROM user_body_info 
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 1`, 
      [userId]
    );
    if (bodyInfoData.rows.length === 0) {
      return res.status(400).json({message: 'User Body Info not found' });
    };

    res.status(200).json({ userBodyInfoData: bodyInfoData.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
});

module.exports = router;