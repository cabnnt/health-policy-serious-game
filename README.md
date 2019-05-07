# Doctor, Doctor
A serious health policy game for COMP 585 (Serious Games) in spring 2019 at the University of North Carolina at Chapel Hill. The game is built in React with a simple Firebase backend. Built collaboratively by Christopher Bennett, Zach Lennane, Olivia Nieto Rickenbach, and Jon-Michael Hancock.

### Deployment Instructions

**Note: the '/build' folder  is in the .gitignore so it will not be committed**

- Run `npm install` to get the latest version of the dependencies
  - Run `npm serve` to test locally
- When satisfied run `npm run build` or `npm run build —prod` if pushing to production
  - *Note:* the `—prod` flag makes the build run significantly longer due to optimizations
- Run `firebase deploy` to deploy the application
- https://comp585-health-policy.firebaseapp.com/ <- **CLICK ME**

