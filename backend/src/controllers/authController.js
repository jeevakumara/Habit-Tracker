import admin from 'firebase-admin';

// ==================== REGISTER ====================
export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Email, password, and name are required'
            });
        }

        console.log('👤 Registering new user:', email);

        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
        });

        console.log('✅ Firebase user created:', userRecord.uid);

        await admin.firestore().collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: email,
            name: name,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('✅ User stored in Firestore');

        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: userRecord.uid,
            email: userRecord.email,
            name: userRecord.displayName,
            customToken: customToken,
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            error: error.message,
            code: error.code,
        });
    }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password required'
            });
        }

        console.log('🔍 Login attempt for email:', email);

        const usersSnapshot = await admin
            .firestore()
            .collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const userDoc = usersSnapshot.docs[0];
        const userId = userDoc.id;
        const userData = userDoc.data();

        console.log('✅ User found:', userId);

        const customToken = await admin.auth().createCustomToken(userId);

        console.log('✅ Custom token created');

        res.status(200).json({
            success: true,
            message: 'Login successful',
            userId: userId,
            email: userData.email,
            name: userData.name || 'User',
            customToken: customToken,
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            error: error.message,
            code: error.code,
        });
    }
};

// ==================== GET USER PROFILE ====================
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // ✅ CRITICAL FIX: Validate userId
        if (!userId || userId === ':userId' || userId === 'undefined') {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID provided'
            });
        }

        console.log('👤 Fetching profile for:', userId);

        const userDoc = await admin.firestore().collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const userData = userDoc.data();

        // ✅ CRITICAL FIX: Add success flag
        res.status(200).json({
            success: true,
            user: {
                uid: userId,
                ...userData
            }
        });

    } catch (error) {
        console.error('❌ Profile fetch error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
