# CS360 1/2567 Term Project: [FoodAdvisor]
## Group Information
- **Group Name:** PakPok
## Members
| Name                         | Student ID |
|------------------------------|------------|
| Sakkapong Phiphatpornchaikul | 6309545033 |
| Chayanon Khanrit             | 6409682538 |
| Supakorn Oupkaew             | 6409682918 |
| Anallena Libha               | 6409682942 |
## Project Goal
The goal of the FoodAdvisor project is to create a user-friendly platform that facilitates seamless content management and enhances user engagement. The aim is to further enhance this platform to make it even more user-friendly and customizable to meet users' needs. This will deliver a comprehensive solution that simplifies content management, improves the user experience, and fosters collaboration within the food community.
### Features
- Feature 1: User Registration and Authentication
- Feature 2: Review and Rating System
- Feature 3: Article Publishing Platform
- Feature 4: Dynamic Food Menu
- Feature 5: Role-Based Access Control
### Technologies Used
- **Backend:** Strapi V5
- **Frontend:** React.js 
- **Hosting/Deployment:** AWS EC2
- **Database:** SQLite
## How to deploy and run the project manually
1. Launch an EC2 Instance and download the key pair for SSH access.
2. Connect to Your EC2 Instance.
3. Install Node.js and npm.
4. Clone the Repository: 
- run `git clone https://github.com/Chayanon6409682538/ProjectCS360_foodadvisor.git`
- Navigate to your project folder by running `cd ProjectCS360_foodadvisor` from your command line.
5. Start Strapi: 
- Navigate to your `./foodadvisor/api` folder by running `cd api` from your command line.
then run `yarn build yarn start &`
6. Start Next.js: 
- Navigate to your `./foodadvisor/client` folder by running `cd client` from your command line.
then run `yarn && yarn dev`
7. Build the Frontend:
- Open a new terminal window or tab, navigate to the `client` directory, and start the React app by running
  `npm run build`
8. Run the Backend:
- Navigate back to the `api` directory and start the Strapi server by running
  `npm run start`
9. Open a web browser and go to your EC2 instance's public DNS or go to http://localhost:1337.
## How to deploy and run the project using the provided bash script [Specify the bash script path in the repo]
1. Launch an EC2 Instance and download the key pair for SSH access.
2. Connect to Your EC2 Instance.
3. Install Node.js and npm.
4. Clone the Repository: 
- run `git clone https://github.com/Chayanon6409682538/ProjectCS360_foodadvisor.git`
- Navigate to your project folder by running `cd ProjectCS360_foodadvisor` from your command line.
5. Run the Deployment Script:
- Ensure the script is executable by running 
  `chmod +x install_strapi_foodadvisor.sh`
- Execute the script by running 
  `./install_strapi_foodadvisor.sh`
## Project Screenshot
![Project Screenshot](image1.png)
![Project Screenshot](image2.png)
![Project Screenshot](image3.png)