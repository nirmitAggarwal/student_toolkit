import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createUserIfNotExists } from './userController.js';

export const githubCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      console.error('GitHub credentials not configured');
      console.log(process.env.GITHUB_CLIENT_SECRET);
      console.log(process.env.GITHUB_CLIENT_ID);
      return res.status(500).json({ message: 'GitHub configuration error' });
    }

    // Exchange code for GitHub access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('GitHub token exchange failed:', tokenResponse.status, tokenResponse.statusText);
      return res.status(400).json({ message: 'Failed to exchange code for token' });
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub token error:', tokenData.error_description);
      return res.status(400).json({ message: 'Failed to authenticate with GitHub', error: tokenData.error_description });
    }

    if (!tokenData.access_token) {
      console.error('No access token in response');
      return res.status(400).json({ message: 'No access token received from GitHub' });
    }

    // Fetch user data from GitHub API
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      console.error('GitHub user fetch failed:', userResponse.status, userResponse.statusText);
      return res.status(400).json({ message: 'Failed to fetch GitHub user data' });
    }

    const githubUser = await userResponse.json();

    if (githubUser.error) {
      return res.status(400).json({ message: 'Failed to fetch GitHub user data' });
    }

    // Create or get user in MongoDB
    const user = await createUserIfNotExists(githubUser);

    if (!user) {
      return res.status(500).json({ message: 'Failed to create user' });
    }

    // Create JWT token
    const jwtToken = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        rollNumber: user.rollNumber,
        theme: user.theme,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error('GitHub authentication error:', error);
    res.status(500).json({ message: 'GitHub authentication failed' });
  }
};

export const healthCheck = (req, res) => {
  res.json({ status: 'ok', message: 'Auth service is running' });
};
